import { ComponentStructure } from "./types";

export const stepsSectionStructure: ComponentStructure = {
  componentType: "stepsSection",
  variants: [
    {
      id: "stepsSection1",
      name: "Steps Section 1 - Modern Grid",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "background",
              label: "Background Color",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "accent", // Background uses accent color (lighter shade) from branding
                },
              ],
            },
            {
              key: "icon",
              label: "Icon Color",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Icon Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Icon uses primary color from branding
                },
              ],
            },
            {
              key: "title",
              label: "Title Color",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Title Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Title uses secondary color from branding
                },
              ],
            },
            {
              key: "description",
              label: "Description Color",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Description Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Description uses secondary color from branding
                },
              ],
            },
          ],
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            {
              key: "color",
              label: "Background Color",
              type: "color",
              placeholder: "#f2fbf9",
              useDefaultColor: true,
              globalColorType: "accent", // Background uses accent color (lighter shade) from branding
            },
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "72px",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "48px",
                },
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "20px",
                },
              ],
            },
          ],
        },
        {
          key: "header",
          label: "Header Section",
          type: "object",
          fields: [
            {
              key: "marginBottom",
              label: "Margin Bottom",
              type: "text",
              placeholder: "40px",
            },
            {
              key: "title",
              label: "Title",
              type: "object",
              fields: [
                { key: "text", label: "Title Text", type: "text" },
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "section-title",
                },
              ],
            },
            {
              key: "description",
              label: "Description",
              type: "object",
              fields: [
                { key: "text", label: "Description Text", type: "text" },
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "section-subtitle-xl text-gray-600",
                },
              ],
            },
          ],
        },
        {
          key: "grid",
          label: "Grid Layout",
          type: "object",
          fields: [
            {
              key: "gapX",
              label: "Horizontal Gap",
              type: "text",
              placeholder: "40px",
            },
            {
              key: "gapY",
              label: "Vertical Gap",
              type: "text",
              placeholder: "40px",
            },
            {
              key: "gapYMobile",
              label: "Mobile Vertical Gap",
              type: "text",
              placeholder: "48px",
            },
            {
              key: "columns",
              label: "Columns",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "number",
                  placeholder: "1",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "number",
                  placeholder: "2",
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "number",
                  placeholder: "3",
                },
              ],
            },
          ],
        },
        {
          key: "steps",
          label: "Steps",
          type: "array",
          addLabel: "Add Step",
          itemLabel: "Step",
          of: [
            { key: "title", label: "Step Title", type: "text" },
            { key: "desc", label: "Step Description", type: "text" },
            {
              key: "image",
              label: "Step Icon",
              type: "object",
              fields: [
                {
                  key: "type",
                  label: "Icon Type",
                  type: "select",
                  options: [
                    { value: "step1", label: "Step 1 - Property Inspection" },
                    { value: "step2", label: "Step 2 - Property Description" },
                    {
                      value: "step3",
                      label: "Step 3 - Professional Photography",
                    },
                    { value: "step4", label: "Step 4 - Marketing Strategy" },
                    { value: "step5", label: "Step 5 - Online Listing" },
                    { value: "step6", label: "Step 6 - Client Communication" },
                  ],
                },
                {
                  key: "size",
                  label: "Size",
                  type: "text",
                  placeholder: "80",
                },
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "w-20 h-20",
                },
              ],
            },
            {
              key: "titleStyle",
              label: "Title Style",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Color",
                  type: "color",
                  placeholder: "#047857",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Title uses secondary color
                },
                {
                  key: "size",
                  label: "Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "18px",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "24px",
                    },
                  ],
                },
                {
                  key: "weight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "600",
                },
              ],
            },
            {
              key: "descriptionStyle",
              label: "Description Style",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Color",
                  type: "color",
                  placeholder: "#4B5563",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Description uses secondary color
                },
                {
                  key: "size",
                  label: "Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "14px",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "16px",
                    },
                  ],
                },
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "1.75",
                },
              ],
            },
          ],
        },
            {
              key: "iconStyle",
              label: "Icon Style",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Icon Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Icon uses primary color from branding
                },
                {
                  key: "size",
                  label: "Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "40px",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "60px",
                    },
                  ],
                },
                {
                  key: "marginTop",
                  label: "Margin Top",
                  type: "text",
                  placeholder: "4px",
                },
                { key: "shrink", label: "Shrink", type: "boolean" },
              ],
            },
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Text Direction",
              type: "select",
              options: [
                { label: "Right to Left", value: "rtl" },
                { label: "Left to Right", value: "ltr" },
              ],
            },
            {
              key: "alignment",
              label: "Text Alignment",
              type: "select",
              options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ],
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "1200px",
            },
          ],
        },
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "header",
              label: "Header Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "text",
                  placeholder: "fade-up",
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "600",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "200",
                },
              ],
            },
            {
              key: "steps",
              label: "Steps Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "text",
                  placeholder: "fade-up",
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "600",
                },
                {
                  key: "stagger",
                  label: "Stagger Delay (ms)",
                  type: "number",
                  placeholder: "100",
                },
              ],
            },
          ],
        },
        {
          key: "responsive",
          label: "Responsive",
          type: "object",
          fields: [
            {
              key: "mobileBreakpoint",
              label: "Mobile Breakpoint",
              type: "text",
              placeholder: "640px",
            },
            {
              key: "tabletBreakpoint",
              label: "Tablet Breakpoint",
              type: "text",
              placeholder: "1024px",
            },
            {
              key: "desktopBreakpoint",
              label: "Desktop Breakpoint",
              type: "text",
              placeholder: "1280px",
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "header.title.text", label: "Section Title", type: "text" },
        {
          key: "header.description.text",
          label: "Section Description",
          type: "text",
        },
        { key: "steps", label: "Steps List", type: "array" },
      ],
    },
  ],
};
