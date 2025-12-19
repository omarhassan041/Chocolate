import { NextResponse } from "next/server"

// In-memory storage for orders (in production, use a database)
const orders: any[] = []

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    const order = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(order)

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ orders })
}
