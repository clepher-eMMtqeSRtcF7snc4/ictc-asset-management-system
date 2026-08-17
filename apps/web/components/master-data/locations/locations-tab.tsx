"use client";

import { RoomsSection } from "./rooms/rooms-section";
import { DepartmentsSection } from "./departments/departments-section";
import { CustodiansSection } from "./custodians/custodians-section";

export function LocationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Locations</h2>
        <p className="text-sm text-muted-foreground">
          Manage physical and organizational reference data.
        </p>
      </div>
      <RoomsSection />
      <DepartmentsSection />
      <CustodiansSection />
    </div>
  );
}
