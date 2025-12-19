import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()

    // In production, update the order in the database
    return NextResponse.json({ success: true, id, status })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}
