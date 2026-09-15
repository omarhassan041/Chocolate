import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform to match frontend type
    const orders = (data || []).map((o) => ({
      id: o.id,
      items: o.items,
      customer: {
        name: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone,
      },
      delivery: o.delivery,
      total: Number(o.total),
      status: o.status,
      createdAt: o.created_at,
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const orderId = `ORD-${Date.now()}`;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          id: orderId,
          customer_name: body.customer?.name,
          customer_email: body.customer?.email,
          customer_phone: body.customer?.phone,
          items: body.items,
          delivery: body.delivery,
          total: body.total,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 },
    );
  }
}
