"use client";

import { RegistrationFormValues } from "@repo/trpc/schemas";
import type {
  StaticCategory,
  StaticCustodian,
  StaticDepartment,
  StaticLocation,
  StaticRegistrationIdentifiers,
} from "@repo/trpc/schemas";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function RegistrationStepPanel({
  step,
  values,
  set,
  categories,
  departments,
  locations,
  custodians,
  identifiers,
}: {
  step: number;
  values: RegistrationFormValues;
  set: (name: string, value: string) => void;
  categories: StaticCategory[];
  departments: StaticDepartment[];
  locations: StaticLocation[];
  custodians: StaticCustodian[];
  identifiers: StaticRegistrationIdentifiers;
}) {
    
  if (step === 0)
    return (
      <section className="rounded-md border p-4">
        <h2 className="font-semibold">Basic Information</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Provide the basic details of the asset.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Text
              label="Asset name"
              name="name"
              values={values}
              set={set}
              required
            />
          </div>
          <Field label="Category *">
            <Select
              value={values.categoryId}
              onValueChange={(value) => set("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Text
            label="Asset type"
            name="assetType"
            values={values}
            set={set}
            required
          />
          <Text label="Brand" name="brand" values={values} set={set} required />
          <Text label="Model" name="model" values={values} set={set} required />
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea
                className="min-h-16"
                value={values.description ?? ""}
                onChange={(event) => set("description", event.target.value)}
              />
            </Field>
          </div>
          <Field label="Condition *">
            <Select
              value={values.condition}
              onValueChange={(value) => set("condition", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["new", "good", "fair", "poor"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Text
            label="Quantity"
            name="quantity"
            values={values}
            set={set}
            type="number"
            required
          />
          {/* <GeneratedFields identifiers={identifiers} /> */}
        </div>
      </section>
    );
  if (step === 1)
    return (
      <section className="rounded-md border p-4">
        <h2 className="font-semibold">Identification</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Serial number, barcode, and asset identifiers.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <Text
            label="Serial number"
            name="serialNumber"
            values={values}
            set={set}
          />
          <Text
            label="Barcode / part number"
            name="barcode"
            values={values}
            set={set}
          />
          {/* <GeneratedFields identifiers={identifiers} /> */}
        </div>
      </section>
    );
  if (step === 2)
    return (
      <section className="rounded-md border p-4">
        <h2 className="font-semibold">Acquisition</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Purchase and financial information.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <Text
            label="Acquisition date"
            name="acquisitionDate"
            values={values}
            set={set}
            type="date"
            required
          />
          <Text
            label="Acquisition cost (PHP)"
            name="acquisitionCost"
            values={values}
            set={set}
            type="number"
            required
          />
          <Text label="Supplier" name="supplier" values={values} set={set} />
          <Text
            label="Reference number"
            name="referenceNumber"
            values={values}
            set={set}
          />
        </div>
      </section>
    );
  if (step === 3)
    return (
      <section className="rounded-md border p-4">
        <h2 className="font-semibold">Location & Assignment</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Where the asset is located and who is responsible for it.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {selectField("Department", "departmentId", departments, values, set)}
          {selectField("Location", "locationId", locations, values, set)}
          {selectField(
            "Assigned to",
            "custodianId",
            custodians.map((u) => ({
              id: u.id,
              name: `${u.firstName} ${u.lastName}`,
            })),
            values,
            set,
          )}
        </div>
      </section>
    );

  return (
    <section className="rounded-md border p-4">
      <h2 className="font-semibold">Review & Confirm</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Review the record before saving.
      </p>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {[
          ["Asset name", values.name],
          ["Brand / model", `${values.brand} / ${values.model}`],
          ["Asset tag", identifiers.assetTag],
          ["Property number", identifiers.propertyNumber],
          [
            "Cost",
            values.acquisitionCost ? `PHP ${values.acquisitionCost}` : "—",
          ],
          [
            "Location",
            locations.find((item) => String(item.id) === values.locationId)
              ?.name ?? "Not assigned",
          ],
        ].map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs text-muted-foreground">{key}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Text({
  label,
  name,
  values,
  set,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  values: FormValues;
  set: (name: string, value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <Field label={`${label}${required ? " *" : ""}`}>
      <Input
        type={type}
        value={values[name] ?? ""}
        onChange={(event) => set(name, event.target.value)}
      />
    </Field>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      {label}
      {children}
    </label>
  );
}

function selectField(
  label: string,
  name: string,
  items: { id: string | number; name: string }[],
  values: RegistrationFormValues,
  set: (name: string, value: string) => void,
) {
  return (
    <Field label={label}>
      <Select value={values[name]} onValueChange={(value) => set(name, value)}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

// function GeneratedFields({
//   identifiers,
// }: {
//   identifiers: StaticRegistrationIdentifiers;
// }) {
//   return (
//     <div className="rounded-md border border-info-border bg-info p-3 text-info-foreground md:col-span-2">
//       <p className="mb-3 text-xs font-semibold">
//         System Generated{" "}
//         <span className="font-normal">(will be auto-generated)</span>
//       </p>
//       <div className="grid gap-2 sm:grid-cols-3">
//         {[
//           ["Asset Tag", identifiers.assetTag],
//           ["Property Number", identifiers.propertyNumber],
//           ["QR Code Value", identifiers.qrValue],
//         ].map(([label, value]) => (
//           <div key={label}>
//             <p className="mb-1 text-[11px]">{label}</p>
//             <p className="truncate rounded border border-info-border bg-background/60 px-2 py-1.5 font-mono text-xs text-foreground">
//               {value}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }