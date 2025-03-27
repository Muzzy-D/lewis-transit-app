export const metadata = {
  title: 'Lewis County Transit Trip Planner',
  description: 'Plan your bus routes in Lewis County, WA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
