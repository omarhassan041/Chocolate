"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Search,
} from "lucide-react"
import { PAYMENT_METHODS } from "@/lib/payment-methods"

type Payment = {
  id: string
  order_id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  payment_method: string
  payment_number: string
  amount: number
  txn_id: string | null
  status: string
  notes: string | null
  verified_at: string | null
  created_at: string
}

export default function AdminPaymentsPage() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [verifying, setVerifying] = useState<string | null>(null)
  const [txnInput, setTxnInput] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    fetchPayments()
  }, [isAuthenticated, router])

  const fetchPayments = () => {
    setLoading(true)
    fetch("/api/payment")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  const updateStatus = async (id: string, status: string, txnId?: string) => {
    setVerifying(id)
    try {
      await fetch("/api/payment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, txnId }),
      })
      setPayments((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status,
                txn_id: txnId || p.txn_id,
                verified_at:
                  status === "verified"
                    ? new Date().toISOString()
                    : p.verified_at,
              }
            : p
        )
      )
    } catch (error) {
      console.error("Failed to update:", error)
    } finally {
      setVerifying(null)
    }
  }

  const totalPayments = payments.length
  const totalAmount = payments
    .filter((p) => p.status === "verified")
    .reduce((sum, p) => sum + Number(p.amount), 0)
  const pendingCount = payments.filter(
    (p) => p.status === "pending" || p.status === "awaiting_payment"
  ).length
  const verifiedCount = payments.filter((p) => p.status === "verified").length

  const filteredPayments = payments
    .filter((p) => {
      if (filter === "all") return true
      if (filter === "pending")
        return p.status === "pending" || p.status === "awaiting_payment"
      if (filter === "verified") return p.status === "verified"
      if (filter === "failed")
        return p.status === "failed" || p.status === "cancelled"
      return true
    })
    .filter((p) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        p.order_id.toLowerCase().includes(q) ||
        p.customer_name.toLowerCase().includes(q) ||
        p.customer_phone.includes(q) ||
        (p.txn_id && p.txn_id.toLowerCase().includes(q))
      )
    })

  if (!isAuthenticated) return null

  const getMethodName = (id: string) => {
    return PAYMENT_METHODS.find((m) => m.id === id)?.name || id
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-foreground block">
                Payments
              </span>
              <span className="text-xs text-muted-foreground">
                MireChocolate Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-transparent"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">TOTAL VERIFIED</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${totalAmount.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">
                TOTAL PAYMENTS
              </p>
              <p className="text-2xl font-bold text-foreground">
                {totalPayments}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3 w-3 text-yellow-600" />
                <p className="text-xs text-muted-foreground">PENDING</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {pendingCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <p className="text-xs text-muted-foreground">VERIFIED</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {verifiedCount}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="font-serif">Payment Requests</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Xaqiiji lacagaha macmiilka
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchPayments}
              className="gap-1.5 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Raadi order ID, magac, telefoon, ama TXN ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: "all", label: "All" },
                  { id: "pending", label: "Pending" },
                  { id: "verified", label: "Verified" },
                  { id: "failed", label: "Failed" },
                ].map((f) => (
                  <Button
                    key={f.id}
                    size="sm"
                    variant={filter === f.id ? "default" : "outline"}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="text-center py-12 text-muted-foreground">
                Waa la soo dejinayaa...
              </p>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {search || filter !== "all"
                    ? "Ma jiro natiijo"
                    : "Weli ma jiro lacag-bixin"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayments.map((p) => (
                  <div
                    key={p.id}
                    className="border border-border rounded-xl p-4 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">
                          {p.order_id}
                        </p>
                        <p className="font-semibold">{p.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {p.customer_phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">
                          ${Number(p.amount).toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            p.status === "verified"
                              ? "default"
                              : p.status === "failed" ||
                                  p.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Habka Lacag-bixinta
                        </p>
                        <p className="font-medium">
                          {getMethodName(p.payment_method)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Lambarka
                        </p>
                        <p className="font-mono text-xs">{p.payment_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Transaction ID
                        </p>
                        <p className="font-mono text-xs">{p.txn_id || "—"}</p>
                      </div>
                    </div>

                    {(p.status === "pending" ||
                      p.status === "awaiting_payment") && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                        <Input
                          placeholder="Geli TXN ID haddii loo baahdo..."
                          value={txnInput[p.id] || ""}
                          onChange={(e) =>
                            setTxnInput({
                              ...txnInput,
                              [p.id]: e.target.value,
                            })
                          }
                          className="flex-1 min-w-[200px] font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(
                              p.id,
                              "verified",
                              txnInput[p.id] || undefined
                            )
                          }
                          disabled={verifying === p.id}
                          className="gap-1.5"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Xaqiiji
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(p.id, "failed")}
                          disabled={verifying === p.id}
                          className="gap-1.5"
                        >
                          <XCircle className="h-4 w-4" />
                          Diid
                        </Button>
                      </div>
                    )}

                    {p.status === "verified" && p.verified_at && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-green-600 flex items-center gap-1.5">
                          <CheckCircle className="h-3 w-3" />
                          La xaqiijiyay:{" "}
                          {new Date(p.verified_at).toLocaleString("so-SO")}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}