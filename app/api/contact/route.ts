import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    const messages = (data || []).map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      read: m.read,
      createdAt: m.created_at,
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Contact GET error:", error)
    return NextResponse.json({ messages: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("contacts")
      .insert([
        {
          name: body.name,
          email: body.email,
          subject: body.subject || "No subject",
          message: body.message,
          read: false,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, message: data }, { status: 201 })
  } catch (error) {
    console.error("Contact POST error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    )
  }
}