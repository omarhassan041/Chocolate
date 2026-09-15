"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PAYMENT_METHODS, BUSINESS_NAME } from "@/lib/payment-methods"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Phone,
  AlertCircle,
} from "lucide-react"

type PendingOrder = {
  orderId: string
  customer: {
    name: string
    email: string
    phone: string
  }
  total: number
}

export default function PaymentPage() {
  const router = useRouter()
  const [order, setOrder] = useState<PendingOrder | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [txnId, setTxnId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = sessionStorage.getItem("pendingOrder")
    if (!stored) {
      router.push("/checkout")
      return
    }
    try {
      setOrder(JSON.parse(stored))
    } catch {
      router.push("/checkout")
    }
  }, [router])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Silent fail
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedMethod) {
      setError("Fadlan dooro habka lacag-bixinta")
      return
    }

    if (!txnId.trim()) {
      setError("Fadlan geli Transaction ID-ga aad ka heshay lacagta dirista")
      return
    }

    if (!order) return

    setLoading(true)

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          customerName: order.customer.name,
          customerPhone: order.customer.phone,
          customerEmail: order.customer.email,
          paymentMethod: selectedMethod,
          amount: order.total,
          txnId: txnId.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Khalad baa dhacay")
      }

      // Clear pending order
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pendingOrder")
      }

      // Redirect to success
      router.push(`/success?order=${order.orderId}&payment=pending`)
    } catch (err: any) {
      setError(err.message || "Khalad baa dhacay")
    } finally {
      setLoading(false)
    }
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Waa la soo dejinayaa...</p>
      </div>
    )
  }

  const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/checkout"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Ku noqo Checkout-ka
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-700 text-sm mb-4">
          <Clock className="h-4 w-4" />
          Sugaya lacag-bixinta
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">Lacag-bixinta</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Fadlan raac tilmaamaha hoos ku qoran si aad u dhammaystirto dalabkaaga
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Dalabkaaga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-medium">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Magaca</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefoonka</span>
                <span className="font-medium">{order.customer.phone}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold">Lacagta Guud</span>
                <span className="font-bold text-primary text-lg">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Step 1 — Choose method */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  1
                </span>
                Dooro Habka Lacag-bixinta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedMethod === m.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.ussd && `USSD: ${m.ussd}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 2 — Send money */}
          {method && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    2
                  </span>
                  Lacagta Dir
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-2">
                    Lambarka {method.name}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-lg font-bold text-primary">
                      {method.number}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(method.number, "number")}
                      className="gap-1.5"
                    >
                      {copied === "number" ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> La koobiyay
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Koobi
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Lacagta
                  </p>
                  <p className="font-mono text-2xl font-bold">
                    ${order.total.toFixed(2)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 space-y-2 text-sm">
                  <div className="flex items-center gap-2 font-semibold">
                    <Phone className="h-4 w-4" />
                    Tallaabooyinka
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Fur app-ka {method.name} taleefankaaga</li>
                    <li>Dooro "Send Money" ama "Lacag Dir"</li>
                    <li>Geli lambarka: <strong>{method.number}</strong></li>
                    <li>Geli lacagta: <strong>${order.total.toFixed(2)}</strong></li>
                    <li>Ku qor Order ID: <strong>{order.orderId}</strong></li>
                    <li>Xaqiiji lacagta dirista</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3 — Enter TXN ID */}
          {method && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    3
                  </span>
                  Geli Transaction ID-ga
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="txnId">
                    Transaction ID (lambarka aad ka heshay {method.name})
                  </Label>
                  <Input
                    id="txnId"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="Tusaale: 1234567890"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Waxaa lagu arki kartaa fariinta {method.name} ee taleefankaaga
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !txnId.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Waa la xaqiijinayaa..." : "Xaqiiji Lacag-bixinta"}
                </Button>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                  <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Lacagtaada waa la xaqiijin doonaa gacan ahaan. Marka la
                    xaqiijiyo, waxaan kula soo xiriiri doonaa telefoonka.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Help */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Caawimaad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                Haddii aad dhibaato kala kulanto lacag-bixinta, fadlan nala soo
                xiriir:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-mono">+252 61 7400 796</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong>Muhiim:</strong> Ha isticmaalin lacag-bixin toos ah
                  oo aan la xaqiijin. {BUSINESS_NAME} ma aqbali doonto lacag
                  aan la helin Transaction ID sax ah.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}