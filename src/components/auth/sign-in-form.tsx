"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { LoadingButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useTransition } from "react"
import { toast } from "sonner"
import { signIn } from "@/lib/actions/auth/signin.action"
import { CookieKey } from "@/lib/constants"
import { useAuth } from "@/context/auth-provider"
import { useRouter, useSearchParams } from "next/navigation"

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
    const { setSession } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "prakash@gmail.com",
            password: "Prakash@221",
        },
    })

    const onSubmit = (data: SignInFormData) => {
        startTransition(async () => {
            try {
                const res: { [CookieKey.ACCESS_TOKEN]: string } = await signIn(data);

                const user = setSession({ accessToken: res[CookieKey.ACCESS_TOKEN] });

                const callbackUrl = searchParams.get("callbackUrl");
                if (callbackUrl) return router.push(callbackUrl);

                router.push(`/${user?.role}/dashboard`);

            } catch (e) {
                if (e instanceof Error) {
                    toast.error(e.message);
                    return;
                }
                toast.error("Something went wrong");
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
