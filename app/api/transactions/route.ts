import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// ============================================
// GET — Liiska transactions-ka
// ============================================
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    const transactions = (data || []).map((t) => ({
      id: t.id,
      serviceType: t.service_type,
      channel: t.channel,
      status: t.status,
      reference: t.reference,
      amount: Number(t.amount),
      fee: Number(t.fee),
      balance: Number(t.balance || 0),
      customerName: t.customer_name,
      customerNumber: t.customer_number,
      customerEmail: t.customer_email,
      notes: t.notes,
      paymentMethod: t.payment_method,
      orderId: t.order_id,
      createdAt: t.created_at,
    }))

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Transactions GET error:", error)
    return NextResponse.json({ transactions: [] }, { status: 500 })
  }
}

// ============================================
// POST — Samee transaction cusub
// ============================================
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const txId = `CO${Date.now()}${Math.floor(Math.random() * 1000)}`
    const reference = `REF-${String(Date.now()).slice(-5)}`

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          id: txId,
          service_type: body.serviceType || "CASHIN",
          channel: body.channel || "Wallet",
          status: body.status || "pending",
          reference,
          amount: body.amount || 0,
          fee: body.fee || 0,
          balance: body.balance || 0,
          customer_name: body.customerName || null,
          customer_number: body.customerNumber || null,
          customer_email: body.customerEmail || null,
          notes: body.notes || null,
          payment_method: body.paymentMethod || null,
          order_id: body.orderId || null,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, transaction: data },
      { status: 201 }
    )
  } catch (error) {
    console.error("Transactions POST error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create transaction" },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH — Update transaction status
// ============================================
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, transaction: data })
  } catch (error) {
    console.error("Transactions PATCH error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update transaction" },
      { status: 500 }
    )
  }
}