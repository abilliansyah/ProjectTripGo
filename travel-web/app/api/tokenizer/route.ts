import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method, bank, price, quantity, customerDetails, id } = body;

    // 1. Validasi Input Dasar
    if (!id || !price) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }
    
    // 2. Mode Uji Coba TripGo Pay (Simulasi)
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
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY is missing in Env Variables");
      return NextResponse.json({ error: "Konfigurasi server salah" }, { status: 500 });
    }

    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    // Tentukan URL berdasarkan environment (Sandbox vs Production)
    // Ganti ke https://api.midtrans.com/v2/charge saat sudah Launching/Live
    const MIDTRANS_API_URL = "https://api.sandbox.midtrans.com/v2/charge";

    let payload: any = {
      transaction_details: { 
        order_id: id, 
        gross_amount: price * quantity 
      },
      customer_details: {
        ...customerDetails,
        // Pastikan phone dibersihkan dari simbol non-numerik jika perlu
      },
      item_details: [{ 
        id: id, 
        price: price, 
        quantity: quantity, 
        name: "Tiket Bus TripGo" 
      }]
    };

    // 3. Mapping Metode Pembayaran & Penambahan Callback URL
    switch (method) {
      case "bank_transfer":
        payload.payment_type = "bank_transfer";
        payload.bank_transfer = { bank: bank };
        break;
      case "qris":
        payload.payment_type = "qris";
        payload.qris = { acquirer: "gopay" }; // Rekomendasi untuk integrasi QRIS
        break;
      case "gopay":
        payload.payment_type = "gopay";
        payload.gopay = {
          enable_callback: true,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tiket-saya/${id}`
        };
        break;
      case "shopeepay":
        payload.payment_type = "shopeepay";
        payload.shopeepay = {
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tiket-saya/${id}`
        };
        break;
      case "cstore":
        payload.payment_type = "cstore";
        payload.cstore = { store: bank, message: `Pembayaran TripGo ID ${id}` };
        break;
      case "akulaku":
      case "kredivo":
        payload.payment_type = method;
        break;
      default:
        return NextResponse.json({ error: "Metode tidak valid" }, { status: 400 });
    }

    const response = await fetch(MIDTRANS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Log error dari Midtrans jika ada (Sangat berguna saat debugging di Vercel)
    if (data.status_code && parseInt(data.status_code) >= 400) {
      console.error("Midtrans Error Response:", data);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Route Tokenizer Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}