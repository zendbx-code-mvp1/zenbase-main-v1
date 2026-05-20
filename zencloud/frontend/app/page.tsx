import Link from "next/link";
import { 
  Rocket, 
  Zap, 
  Shield, 
  Database, 
  Globe, 
  BarChart3,
  ArrowRight,
  Check,
  Github,
  Terminal,
  Clock
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Rocket className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">ZenCloud</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
              <a href="#demo" className="text-gray-300 hover:text-white transition">Demo</a>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link 
                href="/signup" 
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition glow-orange"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8 hover-lift">
            <Terminal className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-gray-300 font-medium">Deploy in 30 Seconds</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Deploy Your Apps
            <br />
            <span className="gradient-text">In Minutes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Push Code → Deploy → Go Live. No DevOps complexity. No configuration hell. 
            <br className="hidden md:block" />
            Just connect GitHub and deploy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              href="/signup"
              className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-5 rounded-xl text-lg font-bold transition animate-glow flex items-center space-x-3 group"
            >
              <span>Start Building Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#demo"
              className="glass hover:bg-dark-800 text-white px-10 py-5 rounded-xl text-lg font-bold transition hover-lift flex items-center space-x-3"
            >
              <span>Watch Demo</span>
              <Zap className="w-5 h-5" />
            </a>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 mb-16">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>2 free projects forever</span>
            </div>
          </div>

          {/* Terminal Demo */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="glass rounded-2xl overflow-hidden hover-lift shadow-2xl">
              <div className="bg-dark-900 px-6 py-4 flex items-center space-x-3 border-b border-dark-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-400 font-mono ml-4">zencloud-terminal</span>
              </div>
              <div className="p-8 font-mono text-left text-sm bg-gradient-to-br from-dark-900 to-dark-950">
                <div className="text-gray-400 mb-2">
                  <span className="text-green-500">user@zencloud</span>
                  <span className="text-gray-500">:</span>
                  <span className="text-blue-500">~/projects</span>
                  <span className="text-gray-500">$</span> zencloud deploy
                </div>
                <div className="text-primary-500 mt-3 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span>Detecting framework... Next.js detected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Rocket className="w-4 h-4" />
                    <span>Building application...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Deploying to production...</span>
                  </div>
                </div>
                <div className="text-green-500 mt-4 flex items-center space-x-2 font-bold">
                  <Check className="w-5 h-5" />
                  <span>✓ Deployed to https://my-app.zencloud.dev</span>
                </div>
                <div className="mt-4 text-gray-500 text-xs">
                  Build completed in 2.3s • Deploy time: 4.1s
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm mb-8">TRUSTED BY DEVELOPERS WORLDWIDE</p>
          <div className="flex items-center justify-center space-x-12 text-gray-600">
            <div className="text-2xl font-bold">10,000+</div>
            <div className="text-2xl font-bold">50,000+</div>
            <div className="text-2xl font-bold">99.9%</div>
          </div>
          <div className="flex items-center justify-center space-x-12 text-gray-500 text-sm mt-2">
            <div>Projects</div>
            <div>Deployments</div>
            <div>Uptime</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Get Started In 3 Simple Steps</h2>
            <p className="text-gray-400 text-xl">No complex setup. No configuration. Just build.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Github,
                title: "Connect GitHub",
                description: "Link your GitHub account and select the repository you want to deploy.",
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "2",
                icon: Zap,
                title: "Auto Deploy",
                description: "We detect your framework and automatically build and deploy your application.",
                color: "from-primary-500 to-yellow-500"
              },
              {
                step: "3",
                icon: Globe,
                title: "Go Live",
                description: "Your app is live with HTTPS, custom domain support, and automatic scaling.",
                color: "from-green-500 to-emerald-500"
              }
            ].map((item) => (
              <div key={item.step} className="glass rounded-2xl p-8 hover:border-primary-500/50 transition hover-lift relative overflow-hidden group">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-primary-500 font-bold text-lg mb-3">Step {item.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-dark-900/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Everything You Need Built-In</h2>
            <p className="text-gray-400 text-xl">Complete deployment platform with all the features you need</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Rocket,
                title: "Instant Deployments",
                description: "Deploy from GitHub with automatic framework detection and zero configuration.",
                gradient: "from-primary-500 to-orange-600"
              },
              {
                icon: Shield,
                title: "SSL by Default",
                description: "Automatic HTTPS certificates with Let's Encrypt. Secure from day one.",
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: Database,
                title: "Managed Databases",
                description: "PostgreSQL, MySQL, MongoDB with automated backups and monitoring.",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                icon: Globe,
                title: "Custom Domains",
                description: "Connect your own domain with automatic SSL certificate generation.",
                gradient: "from-purple-500 to-pink-600"
              },
              {
                icon: BarChart3,
                title: "Real-time Monitoring",
                description: "Track CPU, RAM, and application metrics with live dashboards.",
                gradient: "from-yellow-500 to-orange-600"
              },
              {
                icon: Clock,
                title: "Auto Scaling",
                description: "Automatically scale your application based on traffic and load.",
                gradient: "from-indigo-500 to-purple-600"
              }
            ].map((feature, index) => (
              <div key={index} className="glass rounded-2xl p-8 hover:border-primary-500/50 transition hover-lift group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-xl">Start free, upgrade as you grow. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for trying out ZenCloud",
                features: [
                  "2 projects",
                  "1 GB storage per project",
                  "Community support",
                  "All core features",
                  "API access"
                ],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Pro",
                price: "$29",
                description: "For professionals and small teams",
                features: [
                  "Unlimited projects",
                  "10 GB storage per project",
                  "Priority support",
                  "Advanced features",
                  "Custom domains",
                  "Team collaboration",
                  "API rate limits: 10k/day"
                ],
                cta: "Start Pro Trial",
                popular: true
              },
              {
                name: "Team",
                price: "$99",
                description: "For growing teams",
                features: [
                  "Everything in Pro",
                  "100 GB storage per project",
                  "Dedicated support",
                  "SSO authentication",
                  "Advanced RBAC",
                  "Audit logs",
                  "API rate limits: 100k/day",
                  "SLA guarantee"
                ],
                cta: "Start Team Trial",
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`glass rounded-2xl p-8 hover-lift relative ${
                  plan.popular 
                    ? 'border-2 border-primary-500 shadow-2xl scale-105' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg glow-orange-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-6xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-lg">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block w-full text-center py-4 rounded-xl font-bold transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-orange-600 hover:from-primary-600 hover:to-orange-700 text-white shadow-lg glow-orange-sm'
                      : 'glass hover:bg-dark-800 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Deploy
            <br />
            <span className="gradient-text">Your App?</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12">
            Start building in 30 seconds. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-orange-600 hover:from-primary-600 hover:to-orange-700 text-white px-12 py-6 rounded-xl text-xl font-bold transition shadow-2xl animate-glow group"
          >
            <span>Start Building Free</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <div className="mt-8 flex items-center justify-center flex-wrap gap-6 text-sm text-gray-400">
            <span className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>2 free projects forever</span>
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>30 second setup</span>
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Rocket className="w-6 h-6 text-primary-500" />
                <span className="text-xl font-bold text-white">ZenCloud</span>
              </div>
              <p className="text-gray-400 text-sm">
                Deploy your apps in minutes. No DevOps complexity.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white transition">Demo</a></li>
                <li><a href="#" className="hover:text-white transition">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2026 ZenCloud. All rights reserved.</p>
            <div className="flex space-x-6 text-gray-400 text-sm mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
