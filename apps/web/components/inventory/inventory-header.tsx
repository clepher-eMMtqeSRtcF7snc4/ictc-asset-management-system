interface InventoryHeaderProps {
  title: string
  description: string
  breadcrumb: string[]
  action?: React.ReactNode
}

export function InventoryHeader({ title, description, breadcrumb, action }: InventoryHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs text-muted-foreground">
          {breadcrumb.map((segment, index) => (
            <span key={index}>
              {segment}
              {index < breadcrumb.length - 1 && <span className="mx-2">›</span>}
            </span>
          ))}
        </p>
        <h1 className="mt-3 text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-xl">{description}</p>
      </div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </header>
  )
}
