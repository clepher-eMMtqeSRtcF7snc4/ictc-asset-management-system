import { CategoriesContentSection } from "@/components/master-data/categories/categories-content-section";
import { trpcServerMutation, trpcServerQuery } from "@/lib/trpc/server";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@repo/trpc/schemas";
import { revalidatePath } from "next/cache";

export default async function CategoriesPage() {
  const initial = await trpcServerQuery<Record<string, never>, Category[]>(
    "categoriesRouter.list",
    {},
  );
  async function createCategory(input: CreateCategoryInput) {
    "use server";
    const result = await trpcServerMutation<CreateCategoryInput, Category>(
      "categoriesRouter.create",
      input,
    );
    if (result.ok) revalidatePath("/master-data/categories");
    return result.ok ? { ok: true } : { ok: false, message: result.message };
  }
  async function updateCategory(input: UpdateCategoryInput) {
    "use server";
    const result = await trpcServerMutation<UpdateCategoryInput, Category>(
      "categoriesRouter.update",
      input,
    );
    if (result.ok) revalidatePath("/master-data/categories");
    return result.ok ? { ok: true } : { ok: false, message: result.message };
  }
  async function setCategoryStatus(input: {
    id: number;
    status: "active" | "inactive";
  }) {
    "use server";
    const result = await trpcServerMutation<typeof input, Category>(
      "categoriesRouter.setStatus",
      input,
    );
    if (result.ok) revalidatePath("/master-data/categories");
    return result.ok ? { ok: true } : { ok: false, message: result.message };
  }
  return (
    <CategoriesContentSection
      categories={initial.ok ? initial.data : []}
      error={initial.ok ? undefined : initial.message}
      onCreate={createCategory}
      onUpdate={updateCategory}
      onSetStatus={setCategoryStatus}
    />
  );
}
