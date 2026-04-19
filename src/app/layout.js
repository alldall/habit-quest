import localFont from "next/font/local";
import "@/styles/globals.scss";
import Sidebar from "@/components/Sidebar";
import { GameProvider } from "@/components/GameProvider";
import PageTransition from "@/components/PageTransition";
import RouteLoader from "@/components/RouteLoader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "HabitQuest — Gamified Habit Tracker",
  description: "Level up your life by building habits. Your character grows as you do.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <GameProvider>
          <RouteLoader />
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
