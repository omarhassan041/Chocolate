import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getPaymentMethod } from "@/lib/payment-methods"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ payments: data || [] })
  } catch (error) {
    console.error("Payments GET error:", error)
    return NextResponse.json({ payments: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const method = getPaymentMethod(body.paymentMethod)
    if (!method) {
      return NextResponse.json({ error: "Payment method khaldan" }, { status: 400 })
    }

    if (!body.orderId || !body.customerName || !body.customerPhone || !body.amount) {
      return NextResponse.json({ error: "Xog muhiim ah maqan" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          order_id: body.orderId,
          customer_name: body.customerName,
          customer_phone: body.customerPhone,
          customer_email: body.customerEmail || null,
          payment_method: body.paymentMethod,
          payment_number: method.number,
          amount: body.amount,
          txn_id: body.txnId || null,
          status: body.txnId ? "pending" : "awaiting_payment",
          notes: body.notes || null,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, payment: data }, { status: 201 })
  } catch (error) {
    console.error("Payments POST error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create payment" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, txnId } = body

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 })
    }

    const supabase = await createClient()
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (txnId) updateData.txn_id = txnId
    if (status === "verified") {
      updateData.verified_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("payments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, payment: data })
  } catch (error) {
    console.error("Payments PATCH error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update payment" },
      { status: 500 }
    )
  }
}