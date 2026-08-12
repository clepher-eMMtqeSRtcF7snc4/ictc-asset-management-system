import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { randomUUID } from 'node:crypto';
import {
  type RegisterAssetInput,
  type SaveAssetDraftInput,
} from '@repo/trpc/schemas';
import {
  assetHistory,
  assets,
  categories,
  departments,
  locations,
  user,
} from '../auth/schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { schema } from '../database/database.module';

type RegistrationInput = RegisterAssetInput | SaveAssetDraftInput;

@Injectable()
export class AssetsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async previewRegistrationIdentifiers(categoryId: number) {
    const category = await this.findCategory(categoryId);
    return this.generateIdentifiers(category.code);
  }

  async register(input: RegisterAssetInput, actorUserId: string) {
    return this.createAsset(input, actorUserId, input.status, 'registered');
  }

  async saveDraft(input: SaveAssetDraftInput, actorUserId: string) {
    return this.createAsset(input, actorUserId, 'draft', 'draft_saved');
  }

  private async createAsset(
    input: RegistrationInput,
    actorUserId: string,
    status: 'draft' | 'available' | 'assigned',
    action: 'draft_saved' | 'registered',
  ) {
    const category = await this.validateReferences(input);
    await this.ensureSerialNumberIsAvailable(input.serialNumber);
    const identifiers = this.generateIdentifiers(category.code);

    try {
      return await this.database.transaction(async (tx) => {
        const [createdAsset] = await tx
          .insert(assets)
          .values({
            ...input,
            ...identifiers,
            status,
          })
          .returning(this.assetSelection());

        if (!createdAsset) {
          throw new Error('Asset creation did not return an asset');
        }
        const [asset] = await tx
          .update(assets)
          .set({ qrValue: `/assets/${createdAsset.id}` })
          .where(eq(assets.id, createdAsset.id))
          .returning(this.assetSelection());
        if (!asset) {
          throw new Error('Asset QR URL could not be finalized');
        }

        await tx.insert(assetHistory).values({
          assetId: asset.id,
          actorUserId,
          action,
          snapshot: JSON.parse(JSON.stringify(asset)) as Record<string, unknown>,
        });

        return asset;
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(
          'An asset with this serial number already exists',
        );
      }
      throw error;
    }
  }

  private assetSelection() {
    return {
      id: assets.id,
      name: assets.name,
      assetType: assets.assetType,
      categoryId: assets.categoryId,
      departmentId: assets.departmentId,
      locationId: assets.locationId,
      custodianId: assets.custodianId,
      brand: assets.brand,
      model: assets.model,
      description: assets.description,
      condition: assets.condition,
      serialNumber: assets.serialNumber,
      barcode: assets.barcode,
      partNumber: assets.partNumber,
      acquisitionDate: assets.acquisitionDate,
      purchaseDate: assets.purchaseDate,
      acquisitionCost: assets.acquisitionCost,
      supplier: assets.supplier,
      reference: assets.reference,
      fundingSource: assets.fundingSource,
      warrantyStartDate: assets.warrantyStartDate,
      warrantyEndDate: assets.warrantyEndDate,
      usefulLife: assets.usefulLife,
      residualValue: assets.residualValue,
      depreciationMethod: assets.depreciationMethod,
      imageUrl: assets.imageUrl,
      assetTag: assets.assetTag,
      propertyNumber: assets.propertyNumber,
      qrValue: assets.qrValue,
      status: assets.status,
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
    };
  }

  private async validateReferences(input: RegistrationInput) {
    const category = await this.findCategory(input.categoryId);

    if (input.departmentId) {
      await this.requireRecord(
        (
          await this.database
            .select({ id: departments.id })
            .from(departments)
            .where(eq(departments.id, input.departmentId))
            .limit(1)
        )[0],
        'Department',
      );
    }
    if (input.locationId) {
      await this.requireRecord(
        (
          await this.database
            .select({ id: locations.id })
            .from(locations)
            .where(eq(locations.id, input.locationId))
            .limit(1)
        )[0],
        'Location',
      );
    }
    if (input.custodianId) {
      await this.requireRecord(
        (
          await this.database
            .select({ id: user.id })
            .from(user)
            .where(eq(user.id, input.custodianId))
            .limit(1)
        )[0],
        'Custodian',
      );
    }

    return category;
  }

  private async findCategory(categoryId: number) {
    const category = (
      await this.database
        .select({ id: categories.id, code: categories.code })
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1)
    )[0];
    return this.requireRecord(category, 'Category');
  }

  private async ensureSerialNumberIsAvailable(serialNumber?: string | null) {
    if (!serialNumber) return;

    const existing = (
      await this.database
        .select({ id: assets.id })
        .from(assets)
        .where(eq(assets.serialNumber, serialNumber))
        .limit(1)
    )[0];
    if (existing) {
      throw new ConflictException(
        'An asset with this serial number already exists',
      );
    }
  }

  private generateIdentifiers(categoryCode: string) {
    const code = categoryCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const suffix = randomUUID().replaceAll('-', '').toUpperCase();
    const assetTag = `AST-${code}-${suffix}`;
    const propertyNumber = `PRP-${code}-${suffix}`;

    return {
      assetTag,
      propertyNumber,
      qrValue: `asset:${assetTag}`,
    };
  }

  private requireRecord<T>(record: T | undefined, label: string): T {
    if (!record) throw new NotFoundException(`${label} not found`);
    return record;
  }

  private isUniqueViolation(error: unknown): error is { code: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: unknown }).code === '23505'
    );
  }
}
