"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Truck, Store, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DeliveryPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const deliveryFee = deliveryType === "delivery" ? 5.99 : 0
  const finalTotal = total + deliveryFee

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const orderData = {
      items,
      customer: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      },
      delivery: {
        type: deliveryType,
        address: formData.get("address"),
        city: formData.get("city"),
        zipCode: formData.get("zipCode"),
        date: formData.get("date"),
        time: formData.get("time"),
        notes: formData.get("notes"),
      },
      total: finalTotal,
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart()
        router.push("/success")
      }
    } catch (error) {
      console.error("Order submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">No Items in Cart</h1>
          <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="font-serif text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" required placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required placeholder="Enter your email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" required placeholder="Enter your phone number" />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={deliveryType}
                    onValueChange={(v) => setDeliveryType(v as "delivery" | "pickup")}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="delivery"
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        deliveryType === "delivery"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Home Delivery</p>
                        <p className="text-sm text-muted-foreground">$5.99 delivery fee</p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="pickup"
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        deliveryType === "pickup"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Store className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Store Pickup</p>
                        <p className="text-sm text-muted-foreground">Free</p>
                      </div>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {deliveryType === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" name="address" required placeholder="Enter your street address" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" required placeholder="Enter your city" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" name="zipCode" required placeholder="Enter your ZIP code" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">
                    {deliveryType === "delivery" ? "Delivery" : "Pickup"} Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" name="date" type="date" required min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" name="time" type="time" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Enter any  special instructions for your order..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-serif">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "Free"}</span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Place Order"} <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By placing this order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
