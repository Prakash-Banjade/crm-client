import { SignInForm } from '@/components/auth/sign-in-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <Card className="w-full max-w-md border-none ring-0 bg-transparent shadow-none">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-semibold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-base">Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent className='mt-10'>
                    <SignInForm />

                    <div className="mt-6 text-center text-sm">
                        <Link
                            href="/forgot-password"
                            className="text-muted-foreground hover:text-primary underline underline-offset-4"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}