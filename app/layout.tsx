import "./globals.css";

export const metadata = {
  title: "Trading AI Tutor",
  description: "Learn trading with AI assistance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
