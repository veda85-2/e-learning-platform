export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen w-full max-w-107.5 overflow-hidden bg-white">
        {children}
      </div>
    </main>
  );
}