"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useRef, useState } from "react"
import * as z from "zod"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { CircleCheck, CircleX, LoaderCircleIcon } from "lucide-react"
import Link from "next/link"
import { AuthCard } from "@/components/sketch/AuthCard"

const Page = () => {
  const [userName, setUserName] = useState("")
  const [userNameMessage, setUserNameMessage] = useState("")
  const [isCheckingUserName, setIsCheckingUserName] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(false)
  const [checkedUserName, setCheckedUserName] = useState("")
  const usernameCheckId = useRef(0)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  })

  const checkUserNameUnique = useCallback(
    async (username: string, requestId: number) => {
      if (requestId !== usernameCheckId.current) {
        return
      }

      try {
        const response = await axios.get<ApiResponse>(
          "/api/check-username-unique",
          { params: { userName: username } }
        )

        if (requestId === usernameCheckId.current) {
          setUserNameMessage(response.data.message)
          setIsUserNameAvailable(response.data.success)
          setCheckedUserName(username)
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        if (requestId === usernameCheckId.current) {
          setUserNameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
          setIsUserNameAvailable(false)
          setCheckedUserName(username)
        }
      } finally {
        if (requestId === usernameCheckId.current) {
          setIsCheckingUserName(false)
        }
      }
    },
    []
  )
  const debouncedCheckUserName = useDebounceCallback(checkUserNameUnique, 500)

  useEffect(
    () => () => {
      debouncedCheckUserName.cancel()
      usernameCheckId.current += 1
    },
    [debouncedCheckUserName]
  )

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (
      isCheckingUserName ||
      userName.trim() !== data.userName ||
      checkedUserName.trim() !== data.userName ||
      !isUserNameAvailable
    ) {
      toast.error("Please choose an available username.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data)
      toast.success(response.data.message || "Account created successfully!")
      router.replace(`/verify/${encodeURIComponent(data.userName)}`)
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        
        toast.error(
          error.response?.data?.message ||
            "Can't use this service at the moment, try again later."
        )
      } else {
        toast.error("An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      doodle="paperPlane"
      title="Get your link"
      description="Pick a username, verify your email, and start collecting honest notes."
      footer={
        <p>
          Already have an inbox?{" "}
          <Link href="/sign-in" className="hand-underline font-medium text-primary">
            Sign in
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
              name="userName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="userName">Username</FieldLabel>
                  <Input
                    {...field}
                    id="userName"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="e.g. sketchyfox"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.error
                        ? "userName-error userName-status"
                        : "userName-status"
                    }
                    onChange={(event) => {
                      field.onChange(event)
                      const nextUserName = event.target.value
                      const requestId = ++usernameCheckId.current
                      setUserName(nextUserName)
                      setUserNameMessage("")
                      setIsUserNameAvailable(false)
                      setCheckedUserName("")
                      setIsCheckingUserName(nextUserName.length > 0)

                      if (nextUserName.length > 0) {
                        debouncedCheckUserName(nextUserName, requestId)
                      } else {
                        debouncedCheckUserName.cancel()
                      }
                    }}
                  />
                  <FieldError
                    id="userName-error"
                    errors={[fieldState.error]}
                  />
                  <FieldDescription
                    id="userName-status"
                    role="status"
                    aria-live="polite"
                    className={
                      checkedUserName !== userName
                        ? undefined
                        : isUserNameAvailable
                          ? "text-emerald-700 dark:text-emerald-300"
                          : userNameMessage
                            ? "text-destructive"
                            : undefined
                    }
                  >
                    {checkedUserName !== userName && isCheckingUserName ? (
                      <span className="inline-flex items-center gap-1.5">
                        <LoaderCircleIcon className="size-3.5 animate-spin" aria-hidden="true" />
                        Checking username…
                      </span>
                    ) : checkedUserName === userName && userNameMessage ? (
                      <span className="inline-flex items-center gap-1.5">
                        {isUserNameAvailable ? (
                          <CircleCheck className="size-3.5" aria-hidden="true" />
                        ) : (
                          <CircleX className="size-3.5" aria-hidden="true" />
                        )}
                        {userNameMessage}
                      </span>
                    ) : (
                      ""
                    )}
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.error ? "email-error" : undefined
                    }
                  />
                  <FieldError id="email-error" errors={[fieldState.error]} />
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
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
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
            disabled={
              isSubmitting ||
              isCheckingUserName ||
              !form.formState.isValid ||
              checkedUserName !== userName ||
              !isUserNameAvailable
            }
          >
            {isSubmitting ? (
              <>
                <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
                Creating your inbox…
              </>
            ) : ("Create account")}
          </Button>
        </form>

    </AuthCard>
  )
}

export default Page
