import "./globals.css";

export const metadata = {
  title: "DevTrack",
  description: "GitHub Intelligence Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}