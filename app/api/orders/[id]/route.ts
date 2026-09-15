import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .update({ status: body.status })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error("Order PATCH error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error

    return NextResponse.json({ order: data })
  } catch (error) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }
}