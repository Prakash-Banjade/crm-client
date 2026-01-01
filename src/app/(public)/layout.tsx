import type { Metadata } from "next";
import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Abhyam CRM",
    description: "Complete 360° CRM Solution for Education Consultancies",
};

async function AuthenticatedRedirect({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (session) {
        redirect(`/${session.role}/dashboard`);
    }

    return children;
}

export default function PublicRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={publicSans.variable} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Suspense fallback={null}>
                        <AuthenticatedRedirect>
                            {children}
                        </AuthenticatedRedirect>
                    </Suspense>
                    <Toaster richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
