import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import LabeledInput from "~/components/LabeledInput";
import OrSpan from "~/components/OrSpan";
import SignupTestimonial from "~/components/SignupTestimonial";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { clientZodError, isTRPCClientError } from "~/utils/erros";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [githubLoading, setGithubLoading] = useState(false);

  const router = useRouter();
  const signupMutation = api.post.signup.useMutation({
    async onSuccess(data) {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password,
      });

      if (result?.ok) {
        await router.push("/app/dashboard");
        return;
      }
      if (result?.error) {
        setError(result?.error);
      }
    },
    onError(error) {
      if (isTRPCClientError(error)) {
        // Check if the error is a Zod error
        const errorMessages = clientZodError(error);
        setError(errorMessages ?? error.message); // Fallback to error.message if no Zod errors
      } else {
        // Handle non-TRPC errors
        setError("An unexpected error occurred.");
      }
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    signupMutation.mutate({ email, password, name });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-8 py-12 md:px-12 lg:px-16">
        <div className="w-full max-w-[340px] space-y-8">
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

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Get started by creating a new account.
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center space-x-2"
                disabled={githubLoading}
                onClick={async () => {
                  setGithubLoading(true);
                  await signIn("github", { callbackUrl: "/app/dashboard" });
                  setGithubLoading(false);
                }}
              >
                <Image
                  alt="github"
                  height="20"
                  width="20"
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/github.svg"
                />
                {githubLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span>Continue with Github</span>
                )}
              </Button>

              <OrSpan />

              <div className="space-y-4">
                <LabeledInput
                  label="name"
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
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
                {/* <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm">
                    Remember for 30 days
                  </label>
                </div> */}
                <Link
                  href="/forgot-password"
                  className="text-sm hover:underline"
                >
                  Forgot password
                </Link>
              </div>

              <Button className="w-full" disabled={signupMutation.isPending}>
                {signupMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {`Already have a account?`}
                <Link
                  href="/auth/signin"
                  className="pl-2 font-medium text-foreground hover:underline"
                >
                  Sign In
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
