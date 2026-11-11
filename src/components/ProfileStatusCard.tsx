import { Doodle, type DoodleName } from "@/components/sketch/Doodle"
import { PaperNote } from "@/components/sketch/PaperNote"

type ProfileStatusCardProps = {
  doodle: DoodleName
  title: string
  description: string
  children?: React.ReactNode
}


export default function ProfileStatusCard({
  doodle,
  title,
  description,
  children,
}: ProfileStatusCardProps) {
  return (
    <PaperNote tone="paper" tilt={-0.75} ruled={false} className="px-6 py-10 text-center sm:px-10">
      <div className="flex flex-col items-center gap-3" role="status">
        <Doodle name={doodle} animated className="size-20 text-muted-foreground" strokeWidth={3.5} />
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="max-w-md text-muted-foreground">{description}</p>
        {children}
      </div>
    </PaperNote>
  )
}
