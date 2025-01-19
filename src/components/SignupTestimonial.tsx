import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

const SignupTestimonial = () => {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 mix-blend-multiply" />
      <Image
        src={"/testimonial3.jpg"}
        alt="Background"
        className="h-screen w-full object-cover"
        height={1100}
        width={800}
        priority
      />
      <div className="absolute inset-0 flex items-end justify-center p-12">
        <div className="w-full max-w-xl space-y-8 text-white">
          <p className="text-3xl font-medium leading-relaxed">
            {`We move 10x faster than our peers and stay consistent. While
              they're bogged down with design debt, we're releasing new
              features.`}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">Sophie Hall</p>
              <p className="text-xs opacity-80">Founder, Catalog</p>
              <p className="text-xs opacity-60">Web Design Agency</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/20 bg-white/10 hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/20 bg-white/10 hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignupTestimonial;
