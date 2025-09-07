export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">
      <div className="text-center p-6 bg-black bg-opacity-50 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Todo App</h1>
        <p className="text-lg mb-6">Manage your tasks easily and stay productive!</p>
        <div className="flex justify-center gap-4">
          <a href="/login" className="px-6 py-3 bg-blue-700 rounded hover:bg-blue-800 transition">
            Login
          </a>
          <a href="/signup" className="px-6 py-3 bg-purple-700 rounded hover:bg-purple-800 transition">
            Signup
          </a>
          <a href="/dashboard" className="px-6 py-3 bg-green-700 rounded hover:bg-green-800 transition">
            Start
          </a>
        </div>
      </div>
    </div>
  );
}
