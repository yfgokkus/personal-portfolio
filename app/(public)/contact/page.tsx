"use client";

import { useState, useEffect } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mail, setMail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMail();
  }, []);

  const fetchMail = async () => {
    const res = await fetch("/api/user/email");
    const json = await res.json();
    if (res.ok) setMail(json.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: name,
          sender_email: email,
          body: message,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to send message");
        return;
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
        mx-auto min-h-[calc(100vh-4rem)]
        max-w-2xl
        px-4 sm:px-6 lg:px-8
        py-16 sm:py-20
        flex items-center
      "
    >
      <div className="w-full animate-fade-in">
        <h2 className="mb-8 text-center font-bold text-2xl sm:text-3xl">
          Contact
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border px-4 py-2.5 text-sm
                border-slate-300 bg-slate-50 text-slate-900
                focus:outline-none focus:border-slate-500
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
                dark:focus:border-slate-400
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">E-mail</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border px-4 py-2.5 text-sm
                border-slate-300 bg-slate-50 text-slate-900
                focus:outline-none focus:border-slate-500
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
                dark:focus:border-slate-400
              "
            />
          </div>

          {/* Message */}
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea
              rows={6}
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full rounded-md border px-4 py-2.5 text-sm resize-none
                border-slate-300 bg-slate-50 text-slate-900
                focus:outline-none focus:border-slate-500
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
                dark:focus:border-slate-400
              "
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950/40 dark:text-green-400">
              Message sent successfully! I’ll get back to you soon.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-md px-4 py-2.5 text-sm font-medium transition
              bg-black text-white hover:bg-slate-800
              disabled:cursor-not-allowed disabled:bg-slate-400
              dark:bg-slate-100 dark:text-black dark:hover:bg-slate-300
            "
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          You can also send e-mail to{" "}
          <span className="font-medium">{mail}</span>
        </p>
      </div>
    </section>
  );
}
