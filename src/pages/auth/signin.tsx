"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import SignupTestimonial from "~/components/SignupTestimonial";
import { Loader2 } from "lucide-react";
import LabeledInput from "~/components/LabeledInput";
import OrSpan from "~/components/OrSpan";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      await router.push("/app/projects");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-8 py-12 md:px-12 lg:px-16">
        <div className="w-full max-w-[340px] space-y-8">
          {/* Need to put logo and place at courner */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16V8M8 12h8" />
              </svg>
            </div>
            <span className="text-xl font-semibold">Project managment</span>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center space-x-2"
                onClick={async () => {
                  await signIn("github", { callbackUrl: "/app/projects" });
                }}
              >
                <Image
                  alt="github"
                  height="20"
                  width="20"
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/github.svg"
                />
                <span>Log in with Github</span>
              </Button>
              {/* or span */}
              <OrSpan />

              <div className="space-y-4">
                <LabeledInput
                  label="email"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <LabeledInput
                  label="Password"
                  id="Password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                {error && <p className="text-destructive">{error}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm">
                    Remember for 30 days
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm hover:underline"
                >
                  Forgot password
                </Link>
              </div>

              <Button className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Log in"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {`Don't have an account?`}
                <Link
                  href="/auth/signup"
                  className="pl-2 font-medium text-foreground hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Testimonial */}
      <SignupTestimonial />
    </div>
  );
}
