import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Doodle } from "@/components/sketch/Doodle"
import { Logo } from "@/components/sketch/Logo"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center px-4 py-4 sm:px-6">
        <Logo />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="relative flex w-full max-w-lg flex-col items-center text-center">
          {}
          <div className="sketch-border sketch-shadow-lg relative w-full -rotate-1 border-dashed bg-card px-6 pt-12 pb-10 sm:px-10">
            <svg
              viewBox="0 0 400 24"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-x-0 -top-3 h-6 w-full text-background"
            >
              <path
                d="M0 24 L0 10 L20 16 L38 6 L60 14 L80 4 L104 15 L126 7 L150 16 L172 5 L196 13 L220 4 L244 15 L268 6 L290 14 L314 5 L338 15 L360 7 L380 14 L400 8 L400 24 Z"
                fill="currentColor"
              />
            </svg>

            <p className="font-hand text-8xl leading-none font-bold text-primary sm:text-9xl">
              404
            </p>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              This page got torn out
            </h1>
            <p className="mt-2 text-muted-foreground">
              We looked in every notebook. Whatever was here has gone missing —
              maybe the link has a typo?
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button nativeButton={false} render={<Link href="/" />}>
                Take me home
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/dashboard" />}
              >
                Go to my dashboard
              </Button>
            </div>
          </div>

          <Doodle
            name="paperPlane"
            animated
            className="absolute -right-4 -bottom-10 size-20 rotate-12 text-primary/70 sm:-right-12"
          />
          <Doodle
            name="spiral"
            className="absolute -top-14 -left-6 size-16 text-foreground/25 sm:-left-14"
          />
        </div>
      </main>
    </div>
  )
}
