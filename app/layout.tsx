import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import type { Metadata } from "next";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Ghanima's Lab — Cross-Media Library",
    template: "%s | Ghanima's Lab",
  },
  description:
    "Track films, TV, anime, games, and books in one place. Rate, collect, and discuss what you love.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Ghanima's Lab",
    title: "Ghanima's Lab — Cross-Media Library",
    description:
      "Track films, TV, anime, games, and books in one place.",
    images: [{ url: "/feyris-cat-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Ghanima's Lab — Cross-Media Library",
    description:
      "Track films, TV, anime, games, and books in one place.",
    images: ["/feyris-cat-512.png"],
  },
  other: {
    "msapplication-TileColor": "#0c0c0e",
    "msapplication-TileImage": "/feyris-cat-512.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#c5c2bc",
          colorBackground: "#121214",
          colorText: "#f0eeea",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${jakarta.className} bg-fey-black text-cream min-h-screen antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

