"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageSquare,
  LogOut,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  FileSpreadsheet,
  FileDown,
} from "lucide-react"
import {
  exportToExcel,
  exportToCSV,
  exportToPDF,
  formatOrdersForExport,
  formatMessagesForExport,
} from "@/lib/export-utils"
import type { Order, ContactMessage } from "@/lib/types"
import { products } from "@/lib/data"

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))

    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]))
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: status as Order["status"] } : o
        )
      )
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const unreadMessages = messages.filter((m) => !m.read).length

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              View Store
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
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-foreground">
                  {pendingOrders}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Messages</p>
                <p className="text-2xl font-bold text-foreground">
                  {unreadMessages}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" /> Messages
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ========================= */}
          {/* ORDERS TAB */}
          {/* ========================= */}
          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                <CardTitle className="font-serif">Recent Orders</CardTitle>
                {orders.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() =>
                        exportToExcel(
                          formatOrdersForExport(orders),
                          "orders",
                          "Orders"
                        )
                      }
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() =>
                        exportToCSV(formatOrdersForExport(orders), "orders")
                      }
                    >
                      <FileDown className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() =>
                        exportToPDF(
                          formatOrdersForExport(orders),
                          "orders",
                          "Dhammaan Orders-ka MireChocolate"
                        )
                      }
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No orders yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-semibold text-foreground">
                              {order.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.customer.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.customer.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              ${order.total.toFixed(2)}
                            </p>
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : order.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          <p>
                            {order.delivery.type === "delivery"
                              ? "Delivery to:"
                              : "Pickup"}{" "}
                            {order.delivery.address &&
                              `${order.delivery.address}, ${order.delivery.city}`}
                          </p>
                          <p>
                            Date: {order.delivery.date} at {order.delivery.time}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 bg-transparent"
                            onClick={() =>
                              updateOrderStatus(order.id, "confirmed")
                            }
                            disabled={order.status !== "pending"}
                          >
                            <CheckCircle className="h-3 w-3" /> Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 bg-transparent"
                            onClick={() =>
                              updateOrderStatus(order.id, "preparing")
                            }
                            disabled={order.status !== "confirmed"}
                          >
                            <TrendingUp className="h-3 w-3" /> Preparing
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 bg-transparent"
                            onClick={() =>
                              updateOrderStatus(order.id, "delivered")
                            }
                            disabled={order.status !== "preparing"}
                          >
                            <Package className="h-3 w-3" /> Delivered
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-destructive hover:text-destructive bg-transparent"
                            onClick={() =>
                              updateOrderStatus(order.id, "cancelled")
                            }
                            disabled={
                              order.status === "delivered" ||
                              order.status === "cancelled"
                            }
                          >
                            <XCircle className="h-3 w-3" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================= */}
          {/* PRODUCTS TAB */}
          {/* ========================= */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          Product
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          Featured
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-border">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-secondary" />
                              <span className="font-medium text-foreground">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 capitalize text-muted-foreground">
                            {product.category}
                          </td>
                          <td className="py-3 px-2 text-foreground">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-2">
                            {product.featured && (
                              <Badge variant="secondary">Featured</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================= */}
          {/* MESSAGES TAB */}
          {/* ========================= */}
          <TabsContent value="messages">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                <CardTitle className="font-serif">Contact Messages</CardTitle>
                {messages.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() =>
                        exportToExcel(
                          formatMessagesForExport(messages),
                          "messages",
                          "Messages"
                        )
                      }
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() =>
                        exportToCSV(formatMessagesForExport(messages), "messages")
                      }
                    >
                      <FileDown className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() =>
                        exportToPDF(
                          formatMessagesForExport(messages),
                          "messages",
                          "Dhammaan Fariimaha MireChocolate"
                        )
                      }
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No messages yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="font-semibold text-foreground">
                              {message.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {message.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!message.read && (
                              <Badge variant="destructive">New</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                message.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="font-medium text-foreground mb-1">
                          {message.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}