"use client";

import { AssetRegistrationContentSection } from "@/components/assets/registration/asset-registration-content-section";
import { PageHeader } from "@/components/layout/page-header";
import { trpc } from "@/lib/trpc/client";
import type { AssetRegistrationInput } from "@repo/trpc/schemas";

export default function AssetRegistrationPage() {
  const createAsset = trpc.registrationRouter.create.useMutation();

  async function registerAsset(data: AssetRegistrationInput) {
    try {
      const result = await createAsset.mutateAsync(data);
      return {
        ok: true,
        id: result.id,
        propertyNumber: result.propertyNumber,
        qrCode: result.qrCode,
        assetName: result.assetName,
        message: "Asset registered successfully.",
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Asset registration failed.",
      };
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Registration"
        description="Register a new ICT asset and generate a QR sticker for physical inventory."
      />
      <AssetRegistrationContentSection onRegister={registerAsset} />
    </div>
  );
}
