"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { LoaderCircle, Send, Sparkles } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import ProfileStatusCard from "@/components/ProfileStatusCard"
import { Doodle } from "@/components/sketch/Doodle"
import { NOTE_TONES, PaperNote } from "@/components/sketch/PaperNote"
import { cn } from "@/lib/utils"
import { MESSAGE_MAX_LENGTH, messageSchema } from "@/schemas/messageSchema"
import type { ApiResponse } from "@/types/ApiResponse"

type FormValues = z.infer<typeof messageSchema>
type InboxState = "open" | "closed" | "not-found"

export default function SendMessageForm({ userName }: { userName: string }) {
  const [inboxState, setInboxState] = useState<InboxState>("open")
  const [justSent, setJustSent] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSuggesting, setIsSuggesting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(messageSchema),
    mode: "onChange",
    defaultValues: { content: "" },
  })

  
  useEffect(() => {
    if (sentCount === 0) return
    const timer = setTimeout(() => setJustSent(false), 2600)
    return () => clearTimeout(timer)
  }, [sentCount])

  const content = useWatch({ control: form.control, name: "content" }) ?? ""
  const length = content.length
  const isOverLimit = length > MESSAGE_MAX_LENGTH
  const { isSubmitting } = form.formState

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        userName,
        content: data.content,
      })
      toast.success(response.data.message || "Note sent anonymously!")
      form.reset({ content: "" })
      setJustSent(true)
      setSentCount((count) => count + 1)
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        const status = error.response?.status
        if (status === 404) return setInboxState("not-found")
        if (status === 403) return setInboxState("closed")
        toast.error(
          error.response?.data?.message ?? "Couldn't send your note. Please try again."
        )
      } else {
        toast.error("An unexpected error occurred.")
      }
    }
  }

  const fetchSuggestions = async () => {
    setIsSuggesting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages")
      setSuggestions(response.data.questions ?? [])
    } catch {
      toast.error("Couldn't think of anything right now. Try again?")
    } finally {
      setIsSuggesting(false)
    }
  }

  const applySuggestion = (question: string) => {
    form.setValue("content", question, { shouldValidate: true, shouldDirty: true })
    textareaRef.current?.focus()
  }

  if (inboxState === "not-found") {
    return (
      <ProfileStatusCard
        doodle="speechBubble"
        title="Hmm, nobody lives here"
        description={`There's no Messanno inbox for @${userName}. Double-check the link.`}
      />
    )
  }

  if (inboxState === "closed") {
    return (
      <ProfileStatusCard
        doodle="mailbox"
        title="This inbox is taking a nap"
        description={`@${userName} just stopped accepting notes. Try again a little later!`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative">
        <PaperNote tone="paper" tilt={0} tape ruled={false} interactive={false} className="p-4 pt-7 sm:p-6 sm:pt-8">
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="content" className="font-hand text-xl">
                  Your note to @{userName}
                </FieldLabel>
                <div className="margin-line relative">
                  <Textarea
                    {...field}
                    ref={(element) => {
                      field.ref(element)
                      textareaRef.current = element
                    }}
                    id="content"
                    rows={6}
                    placeholder="Write something kind, honest or curious…"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="content-count content-error"
                    className="ruled min-h-48 resize-y border-dashed bg-transparent pl-12 font-hand text-lg leading-7 md:text-lg"
                  />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <FieldError id="content-error" errors={[fieldState.error]} />
                  <p
                    id="content-count"
                    aria-live="polite"
                    className={cn(
                      "ml-auto shrink-0 font-hand text-sm text-muted-foreground tabular-nums",
                      isOverLimit && "font-bold text-destructive"
                    )}
                  >
                    {length}/{MESSAGE_MAX_LENGTH}
                  </p>
                </div>
              </Field>
            )}
          />

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Doodle name="lock" className="size-4" strokeWidth={8} />
              No name, email or account is attached to your note.
            </p>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Send aria-hidden="true" />
              )}
              {isSubmitting ? "Sending…" : "Send anonymously"}
            </Button>
          </div>
        </PaperNote>

        {justSent && (
          <div
            role="status"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="motion-safe:animate-stamp rotate-[-8deg] rounded-md border-4 border-primary bg-background/80 px-6 py-2 font-hand text-4xl font-bold tracking-widest text-primary uppercase shadow-sm">
              Sent!
            </span>
          </div>
        )}
      </form>

      <section aria-labelledby="ideas-heading" className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="ideas-heading" className="text-2xl font-bold">
              Stuck? Borrow an idea
            </h2>
            <p className="text-sm text-muted-foreground">
              Tap a note to drop it into the box, then make it yours.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void fetchSuggestions()}
            disabled={isSuggesting}
          >
            {isSuggesting ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles aria-hidden="true" />
            )}
            {suggestions.length ? "Shuffle ideas" : "Give me ideas"}
          </Button>
        </div>

        {isSuggesting ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <Skeleton key={key} className="h-28" />
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <ul className="grid gap-5 pt-2 sm:grid-cols-3">
            {suggestions.map((question, index) => (
              <li key={question}>
                <button
                  type="button"
                  onClick={() => applySuggestion(question)}
                  className="block h-full w-full cursor-pointer text-left outline-none focus-visible:[&>div]:ring-3 focus-visible:[&>div]:ring-ring/50"
                  aria-label={`Use suggestion: ${question}`}
                >
                  <PaperNote
                    tone={NOTE_TONES[index % 4]}
                    tilt={[-2, 1.5, -1][index % 3]}
                    tape={false}
                    ruled={false}
                    className="h-full p-4 pt-4"
                  >
                    <p className="font-hand text-lg leading-snug">{question}</p>
                  </PaperNote>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="sketch-border-sm flex items-center gap-3 border-dashed p-4 text-sm text-muted-foreground">
            <Doodle name="sparkle" className="size-6 text-primary" />
            Hit &ldquo;Give me ideas&rdquo; for three friendly conversation starters.
          </div>
        )}
      </section>
    </div>
  )
}
