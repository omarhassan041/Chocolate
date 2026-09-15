"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ShoppingBag, Truck, Store } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    deliveryType: "delivery" as "delivery" | "pickup",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
  })
  const [error, setError] = useState("")

  const deliveryFee = form.deliveryType === "delivery" ? 5 : 0
  const grandTotal = total + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (items.length === 0) {
      setError("Cart-kaagu waa madhan")
      return
    }

    if (!form.name || !form.phone) {
      setError("Magaca iyo telefoonka waa muhiim")
      return
    }

    if (form.deliveryType === "delivery" && !form.address) {
      setError("Cinwaanka waa muhiim haddii aad dooratay gaarsiinta")
      return
    }

    setLoading(true)

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          items,
          delivery: {
            type: form.deliveryType,
            address: form.address,
            city: form.city,
            date: form.date,
            time: form.time,
            notes: form.notes,
          },
          total: grandTotal,
        }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Order-ku wuu fashilmay")
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: orderData.order?.id || `ORD-${Date.now()}`,
            customer: {
              name: form.name,
              email: form.email,
              phone: form.phone,
            },
            total: grandTotal,
          })
        )
      }

      clearCart()
      router.push("/payment")
    } catch (err: any) {
      setError(err.message || "Khalad baa dhacay")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-2">Cart-kaagu waa madhan</h1>
        <p className="text-muted-foreground mb-6">
          Ku dar alaab si aad u sii gudubto checkout-ka
        </p>
        <Link href="/products">
          <Button>Tag Alaabta</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Ku noqo Cart-ka
      </Link>

      <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Macluumaadkaaga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Magaca *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Magacaaga oo buuxa"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefoonka *</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+252 61 XXX XXXX"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email (ikhtiyaari)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Habka Gaarsiinta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, deliveryType: "delivery" })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      form.deliveryType === "delivery"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Truck className="h-5 w-5 mb-2 text-primary" />
                    <p className="font-semibold">Gaarsiin</p>
                    <p className="text-xs text-muted-foreground">+$5.00</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, deliveryType: "pickup" })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      form.deliveryType === "pickup"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Store className="h-5 w-5 mb-2 text-primary" />
                    <p className="font-semibold">Soo qaadasho</p>
                    <p className="text-xs text-muted-foreground">Bilaash</p>
                  </button>
                </div>

                {form.deliveryType === "delivery" && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Cinwaanka *</Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Tusaale: Hodan District, Waddada..."
                        required={form.deliveryType === "delivery"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Magaalada</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Muqdisho"
                      />
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Taariikhda</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Waqtiga</Label>
                    <Input
                      id="time"
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Fariin (ikhtiyaari)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Wax kasta oo aad rabto inaad nala socodsii"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Dalabkaaga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wadarta</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gaarsiinta</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold">Lacagta Guud</span>
                  <span className="font-bold text-primary text-lg">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Waa la dirayaa..." : "Sii wad Lacag-bixinta"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Marka aad riixdo, waxaa laguu gudbin doonaa bogga lacag-bixinta
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}