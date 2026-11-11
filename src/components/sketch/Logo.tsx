import Link from "next/link"

import { cn } from "@/lib/utils"

import { Doodle } from "./Doodle"

export function Logo({
  href = "/",
  className,
}: {
  href?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-md font-hand text-2xl font-bold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      aria-label="Messanno home"
    >
      <span className="text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]">
        <Doodle name="paperPlane" className="size-7" strokeWidth={6} />
      </span>
      <span>Messanno</span>
    </Link>
  )
}
