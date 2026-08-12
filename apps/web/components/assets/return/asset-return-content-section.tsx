"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, ClipboardCheck, History, Laptop } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AssetReturnHeaderSection } from "./asset-return-header-section";
import { AssetReturnStepper } from "./asset-return-stepper";
import { SelectReturnAssetStep } from "./select-return-asset-step";
import { ReturnDetailsForm } from "./return-details-form";
import type { ReturnAsset, ReturnDetails } from "./types";
const initialDetails: ReturnDetails = {
  reason: "",
  returnDate: new Date().toISOString().slice(0, 10),
  returnLocation: "",
  condition: "",
  remarks: "",
  accessories: [false, false, false, false, false],
};
export function AssetReturnContentSection() {
  const [step, setStep] = useState(0);
  const [asset, setAsset] = useState<ReturnAsset>();
  const [details, setDetails] = useState<ReturnDetails>(initialDetails);
  const [completed, setCompleted] = useState(false);
  const [pending, startTransition] = useTransition();
  const valid =
    step === 0
      ? Boolean(asset)
      : step === 1
        ? Boolean(
            details.reason &&
            details.returnDate &&
            details.returnLocation &&
            details.condition &&
            details.accessories.every(Boolean),
          )
        : step === 2
          ? Boolean(asset && details.reason && details.condition)
          : completed;
  function next() {
    if (!valid) {
      toast.error(
        "Complete the required return information before continuing.",
      );
      return;
    }
    setStep((current) => Math.min(2, current + 1));
  }
  function complete() {
    startTransition(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      setCompleted(true);
      setStep(3);
      toast.success("Demo return completed. No backend records were changed.");
    });
  }
  function reset() {
    setStep(0);
    setAsset(undefined);
    setDetails(initialDetails);
    setCompleted(false);
  }
  return (
    <main className="mx-auto max-w-[1440px] space-y-5">
      <AssetReturnHeaderSection
        enabled={Boolean(
          asset &&
          details.reason &&
          details.condition &&
          details.accessories.every(Boolean),
        )}
        onReview={() => {
          if (
            asset &&
            details.reason &&
            details.condition &&
            details.accessories.every(Boolean)
          )
            setStep(2);
        }}
        onCancel={reset}
      />
      <AssetReturnStepper current={step} onSelect={setStep} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Card>
          <CardContent className="p-5">
            {step === 0 && (
              <SelectReturnAssetStep selected={asset} onSelect={setAsset} />
            )}
            {step === 1 && asset && (
              <ReturnDetailsForm
                asset={asset}
                value={details}
                onChange={setDetails}
              />
            )}
            {step === 2 && asset && <Review asset={asset} details={details} />}
            {step === 3 && asset && (
              <Completed asset={asset} details={details} />
            )}
            <div className="mt-5 flex justify-between border-t pt-4">
              <Button
                variant="outline"
                disabled={step === 0 || pending || step === 3}
                onClick={() => setStep((current) => current - 1)}
              >
                Back
              </Button>
              {step < 2 && (
                <Button disabled={!valid} onClick={next}>
                  Continue
                </Button>
              )}
              {step === 2 && (
                <Button disabled={!valid || pending} onClick={complete}>
                  {pending ? "Processing…" : "Confirm Return"}
                </Button>
              )}
              {step === 3 && (
                <Button onClick={reset}>Process another return</Button>
              )}
            </div>
          </CardContent>
        </Card>
        <aside className="space-y-4">
          <Preview asset={asset} />
          <AssignmentInfo asset={asset} />
          <HistoryCard completed={completed} />
          <div className="rounded-md border border-purple-border bg-purple p-4 text-xs text-purple-foreground">
            <strong>Help</strong>
            <ul className="mt-2 space-y-1.5">
              <li className="flex gap-2">
                <Check className="size-3.5" />
                Check the condition upon return.
              </li>
              <li className="flex gap-2">
                <Check className="size-3.5" />
                Ensure accessories and documents are complete.
              </li>
              <li className="flex gap-2">
                <Check className="size-3.5" />
                All returns are recorded for audit and inventory accuracy.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
function Preview({ asset }: { asset?: ReturnAsset }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="mb-3 text-xs font-semibold">Asset Preview</p>
        {asset ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="grid size-14 place-items-center rounded bg-muted">
                <Laptop className="size-7 text-muted-foreground" />
              </span>
              <div>
                <p className="font-semibold">{asset.name}</p>
                <p className="font-mono text-xs text-primary">
                  {asset.assetTag}
                </p>
                <Badge variant="warning" className="mt-1">
                  Assigned
                </Badge>
              </div>
            </div>
            <Rows
              rows={[
                ["Property No.", asset.propertyNumber],
                ["Category", asset.category],
                ["Brand / Model", asset.brandModel],
                ["Serial Number", asset.serialNumber],
                ["Condition", asset.condition],
              ]}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select an assigned asset to preview it.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
function AssignmentInfo({ asset }: { asset?: ReturnAsset }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="mb-3 text-xs font-semibold">Assignment Information</p>
        {asset ? (
          <Rows
            rows={[
              ["Assignee", asset.assignee],
              ["Department", asset.department],
              ["Location", asset.location],
              ["Assignment Date", asset.assignedDate],
              ["Purpose", "Faculty Use"],
            ]}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Assignment information will appear here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
function HistoryCard({ completed }: { completed: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold">
          <History className="size-4 text-primary" />
          Assignment History
        </p>
        <div className="space-y-3 text-xs">
          {completed && (
            <p>
              <strong className="text-success-foreground">
                Returned to inventory
              </strong>
              <br />
              <span className="text-muted-foreground">
                Just now · Static UI workflow
              </span>
            </p>
          )}
          <p>
            <strong>Assigned to Juan Dela Cruz</strong>
            <br />
            <span className="text-muted-foreground">
              Aug 12, 2024 · ICT Office - Room 203
            </span>
          </p>
          <p>
            <strong>Added to Inventory</strong>
            <br />
            <span className="text-muted-foreground">
              Jan 05, 2024 · ICT Storage
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
function Review({
  asset,
  details,
}: {
  asset: ReturnAsset;
  details: ReturnDetails;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold">3. Review & Confirm</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Verify all information before processing the return.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border p-4">
          <p className="mb-3 font-semibold">Asset & Assignment</p>
          <Rows
            rows={[
              ["Asset", asset.name],
              ["Current Assignee", asset.assignee],
              ["Previous Condition", asset.condition],
              ["Current Location", asset.location],
            ]}
          />
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-3 font-semibold">Return Details</p>
          <Rows
            rows={[
              ["Reason", details.reason],
              ["Return Date", details.returnDate],
              ["Return Location", details.returnLocation],
              ["Returned Condition", details.condition],
              [
                "Accessories",
                details.accessories.every(Boolean)
                  ? "Verified complete"
                  : "Incomplete",
              ],
            ]}
          />
        </div>
      </div>
      <div className="mt-4 rounded-md border border-warning-border bg-warning p-3 text-xs text-warning-foreground">
        Completing this demo return updates the asset to{" "}
        <strong>Available</strong> locally and preserves its assignment history.
      </div>
    </section>
  );
}
function Completed({
  asset,
  details,
}: {
  asset: ReturnAsset;
  details: ReturnDetails;
}) {
  return (
    <section className="py-8 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-success text-success-foreground">
        <ClipboardCheck className="size-7" />
      </span>
      <h2 className="mt-4 text-xl font-bold">Asset Return Completed</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {asset.name} has been returned to {details.returnLocation} in{" "}
        {details.condition} condition.
      </p>
      <div className="mx-auto mt-5 max-w-md rounded-md border bg-muted/30 p-4 text-left">
        <Rows
          rows={[
            ["Asset Status", "Available"],
            ["Return Location", details.returnLocation],
            ["Returned Condition", details.condition],
            ["Return Record", "Created locally (demo)"],
          ]}
        />
      </div>
    </section>
  );
}
function Rows({ rows }: { rows: string[][] }) {
  return (
    <dl className="space-y-2 text-xs">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="text-right font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
