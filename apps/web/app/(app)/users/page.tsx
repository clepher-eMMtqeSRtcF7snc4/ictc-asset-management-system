import { UserContentSection } from "@/components/users/user-content-section"
import { trpcServerMutation, trpcServerQuery } from "@/lib/trpc/server"
import type { CreateUserInput, Department, Role, UserManagementUser } from "@repo/trpc/schemas"
import { revalidatePath } from "next/cache"

type AuditLog = { id: string; actorName: string | null; action: string; entityType: string; entityId: string; createdAt: string }

export default async function UsersPage() {
  const [users, roles, departments, auditLogs] = await Promise.all([
    trpcServerQuery<Record<string, never>, UserManagementUser[]>("userManagementRouter.listUsers", {}),
    trpcServerQuery<Record<string, never>, Role[]>("userManagementRouter.listRoles", {}),
    trpcServerQuery<Record<string, never>, Department[]>("departmentsRouter.list", {}),
    trpcServerQuery<{ limit: number }, AuditLog[]>("userManagementRouter.listAuditLogs", { limit: 50 }),
  ])
  async function createUser(input: CreateUserInput) { "use server"; const result = await trpcServerMutation<CreateUserInput, UserManagementUser>("userManagementRouter.createUser", input); if (result.ok) revalidatePath("/users"); return result.ok ? { ok: true } : { ok: false, message: result.message } }
  async function setUserStatus(input: { id: string; status: "active" | "inactive" | "suspended" }) { "use server"; const result = await trpcServerMutation<typeof input, UserManagementUser>("userManagementRouter.setUserStatus", input); if (result.ok) revalidatePath("/users"); return result.ok ? { ok: true } : { ok: false, message: result.message } }
  const error = [users, roles, departments, auditLogs].find((result) => !result.ok)
  return <UserContentSection users={users.ok ? users.data : []} roles={roles.ok ? roles.data : []} departments={departments.ok ? departments.data : []} auditLogs={auditLogs.ok ? auditLogs.data : []} error={error && !error.ok ? error.message : undefined} onCreate={createUser} onSetStatus={setUserStatus} />
}
