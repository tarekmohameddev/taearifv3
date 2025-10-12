import { ComponentStructure } from "./types";

/**
 * Inputs2 Structure - Visibility Controls Only
 * 
 * This structure contains ONLY visibility controls for cards and fields.
 * All other data (styling, layout, content) comes from default data.
 * 
 * This follows the 99% default data + 1% visibility control approach.
 */

export const inputs2Structure: ComponentStructure = {
  componentType: "inputs2",
  variants: [
    {
      id: "inputs2",
      name: "Inputs 2 - Visibility Controls",
      description: "Visibility controls for cards and fields only. All other data comes from default.",
      fields: [
        // ========================================
        // CARD VISIBILITY CONTROLS
        // ========================================
        {
          key: "cardVisibility",
          label: "🎛️ Card Visibility Controls",
          type: "object",
          description: "Control which cards are visible",
          fields: [
            {
              key: "propertyInfoCard",
              label: "Show Property Information Card",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the property information card",
            },
            {
              key: "budgetCard",
              label: "Show Budget & Payment Card",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the budget and payment card",
            },
            {
              key: "additionalDetailsCard",
              label: "Show Additional Details Card",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the additional details card",
            },
            {
              key: "contactCard",
              label: "Show Contact Information Card",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the contact information card",
            },
          ],
        },

        // ========================================
        // FIELD VISIBILITY CONTROLS
        // ========================================
        {
          key: "fieldVisibility",
          label: "🎯 Field Visibility Controls",
          type: "object",
          description: "Control which fields are visible within each card",
          fields: [
            // Property Information Fields
            {
              key: "propertyType",
              label: "Show Property Type Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the property type field",
            },
            {
              key: "propertyCategory",
              label: "Show Property Category Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the property category field",
            },
            {
              key: "city",
              label: "Show City Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the city field",
            },
            {
              key: "district",
              label: "Show District Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the district field",
            },
            {
              key: "areaFrom",
              label: "Show Area From Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the area from field",
            },
            {
              key: "areaTo",
              label: "Show Area To Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the area to field",
            },
            // Budget & Payment Fields
            {
              key: "purchaseMethod",
              label: "Show Purchase Method Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the purchase method field",
            },
            {
              key: "budgetFrom",
              label: "Show Budget From Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the budget from field",
            },
            {
              key: "budgetTo",
              label: "Show Budget To Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the budget to field",
            },
            // Additional Details Fields
            {
              key: "seriousness",
              label: "Show Seriousness Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the seriousness field",
            },
            {
              key: "purchaseGoal",
              label: "Show Purchase Goal Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the purchase goal field",
            },
            {
              key: "similarOffers",
              label: "Show Similar Offers Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the similar offers field",
            },
            // Contact Information Fields
            {
              key: "fullName",
              label: "Show Full Name Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the full name field",
            },
            {
              key: "phone",
              label: "Show Phone Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the phone field",
            },
            {
              key: "whatsapp",
              label: "Show WhatsApp Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the WhatsApp field",
            },
            {
              key: "notes",
              label: "Show Notes Field",
              type: "boolean",
              defaultValue: true,
              description: "Toggle to show/hide the notes field",
            },
          ],
        },
      ],
    },
  ],
};
