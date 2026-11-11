import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

const TONES = {
  yellow: "bg-note",
  blue: "bg-note-2",
  pink: "bg-note-3",
  green: "bg-note-4",
  paper: "bg-card",
} as const

export type NoteTone = keyof typeof TONES
export const NOTE_TONES = Object.keys(TONES) as NoteTone[]

type PaperNoteProps = {
  children: ReactNode
  className?: string
  tone?: NoteTone
  
  tilt?: number
  tape?: boolean
  ruled?: boolean
  
  interactive?: boolean
  style?: CSSProperties
}


export function PaperNote({
  children,
  className,
  tone = "yellow",
  tilt = 0,
  tape = true,
  ruled = true,
  interactive = true,
  style,
}: PaperNoteProps) {
  return (
    <div
      style={{ "--tilt": `${tilt}deg`, ...style } as CSSProperties}
      className={cn(
        "group/note sketch-border-alt sketch-shadow relative border-foreground/55 p-5 pt-6 text-card-foreground transition-transform duration-300 ease-out [transform:rotate(var(--tilt))]",
        interactive &&
          "hover:[transform:rotate(0deg)_translateY(-3px)] focus-within:[transform:rotate(0deg)]",
        TONES[tone],
        tape && "tape",
        className
      )}
    >
      <div className={cn("relative", ruled && "ruled")}>{children}</div>
    </div>
  )
}


export function noteStyleFromId(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0
  }
  const positive = Math.abs(hash)
  const tilts = [-2, -1.25, -0.5, 0.75, 1.5, 2.25]
  const tones: NoteTone[] = ["yellow", "blue", "pink", "green"]
  return {
    tilt: tilts[positive % tilts.length],
    tone: tones[Math.floor(positive / 7) % tones.length],
  }
}
