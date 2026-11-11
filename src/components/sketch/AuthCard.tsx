import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Doodle, type DoodleName } from "./Doodle"

type AuthCardProps = {
  title: ReactNode
  description: ReactNode
  doodle: DoodleName
  children: ReactNode
  footer?: ReactNode
  className?: string
}


export function AuthCard({
  title,
  description,
  doodle,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <section
      className={cn(
        "tape sketch-border sketch-shadow-lg relative w-full max-w-md border-foreground/70 bg-card px-5 pt-9 pb-6 sm:px-8 sm:pb-8",
        className
      )}
    >
      <div className="mb-7 flex flex-col items-center gap-2 text-center">
        <Doodle name={doodle} animated className="size-14 text-primary" strokeWidth={4.5} />
        <h1 className="text-4xl leading-tight font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {children}

      {footer && (
        <div className="mt-7 border-t-2 border-dashed pt-5 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </section>
  )
}
