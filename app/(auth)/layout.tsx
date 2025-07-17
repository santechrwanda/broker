import AuthenticationFooter from "@/components/layouts/footers/auth-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication for Stock Broker",
    icons: {
        icon: "/icon.svg",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <section className="absolute w-full top-0 min-h-screen">
            {children}
            <AuthenticationFooter />
        </section>
    );
}
