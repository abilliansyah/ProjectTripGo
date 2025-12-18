import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method, bank, price, quantity, customerDetails, id } = body;
    
    // 1. Mode Uji Coba TripGo Pay
    if (method === "tripgo_pay") {
      return NextResponse.json({
        status_code: "200",
        transaction_status: "settlement",
        payment_type: "tripgo_pay",
        order_id: id,
        gross_amount: price * quantity
      });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    let payload: any = {
      transaction_details: { order_id: id, gross_amount: price * quantity },
      customer_details: customerDetails,
      item_details: [{ id: id, price: price, quantity: quantity, name: "Tiket TripGo" }]
    };

    // 2. Mapping Semua Metode Pembayaran
    switch (method) {
      case "bank_transfer":
        payload.payment_type = "bank_transfer";
        payload.bank_transfer = { bank: bank };
        break;
      case "qris":
        payload.payment_type = "qris";
        break;
      case "gopay":
        payload.payment_type = "gopay";
        break;
      case "shopeepay":
        payload.payment_type = "shopeepay";
        break;
      case "cstore":
        payload.payment_type = "cstore";
        payload.cstore = { store: bank, message: "Tiket TripGo" };
        break;
      case "akulaku":
        payload.payment_type = "akulaku";
        break;
      case "kredivo":
        payload.payment_type = "kredivo";
        break;
      case "cimb_clicks":
        payload.payment_type = "cimb_clicks";
        payload.cimb_clicks = { description: "Tiket TripGo" };
        break;
      case "bca_klikpay":
        payload.payment_type = "bca_klikpay";
        payload.bca_klikpay = { description: "Tiket TripGo" };
        break;
      default:
        return NextResponse.json({ error: "Metode tidak valid" }, { status: 400 });
    }

    const response = await fetch("https://api.sandbox.midtrans.com/v2/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}