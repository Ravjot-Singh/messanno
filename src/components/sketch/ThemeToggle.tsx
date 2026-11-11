"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/components/theme/theme"
import { cn } from "@/lib/utils"

import { Doodle } from "./Doodle"


export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("hover-wiggle", className)}
            aria-label="Switch between paper and chalkboard theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          />
        }
      >
        <Doodle name="moon" className="size-6 dark:hidden" strokeWidth={6} />
        <Doodle name="sun" className="hidden size-6 dark:block" strokeWidth={6} />
      </TooltipTrigger>
      <TooltipContent>
        <span className="dark:hidden">Chalkboard mode</span>
        <span className="hidden dark:inline">Paper mode</span>
      </TooltipContent>
    </Tooltip>
  )
}
