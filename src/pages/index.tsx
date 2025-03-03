import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="container mx-auto flex h-16 items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
            <span className="text-white">K</span>
          </div>
          <span className="font-semibold text-gray-800">Klaboard</span>
        </div>
        <nav className="hidden space-x-6 md:flex">
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Product
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Resources
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Download
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Support
          </Link>
        </nav>
        <div>
          <Link
            href="#"
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
          See Why You&apos;ll Love <br />
          <span className="text-purple-600">Working With Klaboard</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-gray-600">
          A powerful project management tool designed to boost your team&apos;s
          productivity and streamline your workflow with unparalleled
          efficiency.
        </p>
        <button className="rounded-md bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
          Get started free
        </button>

        {/* Workflow Visualization */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative">
            {/* Task cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Left card */}
              <div className="col-span-1">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 text-xs text-gray-500">May 12, 2023</div>
                  <div className="mb-2 text-sm font-medium">
                    Update Employee Portal
                  </div>
                  <div className="text-xs text-gray-500">
                    Assigned to John Smith
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-1 text-xs">2/3</span>
                      <div className="h-1 w-16 rounded bg-gray-200">
                        <div className="h-1 w-10 rounded bg-green-500"></div>
                      </div>
                    </div>
                    <div className="flex -space-x-1">
                      <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle card */}
              <div className="col-span-1 mt-12">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 text-xs text-gray-500">May 15, 2023</div>
                  <div className="mb-2 text-sm font-medium">
                    Customer Data Migration
                  </div>
                  <div className="text-xs text-gray-500">
                    Assigned to Team Alpha
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-1 text-xs">1/3</span>
                      <div className="h-1 w-16 rounded bg-gray-200">
                        <div className="h-1 w-5 rounded bg-green-500"></div>
                      </div>
                    </div>
                    <div className="flex -space-x-1">
                      <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right card */}
              <div className="col-span-1">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 text-xs text-gray-500">May 20, 2023</div>
                  <div className="mb-2 text-sm font-medium">
                    Prepare for Quarterly Review
                  </div>
                  <div className="text-xs text-gray-500">
                    Assigned to Marketing Team
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-1 text-xs">0/3</span>
                      <div className="h-1 w-16 rounded bg-gray-200">
                        <div className="h-1 w-0 rounded bg-green-500"></div>
                      </div>
                    </div>
                    <div className="flex -space-x-1">
                      <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection lines */}
            <svg
              className="absolute left-0 top-0 h-full w-full"
              style={{ zIndex: -1 }}
              viewBox="0 0 800 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M200 100 L400 150 L600 100"
                stroke="#d8b4fe"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* From Planning to Completion Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              From Planning <br />
              to Completion, <br />
              We&apos;ve Got You!
            </h2>
            <p className="mb-6 text-gray-600">
              Klaboard provides comprehensive project management solutions that
              help teams collaborate effectively and deliver projects on time,
              every time.
            </p>
            <div className="mb-6 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="font-medium text-gray-800">Customer Score</p>
          </div>
          <div className="mt-8 md:mt-0 md:w-1/2">
            <div className="relative rounded-lg bg-gray-50 p-6">
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                    fill="#9333ea"
                  />
                </svg>
              </div>
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-full bg-purple-100 text-center leading-10 text-purple-600">
                  <span>✓</span>
                </div>
                <div>
                  <p className="font-medium">100% Task Sync</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovative Solutions Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Innovative Solutions for <br />
          Modern Conversations
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-gray-600">
          Klaboard brings your team&apos;s communication and project management
          into one seamless platform.
        </p>
        <button className="mb-16 rounded-md bg-gray-100 px-6 py-3 text-gray-800 hover:bg-gray-200">
          See all features
        </button>

        {/* Product Screenshot */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-lg">
          <Image
            src="/placeholder.svg?height=600&width=1000"
            alt="Klaboard Interface"
            width={1000}
            height={600}
            className="w-full"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"
                  fill="#9333ea"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">
              Improved Task Organization
            </h3>
            <p className="text-gray-600">
              Our intelligent task management system helps you prioritize work
              and meet deadlines with ease, ensuring nothing falls through the
              cracks.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 7h-2V8h2v2zm0 4h-2v-2h2v2zm-6-4h2v2H6v-2zm0 4h2v2H6v-2zm10 4h-6v-2h6v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z"
                  fill="#9333ea"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">User-Friendly Interface</h3>
            <p className="text-gray-600">
              Designed to reduce clutter, our intuitive interface helps teams
              focus on what matters most, increasing productivity and reducing
              onboarding time.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.44 15L9 12.5l1.5-1.5 3.06 3.06 4.94-4.94L20 10.62 13.56 18z"
                  fill="#9333ea"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Increased Productivity</h3>
            <p className="text-gray-600">
              Streamline your workflow with our built-in automation tools and
              integrations that save time and help your team accomplish more in
              less time.
            </p>
          </div>
        </div>
      </section>

      {/* Unmatched Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          Unmatched Features, <br />
          Unbeatable Performance
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
          Endless versatile design, intuitive task management systems.
        </p>

        {/* Dashboard Customization */}
        <div className="mb-16">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-lg">
            <Image
              src="/placeholder.svg?height=500&width=1000"
              alt="Dashboard Customization"
              width={1000}
              height={500}
              className="w-full"
            />
          </div>
          <div className="mt-8">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              The Ability To <br />
              Customize Dashboard
            </h3>
            <p className="mb-4 max-w-2xl text-gray-600">
              Tailor your workspace to your specific needs with our highly
              customizable dashboard that adapts to your workflow.
            </p>
            <button className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700">
              Learn More
            </button>
          </div>
        </div>

        {/* File Sharing and Tracking Progress */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex">
              <div className="h-12 w-12 rounded-full bg-blue-400"></div>
              <div className="-ml-4 h-12 w-12 rounded-full bg-yellow-400"></div>
              <div className="-ml-4 h-12 w-12 rounded-full bg-green-400"></div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              File Sharing And <br />
              Integration
            </h3>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Tracking The Progress <br />
              Of The Project
            </h3>
            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 text-xs text-gray-500">May 21, 2023</div>
              <div className="mb-2 text-sm font-medium">
                Team Employee Database 2023
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-3/4 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          Experience the Joy of <br />
          Effortless Collaboration
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-gray-600">
          Join thousands of teams who have revolutionized their work with
          Klaboard.
        </p>
        <button className="rounded-md bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
          Get Started Now
        </button>

        <div className="mt-16 relative">
          <div className="flex justify-center">
            <div className="relative">
              {/* Avatar circles positioned around a center */}
              <div className="absolute -left-32 top-0">
                <div className="h-12 w-12 rounded-full bg-yellow-200"></div>
              </div>
              <div className="absolute -right-32 top-0">
                <div className="h-12 w-12 rounded-full bg-blue-200"></div>
              </div>
              <div className="absolute -left-16 -top-16">
                <div className="h-12 w-12 rounded-full bg-green-200"></div>
              </div>
              <div className="absolute -right-16 -top-16">
                <div className="h-12 w-12 rounded-full bg-red-200"></div>
              </div>
              <div className="absolute -left-16 -bottom-16">
                <div className="h-12 w-12 rounded-full bg-purple-200"></div>
              </div>
              <div className="absolute -right-16 -bottom-16">
                <div className="h-12 w-12 rounded-full bg-indigo-200"></div>
              </div>

              {/* Center circle */}
              <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xl">K</span>
              </div>

              {/* Connection lines */}
              <svg
                className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: -1, width: "300px", height: "300px" }}
                viewBox="0 0 300 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M150 150 L50 150 M150 150 L250 150 M150 150 L100 75 M150 150 L200 75 M150 150 L100 225 M150 150 L200 225"
                  stroke="#d8b4fe"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16">
        <div className="container mx-auto px-4">
          {/* Brand and Ratings */}
          <div className="mb-12 flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="flex items-center">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
                <span className="text-white">K</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">
                Klaboard
              </span>
            </div>
            <div className="flex space-x-8">
              <div>
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">Capterra</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center text-sm font-semibold">4.8/5</div>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">G2</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center text-sm font-semibold">4.7/5</div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div>
              <h3 className="mb-4 font-semibold text-gray-800">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-800">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-800">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Status
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-800">Social media</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-800">Download</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Windows
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    macOS
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Android
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    iOS
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Web
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Klaboard. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
