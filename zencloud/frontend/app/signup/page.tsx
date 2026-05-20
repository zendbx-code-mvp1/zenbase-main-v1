import Link from "next/link";
import { Rocket, Github, Check } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden md:block">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Deploying in
            <span className="text-primary-500"> 30 Seconds</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of developers who trust ZenCloud for their deployments
          </p>

          <div className="space-y-4">
            {[
              "Deploy from GitHub with one click",
              "Automatic SSL certificates",
              "Real-time logs and monitoring",
              "Custom domains support",
              "Zero DevOps complexity",
              "2 free projects forever"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-500" />
                </div>
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 glass rounded-lg p-4">
            <p className="text-gray-400 text-sm italic">
              "ZenCloud made deployment so simple. I went from code to production in under 5 minutes!"
            </p>
            <p className="text-gray-500 text-xs mt-2">— Sarah M., Full Stack Developer</p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div>
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8 md:hidden">
            <Rocket className="w-10 h-10 text-primary-500" />
            <span className="text-3xl font-bold text-white">ZenCloud</span>
          </Link>

          <div className="glass rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 mb-8">Get started with ZenCloud for free</p>

            {/* GitHub Signup */}
            <button className="w-full bg-white hover:bg-gray-100 text-dark-950 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-3 mb-4">
              <Github className="w-5 h-5" />
              <span>Sign up with GitHub</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-900 text-gray-400">Or sign up with email</span>
              </div>
            </div>

            {/* Signup Form */}
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 bg-dark-800 border-dark-700 rounded text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                  I agree to the{" "}
                  <a href="#" className="text-primary-500 hover:text-primary-400 transition">
                    Terms of Service
                  </a>
                  {" "}and{" "}
                  <a href="#" className="text-primary-500 hover:text-primary-400 transition">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition glow-orange"
              >
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-500 hover:text-primary-400 font-semibold transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
