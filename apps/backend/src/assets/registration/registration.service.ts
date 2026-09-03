import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { asset } from './schemas/schema';
import { assetType } from '../settings/asset-type/schemas/schema';
import { department } from '../../administration/department/schemas/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { assetRegistrationSchema } from '@repo/trpc/schemas';

const REGISTRATION_OUTPUT_SCHEMA = z.object({
  id: z.number().int().positive(),
  propertyNumber: z.string().min(1),
  qrCode: z.string().min(1),
  assetName: z.string().min(1),
});

@Injectable()
export class RegistrationService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  private async getNextAssetId() {
    const result = await this.database.execute(
      sql`SELECT nextval(pg_get_serial_sequence('asset', 'id')) AS next_id`,
    );

    const row = result.rows[0] as
      { next_id?: number | string | null } | undefined;
    const value = Number(row?.next_id ?? 0);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Unable to generate the next asset ID.');
    }

    return value;
  }

  private async countAssetsByDepartmentAndDate(
    departmentCode: string,
    date: Date,
  ): Promise<number> {
    const formattedDate = date.toISOString().split('T')[0];
    const result = await this.database.execute(sql`
      SELECT COUNT(*) as count
      FROM asset a
      JOIN department d ON a.department_id = d.id
      WHERE d.code = ${departmentCode}
      AND a.created_at::date = ${formattedDate}
    `);

    const count = result.rows[0]?.count;
    return typeof count === 'number' ? count : Number(count ?? 0);
  }

  private formatPropertyNumber(
    assetTypeCode: string,
    date: Date,
    existingCount: number,
  ): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const count = existingCount + 1;
    return `${year}-${month}-${day}-${assetTypeCode}-${String(count).padStart(3, '0')}`;
  }

  async create(
    input: z.infer<typeof assetRegistrationSchema>,
    createdBy?: string,
  ) {
    if (!createdBy) {
      throw new Error('Authenticated user is required to register an asset.');
    }

    const existingAsset = await this.database
      .select()
      .from(asset)
      .where(eq(asset.serialNumber, input.serialNumber))
      .limit(1)
      .then((rows) => rows[0]);

    if (existingAsset) {
      throw new Error(
        `An asset with serial number "${input.serialNumber}" already exists.`,
      );
    }

    const assetId = await this.getNextAssetId();
    const uiBaseUrl = process.env.UI_URL ?? 'http://localhost:3000';

    const selectedDepartment = await this.database
      .select()
      .from(department)
      .where(eq(department.id, input.departmentId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!selectedDepartment) {
      throw new Error('Department not found for the selected asset.');
    }

    const departmentCode = selectedDepartment.code;
    const registrationDate = new Date();
    const existingCount = await this.countAssetsByDepartmentAndDate(
      departmentCode,
      registrationDate,
    );
    const propertyNumber = this.formatPropertyNumber(
      departmentCode,
      registrationDate,
      existingCount,
    );
    const qrCode = `${uiBaseUrl.replace(/\/$/, '')}/assets/${propertyNumber}`;

    const created = await this.database
      .insert(asset)
      .values({
        id: assetId,
        assetName: input.assetName,
        brand: input.brand,
        model: input.model,
        serialNumber: input.serialNumber,
        propertyNumber,
        qrCode,
        description: input.description ?? null,
        quantity: input.quantity,
        assetPhoto: input.assetPhoto ?? null,
        categoryId: input.categoryId,
        assetTypeId: input.assetTypeId,
        conditionId: input.conditionId,
        acquisitionDate: input.acquisitionDate,
        acquisitionCost: input.acquisitionCost.toString(),
        supplierId: input.supplierId ?? null,
        purchaseOrderNumber: input.purchaseOrderNumber ?? null,
        warranty: input.warranty != null ? String(input.warranty) : null,
        supportingDocs: input.supportingDocs ?? null,
        departmentId: input.departmentId,
        custodianId: input.custodianId,
        buildingId: input.buildingId ?? null,
        roomId: input.roomId ?? null,
        status: 'active',
        createdBy,
      })
      .returning();

    const createdAsset = created[0];

    if (!createdAsset) {
      throw new Error('Unable to create the asset record.');
    }

    const result = {
      id: createdAsset.id,
      propertyNumber: createdAsset.propertyNumber,
      qrCode: createdAsset.qrCode,
      assetName: createdAsset.assetName,
    };

    REGISTRATION_OUTPUT_SCHEMA.parse(result);
    return result;
  }
}
