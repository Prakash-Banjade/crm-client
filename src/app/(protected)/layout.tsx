import type { Metadata } from "next";
import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryClientProvider from "@/lib/react-query/queryClientProvider";
import NextTopLoader from 'nextjs-toploader';
import "../globals.css";
import { ConfirmExitAlertProvider } from "@/context/confirm-exit-provider";

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

export default function ProtectedRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" className={publicSans.variable}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ReactQueryClientProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ConfirmExitAlertProvider>
                            <NextTopLoader />
                            {children}
                            <Toaster richColors />
                        </ConfirmExitAlertProvider>
                    </ThemeProvider>
                </ReactQueryClientProvider>
            </body>
        </html>
    );
}
