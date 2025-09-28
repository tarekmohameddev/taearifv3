import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PUT(
  req: NextRequest,
  { params }: { params: { tenantId: string } },
) {
  try {
    await dbConnect();

    const { tenantId } = params;
    const body = await req.json();
    const { order, page = "homepage" } = body;

    // Validate input
    if (!order || !Array.isArray(order)) {
      return NextResponse.json(
        { error: "Invalid order array" },
        { status: 400 },
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 },
      );
    }

    // Find the user first to get current componentSettings
    const user = await User.findOne({ username: tenantId });
    if (!user) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get current componentSettings for the page
    const currentSettings = user.componentSettings?.get(page) || new Map();

    // Update positions based on the new order
    order.forEach((componentId, index) => {
      const component = currentSettings.get(componentId);
      if (component) {
        component.position = index;
        currentSettings.set(componentId, component);
      }
    });

    // Update the componentSettings for the specific page
    const updatedSettings = new Map(user.componentSettings || new Map());
    updatedSettings.set(page, currentSettings);

    const updatedUser = await User.findOneAndUpdate(
      { username: tenantId },
      {
        $set: {
          componentSettings: updatedSettings,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: false,
      },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update component order" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Component order updated successfully for ${page}`,
      order,
      page,
    });
  } catch (error) {
    console.error("Component order update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } },
) {
  try {
    await dbConnect();

    const { tenantId } = params;
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "homepage";

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ username: tenantId });

    if (!user) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get the component order from componentSettings for the specific page
    const pageSettings = user.componentSettings?.get(page);
    let componentOrder = [];

    if (pageSettings) {
      // Convert Map to array and sort by position
      const componentsArray = Array.from(pageSettings.entries()).map(
        ([id, component]) => ({
          id,
          ...component,
        }),
      );

      componentOrder = componentsArray
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .map((component) => component.id);
    }

    return NextResponse.json({
      success: true,
      order: componentOrder,
      page,
      tenantId,
    });
  } catch (error) {
    console.error("Component order fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
