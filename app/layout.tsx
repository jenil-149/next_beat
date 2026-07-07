import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/frontend/components/Sidebar";
import SupabaseProvider from "@/frontend/providers/Supabase_providers";
import UserProvider from "@/frontend/providers/userProvider";
import ModalProvider from "@/frontend/providers/ModalProvider";
import ToasterProvider from "@/frontend/providers/ToasterProvider";
import getSongsByUserId from "@/backend/actions/getSongsByUserid";
import Player from "@/frontend/components/Player";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Node_Beat",
  description: "Music Streaming App",
};
export const revalidate = 0;
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const userSong = await getSongsByUserId();

  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSong}>
              {children}

            </Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

