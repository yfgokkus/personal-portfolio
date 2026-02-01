"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid credentials");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-6 rounded-xl bg-neutral-800 p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold text-white">
          Admin Login
        </h1>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
            placeholder="Enter username"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
            placeholder="Enter password"
            required
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}
