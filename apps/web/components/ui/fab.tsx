import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Fab({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="icon"
      className={cn(
        "fixed right-6 bottom-6 z-50 h-10 w-10 rounded-full shadow-lg shadow-black/20",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export { Fab }
