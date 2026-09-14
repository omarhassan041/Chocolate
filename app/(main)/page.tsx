import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"
import { ArrowRight, Truck, Award, Clock, Heart } from "lucide-react"

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary to-accent/20 py-20 lg:py-32 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-primary font-medium tracking-wider uppercase text-sm bg-primary/10 px-4 py-1.5 rounded-full w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Welcome to MireChocolate
              </span>
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Handcrafted Cakes Made with{" "}
                <span className="text-primary italic">Love</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                Discover our collection of artisan cakes and pastries, baked
                fresh daily using the finest ingredients.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="gap-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                  >
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Fresh Daily
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Award Winning
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Decorative ring */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/20 blur-2xl" />
                <Image
                  src="/beautiful-decorated-cake-with-flowers.jpg"
                  alt="Featured cake"
                  fill
                  className="relative object-cover rounded-3xl shadow-2xl shadow-primary/20 ring-1 ring-border/50"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl shadow-primary/10 border border-border/50 hidden lg:block backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20">
                    <Award className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Award Winning</p>
                    <p className="text-sm text-muted-foreground">Best Bakery 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Heart, title: "Made with Love", desc: "Every cake crafted with passion" },
              { icon: Award, title: "Premium Quality", desc: "Only the finest ingredients" },
              { icon: Truck, title: "Fast Delivery", desc: "Same-day delivery available" },
              { icon: Clock, title: "Fresh Daily", desc: "Baked fresh every morning" },
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl hover:bg-secondary/50 transition-all duration-300 group"
              >
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-medium tracking-wider uppercase text-sm bg-primary/10 px-4 py-1.5 rounded-full mb-3">
              Our Specialties
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-2 relative inline-block">
              Featured Cakes
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
            </h2>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              Discover our most loved creations, perfect for any celebration
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="transition-all duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 max-w-3xl mx-auto leading-tight">
            Custom Cakes for Your{" "}
            <span className="text-accent italic">Special Day</span>
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Have a special occasion? Let us create a custom cake that perfectly
            matches your vision. Contact us today to discuss your dream cake.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}