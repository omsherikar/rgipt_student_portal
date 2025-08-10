"use client";
import { signIn } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const showVerifyAlert = searchParams.get("verify") === "1";

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
    if (submitted && successRef.current) {
      successRef.current.focus();
    }
  }, [error, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@rgipt.ac.in")) {
      setError("Please use your RGIPT email address.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(false);
    setLoading(true);
    await signIn("email", { email, callbackUrl: "/dashboard" });
    setLoading(false);
    setSubmitted(true);
  };

  // Animated dots loader
  const DotsLoader = () => (
    <span className="inline-block w-8 text-left" aria-label="Loading">
      <span className="animate-bounce inline-block w-2 h-2 bg-white rounded-full mr-1" style={{animationDelay: '0ms'}}></span>
      <span className="animate-bounce inline-block w-2 h-2 bg-white rounded-full mr-1" style={{animationDelay: '100ms'}}></span>
      <span className="animate-bounce inline-block w-2 h-2 bg-white rounded-full" style={{animationDelay: '200ms'}}></span>
    </span>
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md flex flex-col items-center" role="main" aria-label="Login form">
        {showVerifyAlert && (
          <div className="mb-4 w-full text-center bg-blue-100 text-blue-700 py-2 rounded">
            A sign-in link has been sent to your email address.
          </div>
        )}
        <div className="flex flex-col items-center w-full">
          <img src="/rgipt-logo.png" alt="RGIPT Logo" width={56} height={56} className="mb-4" />
          <h1 className="text-2xl font-bold mb-1 text-blue-700 text-center w-full">Welcome to RGIPT Student Portal</h1>
          <p className="text-gray-500 text-center mb-4 w-full">Sign in with your RGIPT email to continue</p>
          <div className="text-xs text-gray-400 mb-6 text-center w-full" aria-live="polite">Your email is only used for authentication. We never share your data.</div>
        </div>
        {submitted ? (
          <div
            ref={successRef}
            tabIndex={-1}
            className="text-green-600 text-center py-4 animate-fade-in w-full"
            aria-live="polite"
          >
            If your email is registered, you will receive a login link shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center" autoComplete="on">
            <div className="w-full">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                RGIPT Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="yourname@rgipt.ac.in"
                required
                autoFocus
                aria-label="RGIPT Email Address"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>
            {error && (
              <div
                ref={errorRef}
                id="error-message"
                tabIndex={-1}
                className="text-red-600 text-sm animate-shake w-full text-center"
                aria-live="assertive"
              >
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              disabled={loading}
              aria-busy={loading}
            >
              {loading && <DotsLoader />}
              {loading ? "Sending..." : "Send Login Link"}
            </button>
            <div className="flex flex-row justify-between items-center w-full mt-3 text-xs text-blue-600 gap-2">
              <a href="mailto:support@rgipt.ac.in" className="hover:underline focus:underline" tabIndex={0}>Contact support</a>
              <span className="mx-1 text-gray-300">|</span>
              <a href="#" className="hover:underline focus:underline" tabIndex={0}>Need help?</a>
            </div>
          </form>
        )}
      </div>
      <footer className="mt-8 text-gray-400 text-xs text-center space-y-1 w-full flex flex-col items-center">
        <div className="flex flex-row flex-wrap justify-center items-center gap-2">
          <a href="https://www.rgipt.ac.in" className="hover:underline focus:underline" tabIndex={0} target="_blank" rel="noopener noreferrer">RGIPT Website</a>
          <span className="mx-1 text-gray-300">|</span>
          <a href="/privacy-policy" className="hover:underline focus:underline" tabIndex={0}>Privacy Policy</a>
          <span className="mx-1 text-gray-300">|</span>
          <a href="/terms" className="hover:underline focus:underline" tabIndex={0}>Terms of Service</a>
        </div>
        <div className="mt-1">&copy; {new Date().getFullYear()} RGIPT Student Portal. All rights reserved.</div>
      </footer>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.3s;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(1); }
          40% { transform: scale(1.3); }
        }
      `}</style>
    </main>
  );
} 