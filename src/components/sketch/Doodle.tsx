import { cn } from "@/lib/utils"


const DOODLES = {
  arrow: ["M6 62 C 28 30, 58 22, 90 34", "M76 22 L 90 34 L 74 44"],
  curlyArrow: [
    "M8 78 C 14 48, 40 30, 46 48 C 52 66, 26 70, 30 50 C 34 30, 66 20, 90 30",
    "M76 18 L 90 30 L 76 40",
  ],
  downArrow: ["M48 6 C 56 30, 40 58, 52 90", "M38 76 L 52 92 L 64 74"],
  star: [
    "M50 8 L 60 38 L 92 38 L 66 58 L 77 90 L 50 71 L 23 89 L 34 58 L 8 40 L 40 37 Z",
  ],
  heart: [
    "M50 86 C 22 64, 8 44, 17 26 C 27 9, 45 14, 50 31 C 55 14, 73 9, 83 26 C 92 43, 79 63, 50 86",
  ],
  envelope: [
    "M9 25 L 91 22 L 92 78 L 8 79 Z",
    "M10 27 L 50 56 L 90 24",
    "M9 77 L 38 50 M91 76 L 62 49",
  ],
  paperPlane: ["M7 50 L 93 11 L 63 89 L 48 58 Z", "M48 58 L 93 11", "M48 58 L 46 80 L 57 66"],
  spiral: [
    "M50 50 C 50 44, 58 44, 58 50 C 58 58, 44 60, 42 50 C 40 38, 60 34, 66 48 C 72 64, 50 74, 36 66 C 22 56, 26 30, 46 26 C 68 22, 84 40, 80 62",
  ],
  speechBubble: [
    "M15 20 C 40 11, 75 12, 88 22 C 96 36, 93 55, 82 62 C 66 69, 46 68, 36 67 L 18 86 L 24 63 C 11 57, 7 35, 15 20 Z",
  ],
  scribbleCircle: [
    "M22 52 C 18 26, 80 14, 89 44 C 96 74, 26 88, 13 60 C 6 40, 40 18, 72 22",
  ],
  sparkle: [
    "M50 8 C 52 32, 56 46, 92 50 C 58 54, 52 66, 50 92 C 47 66, 42 54, 8 50 C 42 46, 48 32, 50 8 Z",
  ],
  mailbox: [
    "M18 46 C 18 30, 32 22, 48 22 L 80 21 C 90 22, 93 32, 92 46 L 92 72 L 18 72 Z",
    "M48 22 C 62 23, 66 33, 66 46 L 66 72",
    "M54 72 L 55 96",
    "M80 46 L 80 28 L 90 31 L 80 35",
  ],
  pencil: [
    "M14 86 L 22 64 L 72 14 L 86 28 L 36 78 Z",
    "M14 86 L 36 78",
    "M22 64 L 36 78",
    "M64 22 L 78 36",
  ],
  sun: [
    "M50 32 C 62 31, 69 40, 68 51 C 67 62, 58 69, 48 68 C 37 67, 31 58, 32 48 C 33 38, 40 32, 52 33",
    "M50 8 L 50 20 M50 80 L 50 92 M8 50 L 20 50 M80 50 L 92 50 M21 21 L 29 29 M71 71 L 79 79 M79 21 L 71 29 M29 71 L 21 79",
  ],
  moon: [
    "M62 13 C 34 17, 20 45, 31 68 C 42 89, 71 91, 87 74 C 61 78, 44 60, 47 39 C 49 27, 55 19, 62 13 Z",
    "M76 22 L 76 32 M71 27 L 81 27",
  ],
  lock: [
    "M22 46 L 78 45 L 79 88 L 21 89 Z",
    "M32 46 C 31 20, 69 18, 68 45",
    "M50 62 L 50 74",
  ],
  inbox: [
    "M10 55 L 26 18 L 74 17 L 90 55 L 90 84 L 10 85 Z",
    "M10 55 L 34 55 C 36 66, 64 66, 66 55 L 90 55",
  ],
} as const

export type DoodleName = keyof typeof DOODLES

type DoodleProps = {
  name: DoodleName
  className?: string
  
  animated?: boolean
  strokeWidth?: number
  
  title?: string
}

export function Doodle({
  name,
  className,
  animated = false,
  strokeWidth = 4,
  title,
}: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("pencil-filter shrink-0 overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {DOODLES[name].map((d, index) => (
        <path
          key={index}
          d={d}
          pathLength={1}
          className={animated ? "draw-path" : undefined}
          style={
            animated ? { animationDelay: `${0.25 + index * 0.25}s` } : undefined
          }
        />
      ))}
    </svg>
  )
}
