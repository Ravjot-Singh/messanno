import Link from "next/link"

import { Doodle } from "@/components/sketch/Doodle"

export default function Footer() {
  return (
    <footer className="mt-auto">
      <svg
        viewBox="0 0 1200 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pencil-filter block h-2 w-full text-foreground/40"
      >
        <path
          d="M0 4 C 200 7, 350 1, 600 4 S 950 6, 1200 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="10 7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p className="flex items-center gap-2 font-hand text-base">
          <Doodle name="heart" className="size-5 text-destructive" strokeWidth={7} />
          Scribbled with care · Messanno © 2026
        </p>
        <nav aria-label="Footer" className="flex items-center gap-5">
          {}
          <Link href="/" className="hand-underline hover:text-foreground">
            Home
          </Link>
          <Link href="/dashboard" className="hand-underline hover:text-foreground">
            Dashboard
          </Link>
        </nav>
      </div>
    </footer>
  )
}
