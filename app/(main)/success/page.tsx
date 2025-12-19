import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Package, Mail } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-12">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Thank you for your order! We&apos;ve received your request and will start preparing your delicious treats
              right away.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">Check your inbox for details</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                <Package className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Order Status</p>
                  <p className="text-sm text-muted-foreground">Track your order progress</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="gap-2 w-full sm:w-auto">
                  Continue Shopping <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
