import './globals.css';

export const metadata = {
  title: 'Student Task Management',
  description: 'A simple task management system for students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
