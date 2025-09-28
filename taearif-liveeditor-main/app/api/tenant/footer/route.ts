import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ComponentVariant from "@/models/ComponentVariant";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { tenantId, footerData, variant } = await req.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 },
      );
    }

    const updatedComponent = await ComponentVariant.findOneAndUpdate(
      {
        componentType: "footer",
        tenantId: tenantId,
      },
      {
        $set: {
          variantName: variant,
          defaultProperties: new Map(Object.entries(footerData)),
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    if (!updatedComponent) {
      return NextResponse.json(
        { error: "Failed to update footer component" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedComponent);
  } catch (error) {
    console.error("Footer update error:", error);
    return NextResponse.json(
      { error: "Failed to update footer" },
      { status: 500 },
    );
  }
}
