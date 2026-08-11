import { DepartmentsContentSection } from "@/components/master-data/departments/departments-content-section"
import { DepartmentsLocationsTabs } from "@/components/master-data/departments-locations-tabs"
import { LocationsContentSection } from "@/components/master-data/locations/locations-content-section"
import { trpcServerMutation, trpcServerQuery } from "@/lib/trpc/server"
import type { CreateDepartmentInput, CreateLocationInput, Department, Location, UpdateDepartmentInput, UpdateLocationInput } from "@repo/trpc/schemas"
import { revalidatePath } from "next/cache"

export async function DepartmentsLocationsPage({ defaultValue = "departments" }: { defaultValue?: "departments" | "locations" }) {
  const [departmentResult, locationResult] = await Promise.all([trpcServerQuery<Record<string, never>, Department[]>("departmentsRouter.list", {}), trpcServerQuery<Record<string, never>, Location[]>("locationsRouter.list", {})])
  async function createDepartment(input: CreateDepartmentInput) { "use server"; const result = await trpcServerMutation<CreateDepartmentInput, Department>("departmentsRouter.create", input); if (result.ok) revalidatePath("/master-data/departments"); return result.ok ? { ok: true } : { ok: false, message: result.message } }
  async function updateDepartment(input: UpdateDepartmentInput) { "use server"; const result = await trpcServerMutation<UpdateDepartmentInput, Department>("departmentsRouter.update", input); if (result.ok) revalidatePath("/master-data/departments"); return result.ok ? { ok: true } : { ok: false, message: result.message } }
  async function setDepartmentStatus(input: { id: number; status: "active" | "inactive" }) { "use server"; const result = await trpcServerMutation<typeof input, Department>("departmentsRouter.setStatus", input); if (result.ok) revalidatePath("/master-data/departments"); return result.ok ? { ok: true } : { ok: false, message: result.message } }
  async function createLocation(input: CreateLocationInput) { "use server"; const result = await trpcServerMutation<CreateLocationInput, Location>("locationsRouter.create", input); if (result.ok) revalidatePath("/master-data/locations"); return result.ok ? { ok: true } : { ok: false, message: result.message } }
  async function updateLocation(input: UpdateLocationInput) { "use server"; const result = await trpcServerMutation<UpdateLocationInput, Location>("locationsRouter.update", input); if (result.ok) revalidatePath("/master-data/locations"); return result.ok ? { ok: true } : { ok: false, message: result.message } }
  async function setLocationStatus(input: { id: number; status: "active" | "inactive" }) { "use server"; const result = await trpcServerMutation<typeof input, Location>("locationsRouter.setStatus", input); if (result.ok) revalidatePath("/master-data/locations"); return result.ok ? { ok: true } : { ok: false, message: result.message } }
  return <DepartmentsLocationsTabs defaultValue={defaultValue} departments={<DepartmentsContentSection departments={departmentResult.ok ? departmentResult.data : []} error={departmentResult.ok ? undefined : departmentResult.message} onCreate={createDepartment} onUpdate={updateDepartment} onSetStatus={setDepartmentStatus} />} locations={<LocationsContentSection locations={locationResult.ok ? locationResult.data : []} error={locationResult.ok ? undefined : locationResult.message} onCreate={createLocation} onUpdate={updateLocation} onSetStatus={setLocationStatus} />} />
}

export default async function DepartmentsPage() { return <DepartmentsLocationsPage /> }
