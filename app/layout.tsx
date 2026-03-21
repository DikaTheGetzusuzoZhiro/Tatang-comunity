export const metadata = {
  title: "Exry Hub",
  description: "Mod GTA SA"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0b0b" }}>
        {children}
      </body>
    </html>
  );
}
