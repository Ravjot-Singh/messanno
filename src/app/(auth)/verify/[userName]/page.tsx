"use client"

import { Suspense } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { LoaderCircleIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthCard } from "@/components/sketch/AuthCard"
import { verifySchema } from "@/schemas/verifySchema"
import type { ApiResponse } from "@/types/ApiResponse"

const VerifyAccountForm = () => {
  const router = useRouter()
  const { userName } = useParams<{ userName: string }>()
  const decodedUserName = (() => {
    try {
      return decodeURIComponent(userName ?? "")
    } catch {
      return userName ?? ""
    }
  })()
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        userName,
        code: data.code,
      })

      toast.success(response.data.message || "Account verified successfully.")
      router.replace("/sign-in")
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        toast.error(
          error.response?.data.message ??
            "Unable to verify your account. Please try again."
        )
      } else {
        toast.error("An unexpected error occurred.")
      }
    }
  }

  return (
    <AuthCard
      doodle="envelope"
      title="Check your email"
      description={
        <>
          We sent a six-digit code for{" "}
          <span className="font-medium text-foreground">@{decodedUserName}</span>.
          Pop it in below.
        </>
      }
    >

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="code">Verification code</FieldLabel>
                  <Input
                    {...field}
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="••••••"
                    className="h-14 text-center font-mono text-2xl tracking-[0.5em] md:text-2xl"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.error ? "code-error code-description" : "code-description"
                    }
                  />
                  <FieldError id="code-error" errors={[fieldState.error]} />
                  <FieldDescription id="code-description">
                    The code is valid for one hour.
                  </FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
                Verifying...
              </>
            ) : (
              "Verify account"
            )}
          </Button>
        </form>
    </AuthCard>
  )
}

const VerifyAccountPage = () => (
  <Suspense
    fallback={
      <p role="status" className="font-hand text-lg text-muted-foreground">
        Loading verification form…
      </p>
    }
  >
    <VerifyAccountForm />
  </Suspense>
)

export default VerifyAccountPage
