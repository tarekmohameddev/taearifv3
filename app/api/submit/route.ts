import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Google Apps Script URL for data storage
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbyeqqVafWxZAPMLv4LqPUZ2jP1jJeJQBbnwxqzj7or1CR1YUIq3sJ0r5hMQLrOO4Ws/exec";

    // Send data to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "حدث خطأ في إرسال البيانات" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in submit API:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في الخادم" },
      { status: 500 },
    );
  }
}
