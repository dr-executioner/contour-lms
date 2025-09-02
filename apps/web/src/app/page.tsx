import ProtectedRoute from "../components/ProtectedRoutes";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <main className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-white">Welcome to Home!</h1>
				<button>Log Out</button>
      </main>
    </ProtectedRoute>
  );
}

