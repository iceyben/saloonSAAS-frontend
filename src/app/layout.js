import "./globals.css";

export const metadata = {
  title: {
    default: "Choice Saloon — Luxury Beauty at Home",
    template: "%s | Choice Saloon",
  },
  description: "Premium hair, nail, and makeup services delivered at home in Kigali. Book your appointment today.",
  keywords: ["salon", "hair", "nails", "makeup", "braids", "Kigali", "beauty", "home service"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
