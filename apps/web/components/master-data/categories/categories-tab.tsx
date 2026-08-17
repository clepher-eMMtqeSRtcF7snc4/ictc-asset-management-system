"use client";

import { CategoryCards } from "./category-cards";
import { StatusesSection } from "./statuses/statuses-section";
import { ConditionsSection } from "./conditions/conditions-section";

export function CategoriesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Categories</h2>
        <p className="text-sm text-muted-foreground">
          Manage standardized asset classification reference data.
        </p>
      </div>
      <CategoryCards />
      <StatusesSection />
      <ConditionsSection />
    </div>
  );
}
