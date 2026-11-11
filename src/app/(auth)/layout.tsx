import type { ReactNode } from "react"

import { Doodle } from "@/components/sketch/Doodle"
import { Logo } from "@/components/sketch/Logo"
import { ThemeToggle } from "@/components/sketch/ThemeToggle"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden">
      {}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-foreground/15">
        <Doodle name="star" className="absolute top-24 left-[6%] hidden size-14 rotate-12 sm:block" />
        <Doodle name="spiral" className="absolute bottom-16 left-[8%] hidden size-24 md:block" />
        <Doodle name="envelope" className="absolute top-32 right-[7%] hidden size-20 -rotate-12 md:block" />
        <Doodle name="sparkle" className="absolute right-[12%] bottom-24 hidden size-12 sm:block" />
        <Doodle name="heart" className="absolute bottom-[45%] left-[18%] hidden size-10 -rotate-6 lg:block" />
        <Doodle name="speechBubble" className="absolute top-[55%] right-[20%] hidden size-16 rotate-6 lg:block" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pt-4 pb-14">
        {children}
      </main>
    </div>
  )
}
