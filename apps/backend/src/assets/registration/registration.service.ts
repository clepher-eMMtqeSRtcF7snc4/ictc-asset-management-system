import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { asset } from './schemas/schema';
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

  private getManilaDate(date = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  private formatPropertyNumber(
    departmentCode: string,
    registrationDate: string,
    sequence: number,
  ): string {
    return `${registrationDate}-${departmentCode}-${String(sequence).padStart(3, '0')}`;
  }

  async create(
    input: z.infer<typeof assetRegistrationSchema>,
    createdBy?: string,
  ) {
    if (!createdBy) {
      throw new Error('Authenticated user is required to register an asset.');
    }

    const uiBaseUrl = process.env.UI_URL ?? 'http://localhost:3000';

    return await this.database.transaction(async (tx) => {
      const existingAssetRows = await tx
        .select({ id: asset.id })
        .from(asset)
        .where(eq(asset.serialNumber, input.serialNumber))
        .limit(1);
      const existingAsset = existingAssetRows[0];

      if (existingAsset) {
        throw new ConflictException(
          `An asset with serial number "${input.serialNumber}" already exists.`,
        );
      }

      const selectedDepartmentRows = await tx
        .select({ code: department.code })
        .from(department)
        .where(eq(department.id, input.departmentId))
        .limit(1);
      const selectedDepartment = selectedDepartmentRows[0];

      if (!selectedDepartment) {
        throw new Error('Department not found for the selected asset.');
      }

      const departmentCode: string = selectedDepartment.code;
      const registrationDate = this.getManilaDate();

      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext(${departmentCode} || ${registrationDate}))`,
      );

      const countResult = await tx.execute(sql`
        SELECT COUNT(*)::int as count
        FROM asset a
        JOIN department d ON a.department_id = d.id
        WHERE d.code = ${departmentCode}
        AND to_char(a.created_at AT TIME ZONE 'Asia/Manila', 'YYYY-MM-DD') = ${registrationDate}
      `);

      const existingCount = Number(
        (countResult.rows[0] as { count: number } | undefined)?.count ?? 0,
      );

      const sequence = existingCount + 1;
      const propertyNumber = this.formatPropertyNumber(
        departmentCode,
        registrationDate,
        sequence,
      );
      const qrCode = `${uiBaseUrl.replace(/\/$/, '')}/assets/${propertyNumber}`;

      const created = await tx
        .insert(asset)
        .values({
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
        .returning({
          id: asset.id,
          propertyNumber: asset.propertyNumber,
          qrCode: asset.qrCode,
          assetName: asset.assetName,
        });

      const createdAsset = created[0];

      if (!createdAsset) {
        throw new Error('Unable to create the asset record.');
      }

      REGISTRATION_OUTPUT_SCHEMA.parse(createdAsset);
      return createdAsset;
    });
  }
}
