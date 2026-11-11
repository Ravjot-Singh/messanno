"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { LoaderCircleIcon } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { AuthCard } from "@/components/sketch/AuthCard"

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        mode: "onChange",
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        try {
            const result = await signIn("credentials", {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            })

            if (result?.error) {
                toast.error("Sign in failed. Check your credentials and verify your account.")
                return
            }

            if (result?.ok) {
                router.replace("/dashboard")
                router.refresh()
                return
            }

            toast.error("Unable to sign in. Please try again.")
        } catch {
            toast.error("Unable to sign in. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthCard
            doodle="envelope"
            title="Welcome back"
            description="Sign in to read the notes waiting in your inbox."
            footer={
                <p>
                    New to Messanno?{" "}
                    <Link href="/sign-up" className="hand-underline font-medium text-primary">
                        Create your link
                    </Link>
                </p>
            }
        >

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                >
                    <FieldGroup>
                        <Controller
                            name="identifier"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="identifier">Email or username</FieldLabel>
                                    <Input
                                        {...field}
                                        id="identifier"
                                        type="text"
                                        autoComplete="username"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        placeholder="you@example.com or username"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={
                                            fieldState.error ? "identifier-error" : undefined
                                        }
                                    />
                                    <FieldError
                                        id="identifier-error"
                                        errors={[fieldState.error]}
                                    />
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Your password"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={
                                            fieldState.error ? "password-error" : undefined
                                        }
                                    />
                                    <FieldError
                                        id="password-error"
                                        errors={[fieldState.error]}
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
                                Please wait...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>

        </AuthCard>
    )
}

export default Page
