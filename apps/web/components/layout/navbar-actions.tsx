"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Bell, CircleHelp, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"
import { NavbarUser } from "./navbar-user"
import { authClient } from "@/lib/auth/client"

const notifications = [
  { title: "Low stock detected", detail: "USB-C adapters have reached the reorder level.", time: "12 min ago", tone: "bg-amber-500" },
  { title: "Warranty expiring", detail: "8 assets have warranties ending within 30 days.", time: "1 hr ago", tone: "bg-blue-500" },
  { title: "Maintenance overdue", detail: "MR-2026-0038 requires an update.", time: "3 hrs ago", tone: "bg-red-500" },
]

export default function NavbarActions() {
  const { setTheme } = useTheme()
  const { data: session } = authClient.useSession()

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Open notifications">
            <Bell />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications <span className="font-normal text-muted-foreground">3 unread</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.title} className="items-start py-2">
              <span className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.tone}`} />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{notification.title}</span>
                <span className="block text-xs text-muted-foreground">{notification.detail}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{notification.time}</span>
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-primary">View all notifications</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon" aria-label="Open help"><CircleHelp /></Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle theme">
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {session?.user && <NavbarUser user={{ name: session.user.name, email: session.user.email, avatar: session.user.image ?? null }} />}
    </div>
  )
}
