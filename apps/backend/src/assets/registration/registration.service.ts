import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { asset } from './schemas/schema';
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

  private formatPropertyNumber(assetId: number) {
    const year = new Date().getFullYear();
    return `MSU-ICT-${year}-${String(assetId).padStart(6, '0')}`;
  }

  private async getNextAssetId() {
    const result = await this.database.execute(
      sql`SELECT nextval(pg_get_serial_sequence('asset', 'id')) AS next_id`,
    );

    const row = result.rows[0] as { next_id?: number | string | null } | undefined;
    const value = Number(row?.next_id ?? 0);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Unable to generate the next asset ID.');
    }

    return value;
  }

  async create(
    input: z.infer<typeof assetRegistrationSchema>,
    createdBy?: string,
  ) {
    if (!createdBy) {
      throw new Error('Authenticated user is required to register an asset.');
    }

    const assetId = await this.getNextAssetId();
    const propertyNumber = this.formatPropertyNumber(assetId);
    const uiBaseUrl = process.env.UI_URL ?? 'http://localhost:3000';
    const qrCode = `${uiBaseUrl.replace(/\/$/, '')}/assets/${assetId}`;

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
