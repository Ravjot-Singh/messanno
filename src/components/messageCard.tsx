"use client"

import { useState } from "react"
import { LoaderCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PaperNote, noteStyleFromId } from "@/components/sketch/PaperNote"
import axios from "axios"
import type { ApiMessage, ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

type MessageCardProps = {
  message: ApiMessage
  onMessageDelete: (messageId: string) => void
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
]

function formatRelative(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })
  for (const [unit, unitSeconds] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= unitSeconds) {
      return formatter.format(Math.round(seconds / unitSeconds), unit)
    }
  }
  return "just now"
}

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const createdAt = new Date(message.createdAt)
  const hasDate = !Number.isNaN(createdAt.getTime())
  const fullDate = hasDate ? createdAt.toLocaleString() : "Date unavailable"
  const relativeDate = hasDate ? formatRelative(createdAt) : "Date unavailable"
  const { tilt, tone } = noteStyleFromId(message._id)

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      )
      toast.success(response.data.message || "Message deleted successfully.")
      setIsAlertOpen(false)
      onMessageDelete(message._id)
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        toast.error(
          error.response?.data.message ?? "Could not delete this message."
        )
      } else {
        toast.error("An unexpected error occurred.")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article aria-label={`Anonymous note, received ${relativeDate}`}>
      <PaperNote tone={tone} tilt={tilt} className="flex h-full flex-col">
        <div className="mb-1 flex items-start justify-between gap-2">
          <p className="font-hand text-sm text-muted-foreground">
            from: <span className="italic">someone</span>
          </p>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="-mt-1 -mr-2 text-muted-foreground opacity-70 hover:text-destructive hover:opacity-100 focus-visible:opacity-100"
                  aria-label="Delete note"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tear up this note?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone. The note will be permanently removed
                  from your inbox.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <AlertDialogAction
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                  )}
                  {isDeleting ? "Deleting…" : "Delete note"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="flex-1 font-hand text-lg leading-7 whitespace-pre-wrap wrap-break-word">
          {message.content}
        </p>

        <p className="mt-3 text-xs text-muted-foreground">
          <time dateTime={hasDate ? createdAt.toISOString() : undefined} title={fullDate}>
            received {relativeDate}
          </time>
        </p>
      </PaperNote>
    </article>
  )
}

export default MessageCard
