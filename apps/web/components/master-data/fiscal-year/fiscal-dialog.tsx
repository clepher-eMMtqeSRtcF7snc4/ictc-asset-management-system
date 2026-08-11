
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFiscalYearSchema, FiscalYearInput } from "@repo/trpc/schemas";
import { Controller, useForm } from "react-hook-form";

interface FiscalYearProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (create: FiscalYearInput) => void;
}

export default function FiscalDialog({
  open,
  onOpenChange,
  onSave,
}: FiscalYearProps) {

  const form = useForm<FiscalYearInput>({
    resolver: zodResolver(createFiscalYearSchema),
    mode: "onChange",
    defaultValues: {
      year: new Date().getFullYear(),
      status: "planning",
      fundSource: "",
      planningStartPeriod: "",
      planningEndPeriod: "",
      implementationStartPeriod: "",
      implementationEndPeriod: "",
      finalSubmission: "",
    },
  })

    const handleSubmit = (data: FiscalYearInput) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
      onPointerDownOutside={(e) => e.preventDefault()}
      className="flex max-h-[90vh] flex-col sm:max-w-lg" 
      >
        <DialogHeader>
          <DialogTitle>Create Fiscal Year</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2">
          <form id="fiscal-year-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-fiscal-year">
                      Fiscal Year
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      id="form-fiscal-year"
                      type="number"
                      min={2000}
                      max={2100}
                      step={1}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter fiscal year"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="fundSource"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-fiscal-fund_source">
                      Fund Source
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="form-fiscal-fund_source"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter budget fund"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="budget"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-fiscal-allocated_budget">
                      Allocated Budget
                    </FieldLabel>
                    <Input
                      {...field}
                      name={field.name}
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const value = event.target.value
                        field.onChange(value === "" ? undefined : Number(value))
                      }}
                      type="number"
                      id="form-fiscal-allocated_budget"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter allocated budget"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldSet>
                <FieldLegend className="text-muted-foreground">Planning Phase</FieldLegend>
                <div className="flex items-center justify-between gap-2">
                  <Controller
                    name="planningStartPeriod"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-fiscal-planningStartPeriod">
                          Start Period
                        </FieldLabel>
                        <Input
                          {...field}
                          value={typeof field.value === "string" ? field.value : ""}
                          onBlur={field.onBlur}
                          onChange={(event) => field.onChange(event.target.value || undefined)}
                          type="date"
                          id="form-fiscal-planningStartPeriod"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="planningEndPeriod"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-fiscal-planningEndPeriod">
                          End Period
                        </FieldLabel>
                        <Input
                          {...field}
                          value={typeof field.value === "string" ? field.value : ""}
                          onBlur={field.onBlur}
                          onChange={(event) => field.onChange(event.target.value || undefined)}
                          type="date"
                          id="form-fiscal-planningEndPeriod"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </FieldSet>
              
              <FieldSet>
                <FieldLegend className="text-muted-foreground">Implementation Phase</FieldLegend>
                <div className="flex items-center justify-between gap-2">
                  <Controller
                    name="implementationStartPeriod"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-fiscal-implementationStartPeriod">
                          Start Period
                        </FieldLabel>
                        <Input
                          {...field}
                          value={typeof field.value === "string" ? field.value : ""}
                          onBlur={field.onBlur}
                          onChange={(event) => field.onChange(event.target.value || undefined)}
                          type="date"
                          id="form-fiscal-implementationStartPeriod"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="implementationEndPeriod"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-fiscal-implementationEndPeriod">
                          End Period
                        </FieldLabel>
                        <Input
                          {...field}
                          value={typeof field.value === "string" ? field.value : ""}
                          onBlur={field.onBlur}
                          onChange={(event) => field.onChange(event.target.value || undefined)}
                          type="date"
                          id="form-fiscal-implementationEndPeriod"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </FieldSet>

              <Controller
                name="finalSubmission"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-fiscal-finalSubmission">
                      Final Submission
                    </FieldLabel>
                    <Input
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.value || undefined)}
                      type="date"
                      id="form-fiscal-finalSubmission"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-status">
                    Status
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="implementation">Implementation</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            </FieldGroup>
          </form>
        </div>

        <DialogFooter>
          <div className="flex justify-end">
            <Field orientation="horizontal">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" form="fiscal-year-form">
                Submit
              </Button>
            </Field>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}