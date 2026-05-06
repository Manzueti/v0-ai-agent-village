import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Code, Cpu, Globe, Layout, MessageSquare, Rocket, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Cpu className="h-6 w-6 mr-2" />
          <span className="font-bold">AI Agent Village</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Build Your AI Agent Village
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Deploy, manage, and scale a community of specialized AI agents working together to solve complex
                  problems.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-white text-black hover:bg-gray-200">Get Started</Button>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Rapid Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Launch specialized agents in seconds with our pre-configured templates.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Inter-Agent Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Enable seamless communication between agents to tackle multi-step workflows.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Layout className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Visual Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Monitor and manage your entire agent ecosystem from a single, intuitive interface.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Code className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Custom Logic</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Extend agent capabilities with custom tools and specialized knowledge bases.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AI Agent Village provides the infrastructure for autonomous collaboration.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Define agent roles and responsibilities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Connect agents to external tools and APIs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Orchestrate complex tasks across multiple agents</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-video bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                  <Globe className="h-20 w-20 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to start your village?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Join the future of collaborative AI and scale your operations like never before.
                </p>
              </div>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                <Rocket className="mr-2 h-4 w-4" /> Get Started Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 AI Agent Village. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
