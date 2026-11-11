"use client"

import { useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { ExternalLink, LayoutDashboard, LogOut, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Doodle } from "@/components/sketch/Doodle"
import { Logo } from "@/components/sketch/Logo"
import { ThemeToggle } from "@/components/sketch/ThemeToggle"
import { cn } from "@/lib/utils"

function Navbar() {
  const { data: session, status } = useSession()
  const user = session?.user
  const displayName = user?.userName || user?.email || "friend"
  const initial = displayName.charAt(0).toUpperCase()
  const profileHref = user?.userName
    ? `/u/${encodeURIComponent(user.userName)}`
    : null

  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  const handleSignOut = () => {
    setMenuOpen(false)
    void signOut({ callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-sm supports-backdrop-filter:bg-background/70">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Logo href={session ? "/dashboard" : "/"} />

        {}
        <div className="hidden items-center gap-2 md:flex">
          {status === "loading" ? (
            <Skeleton className="h-9 w-40" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="hand-underline mx-2 font-hand text-lg"
              >
                Dashboard
              </Link>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      className="gap-2 pl-1.5"
                      aria-label="Account menu"
                    />
                  }
                >
                  <span className="flex size-6 items-center justify-center rounded-full border-2 border-foreground/70 bg-note font-hand text-sm font-bold text-foreground">
                    {initial}
                  </span>
                  <span className="max-w-36 truncate">{displayName}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                    <p className="truncate px-1.5 pb-1 font-hand text-base">
                      @{displayName}
                    </p>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/dashboard" />}>
                    <LayoutDashboard aria-hidden="true" />
                    Dashboard
                  </DropdownMenuItem>
                  {profileHref && (
                    <DropdownMenuItem
                      render={
                        <Link href={profileHref} target="_blank" rel="noreferrer" />
                      }
                    >
                      <ExternalLink aria-hidden="true" />
                      View my public page
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                    <LogOut aria-hidden="true" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/sign-in" />}
              >
                Sign in
              </Button>
              <Button nativeButton={false} render={<Link href="/sign-up" />}>
                Get started
              </Button>
            </>
          )}
        </div>

        {}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Open menu" />
              }
            >
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-xs">
              <SheetHeader className="pt-6">
                <SheetTitle>
                  {session ? `Hey, ${displayName}!` : "Welcome!"}
                </SheetTitle>
                <SheetDescription>
                  {session
                    ? "Your notes are waiting in the dashboard."
                    : "Get your own anonymous inbox in a minute."}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-3 px-4">
                {session ? (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="justify-start"
                      nativeButton={false}
                      render={<Link href="/dashboard" onClick={closeMenu} />}
                    >
                      <LayoutDashboard aria-hidden="true" />
                      Dashboard
                    </Button>
                    {profileHref && (
                      <Button
                        variant="outline"
                        size="lg"
                        className="justify-start"
                        nativeButton={false}
                        render={
                          <Link
                            href={profileHref}
                            target="_blank"
                            rel="noreferrer"
                            onClick={closeMenu}
                          />
                        }
                      >
                        <ExternalLink aria-hidden="true" />
                        View my public page
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="lg"
                      className="justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut aria-hidden="true" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      nativeButton={false}
                      render={<Link href="/sign-up" onClick={closeMenu} />}
                    >
                      Get started — it&apos;s free
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      nativeButton={false}
                      render={<Link href="/sign-in" onClick={closeMenu} />}
                    >
                      Sign in
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-auto flex items-end justify-between px-6 pb-8 text-muted-foreground">
                <p className="font-hand text-lg leading-tight">
                  psst… nobody
                  <br />
                  signs their notes here.
                </p>
                <Doodle name="paperPlane" className="size-14 -rotate-12 text-primary" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {}
      <svg
        viewBox="0 0 1200 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={cn("pencil-filter block h-2 w-full text-foreground/60")}
      >
        <path
          d="M0 4 C 150 1, 300 7, 450 4 S 750 2, 900 5 S 1100 3, 1200 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </header>
  )
}

export default Navbar
