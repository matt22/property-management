import "./globals.css";

export const metadata = {
  title: "Folio | Property portfolio",
  description: "A considered workspace for property portfolios.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
