import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type ScribbleUnderlineProps = {
  children: ReactNode
  className?: string
  
  strokeClassName?: string
  
  animated?: boolean
}


export function ScribbleUnderline({
  children,
  className,
  strokeClassName = "text-primary",
  animated = true,
}: ScribbleUnderlineProps) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
        className={cn(
          "pencil-filter pointer-events-none absolute -bottom-[0.18em] left-[-2%] h-[0.38em] w-[104%] overflow-visible",
          strokeClassName
        )}
      >
        <path
          d="M3 13 C 40 4, 70 18, 110 9 S 170 5, 197 11"
          strokeWidth={5}
          pathLength={1}
          className={animated ? "draw-path" : undefined}
        />
        <path
          d="M14 17 C 60 11, 120 15, 186 13"
          strokeWidth={3}
          pathLength={1}
          className={animated ? "draw-path" : undefined}
          style={animated ? { animationDelay: "0.9s" } : undefined}
        />
      </svg>
    </span>
  )
}
