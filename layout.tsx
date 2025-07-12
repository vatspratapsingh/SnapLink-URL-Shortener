
export const metadata = {
  title: 'SnapLink | Lightning-fast URL Shortener',
  description: 'Shorten and share URLs instantly with SnapLink!',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-sans min-h-screen">
        <main className="flex items-center justify-center p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
