

interface Props {
  title: string
  description: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function PageHeader({ title, description, action, icon }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon && <div>{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold text-accent-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">{description}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
