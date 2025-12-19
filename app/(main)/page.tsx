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
      <section className="relative bg-secondary py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">
                Welcome to Sweet Delights
              </span>
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Handcrafted Cakes Made with Love
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Discover our collection of artisan cakes and pastries, baked fresh daily using the finest ingredients.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <Image
                  src="/beautiful-decorated-cake-with-flowers.jpg"
                  alt="Featured cake"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
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
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Made with Love", desc: "Every cake crafted with passion" },
              { icon: Award, title: "Premium Quality", desc: "Only the finest ingredients" },
              { icon: Truck, title: "Fast Delivery", desc: "Same-day delivery available" },
              { icon: Clock, title: "Fresh Daily", desc: "Baked fresh every morning" },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium tracking-wide uppercase text-sm">Our Specialties</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-2">Featured Cakes</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Discover our most loved creations, perfect for any celebration
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Custom Cakes for Your Special Day
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Have a special occasion? Let us create a custom cake that perfectly matches your vision. Contact us today to
            discuss your dream cake.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="gap-2">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
