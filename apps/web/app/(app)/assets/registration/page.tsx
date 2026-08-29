"use client";

import { AssetRegistrationContentSection } from "@/components/assets/registration/asset-registration-content-section";
import { PageHeader } from "@/components/layout/page-header";
import type { AssetRegistrationInput } from "@repo/trpc/schemas";

export default function AssetRegistrationPage() {
  async function registerAsset(data: AssetRegistrationInput) {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    return { ok: true, id: 247 };
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
