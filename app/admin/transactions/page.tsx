"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  FileDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import {
  exportTransactionsToExcel,
  exportTransactionsToCSV,
  exportTransactionsToPDF,
} from "@/lib/export-utils"

type Transaction = {
  id: string
  serviceType: string
  channel: string
  status: string
  reference: string
  amount: number
  fee: number
  balance: number
  customerName: string | null
  customerNumber: string | null
  customerEmail: string | null
  notes: string | null
  paymentMethod: string | null
  orderId: string | null
  createdAt: string
}

export default function TransactionsPage() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    fetchTransactions()
  }, [isAuthenticated, router])

  const fetchTransactions = () => {
    setLoading(true)
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      )
    } catch (error) {
      console.error("Failed to update:", error)
    }
  }

  const totalTransactions = transactions.length
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  const cashinCount = transactions.filter((t) => t.serviceType === "CASHIN").length
  const cashoutCount = transactions.filter((t) => t.serviceType === "CASHOUT").length
  const completedCount = transactions.filter((t) => t.status === "completed").length

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.status === filter)

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-foreground block">
                Transactions
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">
                TOTAL TRANSACTIONS
              </p>
              <p className="text-2xl font-bold text-foreground">
                {totalTransactions}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">
                TOTAL AMOUNT
              </p>
              <p className="text-2xl font-bold text-foreground">
                ${totalAmount.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <p className="text-xs text-muted-foreground">CASHOUT</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {cashoutCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <p className="text-xs text-muted-foreground">CASHIN</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {cashinCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">
                CONFIRMED
              </p>
              <p className="text-2xl font-bold text-foreground">
                {completedCount}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="font-serif">Recent Transactions</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Transaction management • Search, filter and review recent activity
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={fetchTransactions}
                className="gap-1.5 bg-transparent"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
              {transactions.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 bg-transparent"
                    onClick={() => exportTransactionsToExcel(transactions)}
                  >
                    <FileSpreadsheet className="h-4 w-4" /> Excel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 bg-transparent"
                    onClick={() => exportTransactionsToCSV(transactions)}
                  >
                    <FileDown className="h-4 w-4" /> CSV
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 bg-transparent"
                    onClick={() => exportTransactionsToPDF(transactions)}
                  >
                    <FileText className="h-4 w-4" /> PDF
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4 flex-wrap">
              {["all", "completed", "pending", "failed", "cancelled"].map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f === "all" ? "All" : f}
                </Button>
              ))}
            </div>

            {loading ? (
              <p className="text-center py-12 text-muted-foreground">
                Waa la soo dejinayaa...
              </p>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-3">
                  Weli ma jiro transactions
                </p>
                <p className="text-xs text-muted-foreground">
                  Tijaabo Postman-ka si aad u darto
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr className="text-left">
                      <th className="px-3 py-3 font-semibold">#</th>
                      <th className="px-3 py-3 font-semibold">Transaction ID</th>
                      <th className="px-3 py-3 font-semibold">Service Type</th>
                      <th className="px-3 py-3 font-semibold">Channel</th>
                      <th className="px-3 py-3 font-semibold">Amount</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold">Reference</th>
                      <th className="px-3 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx, index) => (
                      <tr
                        key={tx.id}
                        className="border-t border-border hover:bg-secondary/30"
                      >
                        <td className="px-3 py-3 text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-3 py-3 font-mono text-xs">{tx.id}</td>
                        <td className="px-3 py-3">
                          <Badge
                            variant={
                              tx.serviceType === "CASHIN"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {tx.serviceType}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {tx.channel}
                        </td>
                        <td className="px-3 py-3 font-semibold">
                          ${tx.amount.toFixed(2)}
                        </td>
                        <td className="px-3 py-3">
                          <Badge
                            variant={
                              tx.status === "completed"
                                ? "default"
                                : tx.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          {tx.reference}
                        </td>
                        <td className="px-3 py-3">
                          {tx.status === "pending" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 bg-transparent"
                                onClick={() => updateStatus(tx.id, "completed")}
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 text-destructive bg-transparent"
                                onClick={() => updateStatus(tx.id, "cancelled")}
                              >
                                ✕
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}