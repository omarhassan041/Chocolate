import Link from "next/link"
import { Calendar, TrendingUp, Zap, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const features = [
    {
      title: "Schedule",
      description: "Plan your weekly learning schedule",
      icon: Calendar,
      href: "/schedule",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Progress",
      description: "Track your learning progress",
      icon: TrendingUp,
      href: "/progress",
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Skills",
      description: "Manage and rate your skills",
      icon: Zap,
      href: "/skills",
      color: "bg-orange-500/10 text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Learning Tracker</h1>
              <p className="text-sm text-muted-foreground">Track your learning journey</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">Master Your Learning Journey</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Organize your schedule, track your progress, and build your skills with our comprehensive learning tracker.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 p-0 text-primary">
                    Get Started
                    <span aria-hidden="true">→</span>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <p className="text-4xl font-bold text-primary">7</p>
              <p className="text-sm text-muted-foreground">Days a Week</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">∞</p>
              <p className="text-sm text-muted-foreground">Skills to Learn</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Your Progress</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
