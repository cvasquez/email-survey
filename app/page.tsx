export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md text-center px-4">
        <h1 className="text-5xl font-bold mb-4 text-slate-900">Email Survey Tool</h1>
        <p className="text-lg text-slate-700 mb-10 leading-relaxed">
          Create simple surveys that embed directly in your emails.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="px-8 py-3 border-2 border-slate-300 text-slate-900 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
