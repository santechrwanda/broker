"use client";
import AuthenticationFooter from "@/components/layouts/footers/auth-footer";
import { store } from "@/hooks/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

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
                <ToastContainer
                    position="top-right"
                    autoClose={30000} //30 seconds
                    theme="dark"
                />
            </section>
        </Provider>
    );
}
