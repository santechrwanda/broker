"use client";
import AuthenticationFooter from "@/components/layouts/footers/auth-footer";
import { store } from "@/hooks/store";
import { Provider } from "react-redux";

// export const metadata: Metadata = {
//     title: "Authentication",
//     description: "Authentication for Stock Broker",
//     icons: {
//         icon: "/icon.svg",
//     },
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider store={store}>
            <section className="absolute flex flex-col justify-between w-full top-0 min-h-screen">
                <div></div>
                {children}
                <AuthenticationFooter />
            </section>
        </Provider>
    );
}
