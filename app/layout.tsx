import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";

const ubuntu = localFont({
    src: [
        {
            path: "./Ubuntu/Ubuntu-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "./Ubuntu/Ubuntu-LightItalic.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "./Ubuntu/Ubuntu-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./Ubuntu/Ubuntu-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "./Ubuntu/Ubuntu-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "./Ubuntu/Ubuntu-MediumItalic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "./Ubuntu/Ubuntu-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "./Ubuntu/Ubuntu-BoldItalic.ttf",
            weight: "700",
            style: "italic",
        },
    ],
    variable: "--font-ubuntu",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Jaki to film?",
    description: "Gra w zgadywanie filmów na podstawie klatek.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pl"
            className={`${ubuntu.variable} font-sans h-full antialiased`}
        >
        <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
