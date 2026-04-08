export const metadata = {
  title: "Invoice Studio | Auth",
  description: "Secure access to your invoices.",
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-amber-50 to-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
