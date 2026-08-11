import "./globals.css";

export const metadata = {
  title: "DevKit",
  description: "URL shortener and API tester for developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
