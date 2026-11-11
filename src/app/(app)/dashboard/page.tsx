"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import {
  ArrowUpRight,
  Check,
  Copy,
  LoaderCircle,
  RefreshCw,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import MessageCard from "@/components/messageCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Doodle } from "@/components/sketch/Doodle"
import { ScribbleUnderline } from "@/components/sketch/ScribbleUnderline"
import { cn } from "@/lib/utils"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import type { ApiMessage, ApiResponse } from "@/types/ApiResponse"

type AcceptMessageFormValues = z.infer<typeof acceptMessageSchema>

function NotesSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-label="Loading notes"
    >
      {[0, 1, 2].map((key) => (
        <Skeleton key={key} className="h-44" />
      ))}
    </div>
  )
}

const DashboardPage = () => {
  const [messages, setMessages] = useState<ApiMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSwitchLoading, setIsSwitchLoading] = useState(true)
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { data: session, status } = useSession()

  const form = useForm<AcceptMessageFormValues>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  })
  const acceptMessages = form.watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      const isAcceptingMessages = response.data.isAcceptingMessages

      if (typeof isAcceptingMessages !== "boolean") {
        toast.error("Could not retrieve your message settings.")
        return
      }

      form.setValue("acceptMessages", isAcceptingMessages)
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        toast.error(
          error.response?.data.message ??
            "Could not retrieve your message settings."
        )
      } else {
        toast.error("An unexpected error occurred.")
      }
    } finally {
      setIsSwitchLoading(false)
    }
  }, [form])

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true)

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages ?? [])

      if (refresh) {
        toast.success("Inbox refreshed.")
      }
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        toast.error(
          error.response?.data.message ?? "Could not retrieve your messages."
        )
      } else {
        toast.error("An unexpected error occurred.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status !== "authenticated") {
      return
    }

    void fetchMessages()
    void fetchAcceptMessage()
  }, [status, fetchAcceptMessage, fetchMessages])

  const handleDeleteMessage = (messageId: string) => {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => message._id !== messageId)
    )
  }

  const handleSwitchChange = async () => {
    const nextValue = !acceptMessages
    setIsSwitchLoading(true)

    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: nextValue,
      })

      form.setValue("acceptMessages", nextValue)
      toast.success(
        response.data.message ||
          (nextValue ? "You're accepting notes again." : "New notes paused.")
      )
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        toast.error(
          error.response?.data.message ?? "Could not update message settings."
        )
      } else {
        toast.error("An unexpected error occurred.")
      }
    } finally {
      setIsSwitchLoading(false)
    }
  }

  useEffect(() => {
    setOrigin(window.location.origin)
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
    }
  }, [])

  const userName = session?.user?.userName
  const profilePath = userName ? `/u/${encodeURIComponent(userName)}` : ""
  const profileUrl = profilePath && origin ? `${origin}${profilePath}` : ""

  const handleCopyLink = async () => {
    if (!profileUrl) {
      toast.error("Your profile link is not available.")
      return
    }

    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success("Link copied. Go share it!")
      setCopied(true)
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      
      
      const linkBox = document.getElementById("profile-link")
      if (linkBox) window.getSelection()?.selectAllChildren(linkBox)
      toast.error("Couldn't copy automatically — the link is selected, press Ctrl+C (⌘C).")
    }
  }

  if (status === "loading") {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-10 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <NotesSkeleton />
      </main>
    )
  }

  if (status !== "authenticated" || !session?.user) {
    return (
      <main className="mx-auto flex w-full flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="justify-items-center">
            <Doodle name="lock" className="mb-2 size-12 text-primary" />
            <CardTitle className="text-2xl">Sign in to view your dashboard</CardTitle>
            <CardDescription>
              Your notes and inbox settings are waiting on the other side.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/sign-in" />}>
              Sign in
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
      {}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="font-hand text-lg text-primary">your little notebook</p>
          <h1 className="text-4xl leading-tight font-bold sm:text-5xl">
            Hey,{" "}
            {userName ? (
              <ScribbleUnderline className="whitespace-normal break-all">
                {userName}
              </ScribbleUnderline>
            ) : (
              "there"
            )}
            !
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="secondary" className="h-7 px-3 text-sm">
              <Doodle name="envelope" strokeWidth={8} />
              {isLoading
                ? "counting notes…"
                : `${messages.length} ${messages.length === 1 ? "note" : "notes"}`}
            </Badge>
            <Badge
              variant={acceptMessages ? "default" : "outline"}
              className="h-7 px-3 text-sm"
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  acceptMessages ? "bg-primary-foreground" : "bg-muted-foreground"
                )}
                aria-hidden="true"
              />
              {isSwitchLoading
                ? "checking…"
                : acceptMessages
                  ? "Accepting notes"
                  : "Paused"}
            </Badge>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => void fetchMessages(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw aria-hidden="true" />
          )}
          Refresh inbox
        </Button>
      </header>

      {}
      <section
        aria-label="Inbox settings"
        className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Doodle name="paperPlane" className="size-6 text-primary" strokeWidth={6} />
              Your link
            </CardTitle>
            <CardDescription>
              Share it anywhere. Whoever opens it can leave you an anonymous note.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              id="profile-link"
              className="sketch-border-sm relative border-dashed border-foreground/40 bg-note px-4 py-3 font-mono text-sm break-all text-foreground selection:bg-primary/30"
            >
              {profileUrl || (
                <span className="text-muted-foreground">Preparing your link…</span>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => void handleCopyLink()}
                disabled={!profileUrl}
              >
                {copied ? (
                  <Check aria-hidden="true" />
                ) : (
                  <Copy aria-hidden="true" />
                )}
                {copied ? "Copied!" : "Copy link"}
              </Button>
              {profilePath && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  nativeButton={false}
                  render={
                    <Link href={profilePath} target="_blank" rel="noreferrer" />
                  }
                >
                  Preview my page
                  <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Doodle name="mailbox" className="size-6 text-primary" strokeWidth={6} />
              Inbox door
            </CardTitle>
            <CardDescription>
              Pause new notes any time — the ones you already have stay put.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="sketch-border-sm flex items-center justify-between gap-4 border-foreground/30 p-4">
              <div className="space-y-0.5">
                <p id="accept-label" className="font-hand text-xl font-bold">
                  {isSwitchLoading
                    ? "Checking…"
                    : acceptMessages
                      ? "Door's open"
                      : "Door's closed"}
                </p>
                <p id="accept-description" className="text-sm text-muted-foreground">
                  {acceptMessages
                    ? "People can send you new notes."
                    : "Your page tells visitors you're taking a break."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isSwitchLoading && (
                  <LoaderCircle
                    className="size-4 animate-spin text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
                <Switch
                  checked={acceptMessages}
                  onCheckedChange={() => void handleSwitchChange()}
                  disabled={isSwitchLoading}
                  aria-label="Accept new notes"
                  aria-describedby="accept-label accept-description"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {}
      <section aria-labelledby="messages-heading" className="mt-14">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="messages-heading" className="text-3xl font-bold sm:text-4xl">
              Your <span className="highlight">notes</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Newest first. Only you can see these.
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Doodle name="lock" className="size-4" strokeWidth={8} />
            Private to you
          </p>
        </div>

        {isLoading ? (
          <NotesSkeleton />
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-9 pt-2 md:grid-cols-2 xl:grid-cols-3">
            {messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <div className="sketch-border-alt flex flex-col items-center gap-4 border-dashed px-6 py-14 text-center">
            <Doodle
              name="mailbox"
              animated
              className="size-24 text-muted-foreground"
              strokeWidth={3.5}
            />
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">Nothing here… yet</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                {acceptMessages
                  ? "Share your link and the first notes will show up right here."
                  : "Open your inbox door and share your link to start getting notes."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => void handleCopyLink()}
                disabled={!profileUrl}
              >
                <Copy aria-hidden="true" />
                Copy my link
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void fetchMessages(true)}
                disabled={isLoading}
              >
                <RefreshCw aria-hidden="true" />
                Check again
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
