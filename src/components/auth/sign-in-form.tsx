"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { LoadingButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useTransition } from "react"
import { toast } from "sonner"

const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters"),
})

export type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
    const [isPending, startTransition] = useTransition();

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    })

    const onSubmit = (data: SignInFormData) => {
        startTransition(async () => {
            try {
                // const { data: res, error } = await authClient.signIn.email(data);
                // if (error) throw error;

            } catch (e) {
                if (e instanceof Object && "message" in e) {
                    toast.error(e.message as string);
                }
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">
                                Email
                            </FieldLabel>
                            <Input
                                {...field}
                                id="email"
                                aria-invalid={fieldState.invalid}
                                type="email"
                                placeholder="email@example.com"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="password">
                                Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="password"
                                aria-invalid={fieldState.invalid}
                                type="password"
                                placeholder="********"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            <LoadingButton
                type="submit"
                className="w-full"
                isLoading={isPending}
                loadingText="Signing in..."
            >
                Sign In
            </LoadingButton>
        </form>
    )
}
