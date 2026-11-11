import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Kalam } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { themeInitScript } from "@/components/theme/script";
import { SketchDefs } from "@/components/sketch/SketchDefs";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const kalam = Kalam({
    variable: "--font-kalam",
    weight: ["300", "400", "700"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Messanno — honest notes, no names attached",
        template: "%s · Messanno",
    },
    description:
        "Get your own anonymous inbox. Share one link and receive honest notes from friends, followers and colleagues.",
    applicationName: "Messanno",
    icons: {
        icon: "/favicon.png",
        shortcut: "/favicon.png",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#faf6ee" },
        { media: "(prefers-color-scheme: dark)", color: "#1f2b2c" },
    ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} h-full antialiased`}
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body className="flex min-h-full flex-col">
                <SketchDefs />
                <AuthProvider>
                    <TooltipProvider delay={300}>
                        {children}
                        <Toaster position="top-center" />
                    </TooltipProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
