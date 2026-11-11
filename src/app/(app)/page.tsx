import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import sampleMessages from "@/messages.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Doodle, type DoodleName } from "@/components/sketch/Doodle";
import { NOTE_TONES, PaperNote } from "@/components/sketch/PaperNote";
import { ScribbleUnderline } from "@/components/sketch/ScribbleUnderline";

const steps: { title: string; body: string; doodle: DoodleName }[] = [
    {
        title: "Grab your link",
        body: "Sign up with a username and verify your email. That's it — no profile to fill in.",
        doodle: "pencil",
    },
    {
        title: "Share it anywhere",
        body: "Drop your link in your bio, a group chat or a story. Anyone can open it — no account needed.",
        doodle: "paperPlane",
    },
    {
        title: "Read honest notes",
        body: "Notes land in your private inbox with no names attached. Pause new notes whenever you want.",
        doodle: "envelope",
    },
];

const promises = [
    "No names, ever",
    "Free forever",
    "Turn it off any time",
];

export default function Home() {
    return (
        <main className="flex-1 overflow-x-clip">
            {}
            <section className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pt-20 lg:pb-24">
                <div className="flex flex-col items-start gap-6">
                    <Badge variant="secondary" className="h-7 px-3 text-sm">
                        <Doodle name="lock" strokeWidth={8} />
                        100% anonymous notes
                    </Badge>

                    <h1 className="text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl">
                        Get honest notes
                        <br />
                        from <ScribbleUnderline>anyone</ScribbleUnderline>
                        <span className="text-primary">.</span>
                    </h1>

                    <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
                        Share one link. Friends, followers and coworkers leave you{" "}
                        <span className="highlight text-foreground">anonymous notes</span>
                        , and you read them in your own private inbox.
                    </p>

                    <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                        <Button
                            size="lg"
                            nativeButton={false}
                            render={<Link href="/sign-up" />}
                        >
                            Get your link
                            <ArrowRight data-icon="inline-end" aria-hidden="true" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            nativeButton={false}
                            render={<Link href="/sign-in" />}
                        >
                            I already have one
                        </Button>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-16 left-40 hidden items-start gap-1 text-muted-foreground sm:flex"
                        >
                            <Doodle name="curlyArrow" animated className="size-14 -scale-x-100 rotate-[25deg]" />
                            <span className="mt-8 -rotate-6 font-hand text-lg whitespace-nowrap">
                                takes about a minute!
                            </span>
                        </div>
                    </div>

                    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground sm:mt-14">
                        {promises.map((promise) => (
                            <li key={promise} className="flex items-center gap-1.5">
                                <Check className="size-4 text-primary" strokeWidth={3} aria-hidden="true" />
                                {promise}
                            </li>
                        ))}
                    </ul>
                </div>

                {}
                <div
                    aria-hidden="true"
                    className="relative mx-auto h-[380px] w-full max-w-md select-none sm:h-[440px]"
                >
                    <svg
                        viewBox="0 0 400 300"
                        fill="none"
                        className="pencil-filter absolute inset-x-0 top-6 h-56 w-full text-foreground/30"
                    >
                        <path
                            d="M20 260 C 80 120, 160 260, 220 150 S 330 40, 380 60"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeDasharray="8 9"
                            strokeLinecap="round"
                        />
                    </svg>
                    <Doodle
                        name="paperPlane"
                        animated
                        className="absolute top-0 right-2 size-20 rotate-6 text-primary sm:size-24"
                        strokeWidth={4.5}
                    />

                    <div className="absolute top-14 left-0 w-[64%] motion-safe:animate-float" style={{ animationDelay: "-1s" }}>
                        <PaperNote tone="yellow" tilt={-5}>
                            <p className="font-hand text-sm text-muted-foreground">To @you</p>
                            <p className="font-hand text-lg leading-7">
                                Your laugh makes Monday standups bearable.
                            </p>
                        </PaperNote>
                    </div>

                    <div className="absolute top-40 right-0 w-[60%] motion-safe:animate-float sm:top-44" style={{ animationDelay: "-3s" }}>
                        <PaperNote tone="blue" tilt={4}>
                            <p className="font-hand text-sm text-muted-foreground">To @you</p>
                            <p className="font-hand text-lg leading-7">
                                Real talk: you should start that blog. I&apos;d read it.
                            </p>
                        </PaperNote>
                    </div>

                    <div className="absolute bottom-0 left-[8%] w-[58%] motion-safe:animate-float" style={{ animationDelay: "-4.5s" }}>
                        <PaperNote tone="pink" tilt={-2}>
                            <p className="font-hand text-lg leading-7">
                                Thanks for always saving me a seat.
                            </p>
                        </PaperNote>
                    </div>

                    <Doodle name="heart" className="absolute right-[12%] bottom-6 size-10 rotate-12 text-destructive/70" strokeWidth={5} />
                    <Doodle name="sparkle" className="absolute top-28 left-[58%] size-8 text-primary/70" />
                    <Doodle name="star" className="absolute -top-2 left-[10%] size-9 -rotate-12 text-foreground/40" />
                </div>
            </section>

            {}
            <section
                aria-labelledby="how-heading"
                className="relative border-y-2 border-dashed border-border/40 bg-muted/40 py-16 sm:py-20"
            >
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <p className="font-hand text-lg text-primary">three tiny steps</p>
                        <h2 id="how-heading" className="text-4xl font-bold sm:text-5xl">
                            How it <span className="highlight">works</span>
                        </h2>
                    </div>

                    <ol className="grid gap-6 md:grid-cols-3 md:gap-10">
                        {steps.map((step, index) => (
                            <li key={step.title} className="relative flex flex-col items-center">
                                <div
                                    className={`sketch-border sketch-shadow flex h-full w-full flex-col items-center gap-4 bg-card p-6 text-center transition-transform duration-300 hover:-translate-y-1 ${
                                        index === 1 ? "md:translate-y-6 md:hover:translate-y-5" : ""
                                    }`}
                                    style={{ rotate: `${[-1, 1, -0.5][index]}deg` }}
                                >
                                    <div className="relative flex size-20 items-center justify-center">
                                        <Doodle
                                            name="scribbleCircle"
                                            className="absolute inset-0 size-20 text-primary/50"
                                            strokeWidth={3}
                                        />
                                        <Doodle name={step.doodle} className="size-10 hover-wiggle" strokeWidth={5} />
                                    </div>
                                    <p className="font-hand text-sm tracking-wide text-muted-foreground uppercase">
                                        Step {index + 1}
                                    </p>
                                    <h3 className="text-2xl font-bold">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.body}</p>
                                </div>

                                {index < steps.length - 1 && (
                                    <>
                                        <Doodle
                                            name="downArrow"
                                            className="mt-4 size-10 text-foreground/40 md:hidden"
                                        />
                                        <Doodle
                                            name="arrow"
                                            className="absolute top-1/3 -right-9 z-10 hidden size-12 text-foreground/50 md:block"
                                        />
                                    </>
                                )}
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {}
            <section aria-labelledby="samples-heading" className="py-16 sm:py-24">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                    <div className="mb-10 flex flex-col items-center gap-2 text-center">
                        <Doodle name="speechBubble" className="size-12 text-primary" strokeWidth={5} />
                        <h2 id="samples-heading" className="text-4xl font-bold sm:text-5xl">
                            Notes people actually get
                        </h2>
                        <p className="max-w-xl text-muted-foreground">
                            Kind words, honest feedback, and the occasional croissant emergency.
                            Here&apos;s a peek at what lands in a Messanno inbox.
                        </p>
                    </div>

                    <Carousel opts={{ align: "start", loop: true }} aria-label="Sample anonymous notes">
                        <CarouselContent className="py-6">
                            {sampleMessages.map((message, index) => (
                                <CarouselItem
                                    key={message.title + index}
                                    className="basis-[88%] px-3 sm:basis-1/2 lg:basis-1/3"
                                >
                                    <PaperNote
                                        tone={NOTE_TONES[index % 4]}
                                        tilt={[-1.5, 1, -0.75, 1.5, -1, 0.75][index % 6]}
                                        className="flex h-full flex-col"
                                    >
                                        <p className="font-hand text-sm text-muted-foreground">
                                            {message.title}
                                        </p>
                                        <p className="font-hand text-lg leading-7">
                                            {message.content}
                                        </p>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            received {message.received}
                                        </p>
                                    </PaperNote>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="mt-4 flex items-center justify-center gap-4">
                            <CarouselPrevious className="static my-0" />
                            <span className="font-hand text-muted-foreground">swipe for more</span>
                            <CarouselNext className="static my-0" />
                        </div>
                    </Carousel>

                    <div className="mt-14 flex flex-col items-center gap-3 text-center">
                        <p className="font-hand text-2xl">Your turn?</p>
                        <Button
                            size="lg"
                            nativeButton={false}
                            render={<Link href="/sign-up" />}
                        >
                            Create my anonymous inbox
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
