import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { 
  Rocket, 
  Check, 
  X, 
  AlertCircle,
  Loader2,
  Github,
  Database,
  Globe
} from "lucide-react";

export default function ComponentsDemo() {
  return (
    <div className="min-h-screen bg-dark-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Component Showcase</h1>
          <p className="text-gray-400">Preview of all ZenCloud UI components</p>
        </div>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Buttons</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Primary Buttons</CardTitle>
                <CardDescription>Main action buttons with orange glow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" size="lg" className="w-full">
                    Large Primary
                  </Button>
                  <Button variant="primary" size="md" className="w-full">
                    Medium Primary
                  </Button>
                  <Button variant="primary" size="sm" className="w-full">
                    Small Primary
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secondary Buttons</CardTitle>
                <CardDescription>Alternative actions with glass effect</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="secondary" size="lg" className="w-full">
                    Large Secondary
                  </Button>
                  <Button variant="secondary" size="md" className="w-full">
                    Medium Secondary
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    Small Secondary
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ghost Buttons</CardTitle>
                <CardDescription>Subtle actions without background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" size="lg" className="w-full">
                    Large Ghost
                  </Button>
                  <Button variant="ghost" size="md" className="w-full">
                    Medium Ghost
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    Small Ghost
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>Standard card with glass effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  This is a basic card component with glassmorphism background and rounded corners.
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader>
                <CardTitle>Hover Card</CardTitle>
                <CardDescription>Card with hover effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Hover over this card to see the orange border effect.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary-500/10 border-primary-500/50">
              <CardHeader>
                <CardTitle>Highlighted Card</CardTitle>
                <CardDescription>Card with custom styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  This card has custom background and border colors.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Status Badges */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Status Badges</h2>
          <Card>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500 border border-green-500/20 flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Running</span>
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Building</span>
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500 border border-red-500/20 flex items-center space-x-2">
                  <X className="w-4 h-4" />
                  <span>Failed</span>
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Pending</span>
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                  Stopped
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Icons</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Rocket, label: "Rocket", color: "text-primary-500" },
              { icon: Github, label: "GitHub", color: "text-white" },
              { icon: Database, label: "Database", color: "text-blue-500" },
              { icon: Globe, label: "Globe", color: "text-green-500" }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent>
                  <div className={`w-16 h-16 mx-auto mb-4 ${item.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <p className="text-white font-medium">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Form Elements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Form Elements</h2>
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text Input
                  </label>
                  <input
                    type="text"
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
                    placeholder="Enter text..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Textarea
                  </label>
                  <textarea
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
                    placeholder="Enter description..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 bg-dark-800 border-dark-700 rounded text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-gray-300">Checkbox option</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="radio"
                      className="w-5 h-5 bg-dark-800 border-dark-700 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-gray-300">Radio option</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Color Palette</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Primary Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-500 rounded-lg"></div>
                    <div>
                      <p className="text-white font-medium">Primary Orange</p>
                      <p className="text-gray-400 text-sm">#FF6B35</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg"></div>
                    <div>
                      <p className="text-white font-medium">Primary Hover</p>
                      <p className="text-gray-400 text-sm">#ea580c</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Background Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-dark-950 rounded-lg border border-dark-700"></div>
                    <div>
                      <p className="text-white font-medium">Background</p>
                      <p className="text-gray-400 text-sm">#0A0A0A</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-dark-900 rounded-lg border border-dark-700"></div>
                    <div>
                      <p className="text-white font-medium">Surface</p>
                      <p className="text-gray-400 text-sm">#121212</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-dark-800 rounded-lg border border-dark-700"></div>
                    <div>
                      <p className="text-white font-medium">Card</p>
                      <p className="text-gray-400 text-sm">#1E1E1E</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
