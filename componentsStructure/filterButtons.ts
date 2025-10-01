import { ComponentStructure } from "./types";

export const filterButtonsStructure: ComponentStructure = {
  componentType: "filterButtons",
  variants: [
    {
      id: "filterButtons1",
      name: "Filter Buttons 1 - Property Filters",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "inspectionButtonText",
              label: "Inspection Request Button Text",
              type: "text",
            },
            {
              key: "inspectionButtonUrl",
              label: "Inspection Request Button URL",
              type: "text",
            },
            {
              key: "allButtonText",
              label: "All Button Text",
              type: "text",
            },
            {
              key: "availableButtonText",
              label: "Available Button Text",
              type: "text",
            },
            {
              key: "soldButtonText",
              label: "Sold Button Text",
              type: "text",
            },
            {
              key: "rentedButtonText",
              label: "Rented Button Text",
              type: "text",
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "inspectionButton",
              label: "Inspection Button Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
                  type: "text",
                },
                {
                  key: "textColor",
                  label: "Text Color",
                  type: "text",
                },
                {
                  key: "hoverBgColor",
                  label: "Hover Background Color",
                  type: "text",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "text",
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                },
              ],
            },
            {
              key: "filterButtons",
              label: "Filter Buttons Styling",
              type: "object",
              fields: [
                {
                  key: "activeBgColor",
                  label: "Active Background Color",
                  type: "text",
                },
                {
                  key: "activeTextColor",
                  label: "Active Text Color",
                  type: "text",
                },
                {
                  key: "inactiveBgColor",
                  label: "Inactive Background Color",
                  type: "text",
                },
                {
                  key: "inactiveTextColor",
                  label: "Inactive Text Color",
                  type: "text",
                },
                {
                  key: "hoverBgColor",
                  label: "Hover Background Color",
                  type: "text",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "text",
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                },
                {
                  key: "gap",
                  label: "Gap Between Buttons",
                  type: "text",
                },
              ],
            },
          ],
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Layout Direction",
              type: "select",
              options: ["column", "row"],
            },
            {
              key: "alignment",
              label: "Button Alignment",
              type: "select",
              options: ["center", "start", "end", "between"],
            },
            {
              key: "inspectionButtonWidth",
              label: "Inspection Button Width",
              type: "text",
            },
            {
              key: "spacing",
              label: "Spacing",
              type: "object",
              fields: [
                {
                  key: "marginBottom",
                  label: "Margin Bottom",
                  type: "text",
                },
                {
                  key: "gap",
                  label: "Gap Between Elements",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "content.inspectionButtonText",
          label: "Inspection Request Button Text",
          type: "text",
        },
        {
          key: "content.inspectionButtonUrl",
          label: "Inspection Request Button URL",
          type: "text",
        },
        {
          key: "content.allButtonText",
          label: "All Button Text",
          type: "text",
        },
        {
          key: "content.availableButtonText",
          label: "Available Button Text",
          type: "text",
        },
        {
          key: "content.soldButtonText",
          label: "Sold Button Text",
          type: "text",
        },
        {
          key: "content.rentedButtonText",
          label: "Rented Button Text",
          type: "text",
        },
        {
          key: "styling.inspectionButton.bgColor",
          label: "Inspection Button Background Color",
          type: "text",
        },
        {
          key: "styling.inspectionButton.textColor",
          label: "Inspection Button Text Color",
          type: "text",
        },
        {
          key: "styling.inspectionButton.hoverBgColor",
          label: "Inspection Button Hover Background Color",
          type: "text",
        },
        {
          key: "styling.inspectionButton.borderRadius",
          label: "Inspection Button Border Radius",
          type: "text",
        },
        {
          key: "styling.inspectionButton.padding",
          label: "Inspection Button Padding",
          type: "text",
        },
        {
          key: "styling.inspectionButton.fontSize",
          label: "Inspection Button Font Size",
          type: "text",
        },
        {
          key: "styling.filterButtons.activeBgColor",
          label: "Active Filter Button Background Color",
          type: "text",
        },
        {
          key: "styling.filterButtons.activeTextColor",
          label: "Active Filter Button Text Color",
          type: "text",
        },
        {
          key: "styling.filterButtons.inactiveBgColor",
          label: "Inactive Filter Button Background Color",
          type: "text",
        },
        {
          key: "styling.filterButtons.inactiveTextColor",
          label: "Inactive Filter Button Text Color",
          type: "text",
        },
        {
          key: "styling.filterButtons.hoverBgColor",
          label: "Filter Button Hover Background Color",
          type: "text",
        },
        {
          key: "styling.filterButtons.borderRadius",
          label: "Filter Button Border Radius",
          type: "text",
        },
        {
          key: "styling.filterButtons.padding",
          label: "Filter Button Padding",
          type: "text",
        },
        {
          key: "styling.filterButtons.fontSize",
          label: "Filter Button Font Size",
          type: "text",
        },
        {
          key: "styling.filterButtons.gap",
          label: "Gap Between Filter Buttons",
          type: "text",
        },
        { key: "layout.direction", label: "Layout Direction", type: "select" },
        { key: "layout.alignment", label: "Button Alignment", type: "select" },
        {
          key: "layout.inspectionButtonWidth",
          label: "Inspection Button Width",
          type: "text",
        },
        {
          key: "layout.spacing.marginBottom",
          label: "Margin Bottom",
          type: "text",
        },
        {
          key: "layout.spacing.gap",
          label: "Gap Between Elements",
          type: "text",
        },
      ],
    },
  ],
};
