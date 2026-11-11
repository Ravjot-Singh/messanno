import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { connection } from "next/server"

import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Doodle } from "@/components/sketch/Doodle"
import { ScribbleUnderline } from "@/components/sketch/ScribbleUnderline"
import SendMessageForm from "@/components/SendMessageForm"
import ProfileStatusCard from "@/components/ProfileStatusCard"

type ProfileStatus = "open" | "closed" | "not-found" | "unknown"

function decodeUserName(raw: string) {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

async function getProfileStatus(userName: string): Promise<ProfileStatus> {
  
  await connection()
  try {
    await dbConnect()
    const user = await UserModel.findOne({ userName, isVerified: true })
      .select("isAcceptingMessage")
      .lean()

    if (!user) return "not-found"
    return user.isAcceptingMessage ? "open" : "closed"
  } catch (error) {
    console.error("Could not load public profile", error)
    
    return "unknown"
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/u/[userName]">): Promise<Metadata> {
  const { userName } = await params
  const name = decodeUserName(userName)
  return {
    title: `Send @${name} an anonymous note`,
    description: `Leave @${name} an honest, anonymous note on Messanno.`,
  }
}

async function ProfileBody({ params }: { params: PageProps<"/u/[userName]">["params"] }) {
  const { userName: raw } = await params
  const userName = decodeUserName(raw)
  const status = await getProfileStatus(userName)

  return (
    <>
      <header className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-10">
        <span className="flex size-16 items-center justify-center rounded-full border-2 border-foreground/70 bg-note font-hand text-3xl font-bold sketch-shadow-sm">
          {userName.charAt(0).toUpperCase()}
        </span>
        <h1 className="text-4xl leading-tight font-bold break-words sm:text-5xl">
          Send <ScribbleUnderline className="whitespace-normal">@{userName}</ScribbleUnderline>
          <br className="hidden sm:block" /> an anonymous note
        </h1>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Doodle name="lock" className="size-5" strokeWidth={7} />
          They&apos;ll never know it was you.
        </p>
      </header>

      {status === "not-found" ? (
        <ProfileStatusCard
          doodle="speechBubble"
          title="Hmm, nobody lives here"
          description={`There's no Messanno inbox for @${userName}. Double-check the link, or grab a username like this for yourself.`}
        />
      ) : status === "closed" ? (
        <ProfileStatusCard
          doodle="mailbox"
          title="This inbox is taking a nap"
          description={`@${userName} isn't accepting new notes right now. Try again a little later!`}
        />
      ) : (
        <SendMessageForm userName={userName} />
      )}
    </>
  )
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading profile">
      <Skeleton className="size-16 rounded-full" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="mt-6 h-64 w-full" />
    </div>
  )
}

export default function PublicProfilePage({ params }: PageProps<"/u/[userName]">) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileBody params={params} />
      </Suspense>

      <aside className="sketch-border-alt relative mt-14 flex flex-col items-center gap-4 border-dashed bg-muted/40 p-6 text-center sm:flex-row sm:text-left">
        <Doodle name="envelope" className="size-14 shrink-0 -rotate-6 text-primary" strokeWidth={5} />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Want your own anonymous inbox?</h2>
          <p className="text-sm text-muted-foreground">
            Get a link like this in about a minute. It&apos;s free.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/sign-up" />}>
          Create mine
        </Button>
      </aside>
    </main>
  )
}
