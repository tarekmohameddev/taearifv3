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
    const { section, component, settings } = body;

    // Validate input
    if (!section || !component || !settings) {
      return NextResponse.json(
        { error: "Missing required fields: section, component, settings" },
        { status: 400 },
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 },
      );
    }

    // Find and update the user/tenant with the new component settings
    // Create the field path for nested component settings
    const settingsPath = `componentSettings.${section}.${component}`;

    const user = await User.findOneAndUpdate(
      { username: tenantId }, // Assuming tenantId corresponds to username
      {
        $set: {
          [settingsPath]: settings,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true, // Create if doesn't exist
      },
    );

    if (!user) {
      return NextResponse.json(
        { error: "Failed to update component settings" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Component settings updated successfully for ${section}.${component}`,
      settings,
      section,
      component,
    });
  } catch (error) {
    console.error("Component settings update error:", error);
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
    const section = searchParams.get("section");
    const component = searchParams.get("component");

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

    // Get the component settings for the specific section and component
    let componentSettings = user.componentSettings || {};

    if (section && component) {
      componentSettings = componentSettings[section]?.[component] || {};
    } else if (section) {
      componentSettings = componentSettings[section] || {};
    }

    return NextResponse.json({
      success: true,
      settings: componentSettings,
      section,
      component,
      tenantId,
    });
  } catch (error) {
    console.error("Component settings fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
