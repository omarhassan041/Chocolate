import { NextResponse } from "next/server"

// In-memory storage for messages (in production, use a database)
const messages: any[] = []

export async function POST(request: Request) {
  try {
    const messageData = await request.json()

    const message = {
      id: `MSG-${Date.now()}`,
      ...messageData,
      createdAt: new Date().toISOString(),
      read: false,
    }

    messages.push(message)

    return NextResponse.json({ success: true, message }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ messages })
}
