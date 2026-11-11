import { cn } from "cn"


function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "sketch-radius-sm hatch animate-pulse border-[1.5px] border-dashed border-border/40 bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
