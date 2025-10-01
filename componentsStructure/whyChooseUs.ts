import { ComponentStructure } from "./types";

export const whyChooseUsStructure: ComponentStructure = {
  componentType: "whyChooseUs",
  variants: [
    {
      id: "whyChooseUs1",
      name: "Why Choose Us 1 - Features Grid",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Direction",
              type: "select",
              options: [
                { value: "rtl", label: "Right to Left" },
                { value: "ltr", label: "Left to Right" },
              ],
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "1600px",
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                {
                  key: "y",
                  label: "Vertical Padding",
                  type: "text",
                  placeholder: "py-14",
                },
                {
                  key: "smY",
                  label: "Small Vertical Padding",
                  type: "text",
                  placeholder: "sm:py-16",
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
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
            {
              key: "marginBottom",
              label: "Margin Bottom",
              type: "text",
              placeholder: "mb-10",
            },
            {
              key: "textAlign",
              label: "Text Alignment",
              type: "text",
              placeholder: "text-right",
            },
            {
              key: "paddingX",
              label: "Horizontal Padding",
              type: "text",
              placeholder: "px-5",
            },
            {
              key: "typography",
              label: "Typography",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "section-title text-right",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "section-subtitle-xl",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "features",
          label: "Features Grid",
          type: "object",
          fields: [
            {
              key: "list",
              label: "Features List",
              type: "array",
              addLabel: "Add Feature",
              itemLabel: "Feature",
              of: [
                { key: "title", label: "Title", type: "text" },
                { key: "desc", label: "Description", type: "text" },
                { key: "icon", label: "Icon URL", type: "image" },
              ],
            },
            {
              key: "grid",
              label: "Grid Layout",
              type: "object",
              fields: [
                {
                  key: "gap",
                  label: "Gap",
                  type: "text",
                  placeholder: "gap-6",
                },
                {
                  key: "columns",
                  label: "Columns",
                  type: "object",
                  fields: [
                    {
                      key: "sm",
                      label: "Small Screens",
                      type: "text",
                      placeholder: "sm:grid-cols-2",
                    },
                    {
                      key: "xl",
                      label: "Extra Large Screens",
                      type: "text",
                      placeholder: "xl:grid-cols-3",
                    },
                  ],
                },
                {
                  key: "paddingX",
                  label: "Horizontal Padding",
                  type: "text",
                  placeholder: "px-4",
                },
              ],
            },
            {
              key: "card",
              label: "Card Style",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder:
                    "rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-emerald-50",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "rounded-2xl",
                },
                {
                  key: "border",
                  label: "Border",
                  type: "text",
                  placeholder: "border",
                },
                {
                  key: "backgroundColor",
                  label: "Background Color",
                  type: "text",
                  placeholder: "bg-white",
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "text",
                  placeholder: "p-6",
                },
                {
                  key: "shadow",
                  label: "Shadow",
                  type: "text",
                  placeholder: "shadow-sm",
                },
                {
                  key: "ring",
                  label: "Ring",
                  type: "text",
                  placeholder: "ring-1 ring-emerald-50",
                },
              ],
            },
            {
              key: "icon",
              label: "Icon Style",
              type: "object",
              fields: [
                {
                  key: "container",
                  label: "Container",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mx-auto flex size-20 items-center justify-center",
                    },
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "size-20",
                    },
                    {
                      key: "flex",
                      label: "Flex",
                      type: "text",
                      placeholder: "flex",
                    },
                    {
                      key: "items",
                      label: "Items",
                      type: "text",
                      placeholder: "items-center",
                    },
                    {
                      key: "justify",
                      label: "Justify",
                      type: "text",
                      placeholder: "justify-center",
                    },
                  ],
                },
                {
                  key: "image",
                  label: "Image",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "h-[7rem] w-[7rem]",
                    },
                    {
                      key: "height",
                      label: "Height",
                      type: "text",
                      placeholder: "h-[7rem]",
                    },
                    {
                      key: "width",
                      label: "Width",
                      type: "text",
                      placeholder: "w-[7rem]",
                    },
                  ],
                },
              ],
            },
            {
              key: "typography",
              label: "Typography",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mt-6 text-center text-lg font-bold text-emerald-700",
                    },
                    {
                      key: "marginTop",
                      label: "Margin Top",
                      type: "text",
                      placeholder: "mt-6",
                    },
                    {
                      key: "textAlign",
                      label: "Text Align",
                      type: "text",
                      placeholder: "text-center",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "text",
                      placeholder: "text-lg",
                    },
                    {
                      key: "fontWeight",
                      label: "Font Weight",
                      type: "text",
                      placeholder: "font-bold",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "text",
                      placeholder: "text-emerald-700",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mt-3 text-center text-lg leading-7 text-gray-600",
                    },
                    {
                      key: "marginTop",
                      label: "Margin Top",
                      type: "text",
                      placeholder: "mt-3",
                    },
                    {
                      key: "textAlign",
                      label: "Text Align",
                      type: "text",
                      placeholder: "text-center",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "text",
                      placeholder: "text-lg",
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-7",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "text",
                      placeholder: "text-gray-600",
                    },
                  ],
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
              key: "mobile",
              label: "Mobile",
              type: "object",
              fields: [
                {
                  key: "padding",
                  label: "Padding",
                  type: "text",
                  placeholder: "py-14",
                },
                {
                  key: "gridCols",
                  label: "Grid Columns",
                  type: "text",
                  placeholder: "grid-cols-1",
                },
              ],
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "object",
              fields: [
                {
                  key: "padding",
                  label: "Padding",
                  type: "text",
                  placeholder: "sm:py-16",
                },
                {
                  key: "gridCols",
                  label: "Grid Columns",
                  type: "text",
                  placeholder: "sm:grid-cols-2",
                },
              ],
            },
            {
              key: "desktop",
              label: "Desktop",
              type: "object",
              fields: [
                {
                  key: "gridCols",
                  label: "Grid Columns",
                  type: "text",
                  placeholder: "xl:grid-cols-3",
                },
              ],
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
                { key: "enabled", label: "Enable Animation", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "select",
                  options: [
                    { value: "fade-up", label: "Fade Up" },
                    { value: "fade-left", label: "Fade Left" },
                    { value: "fade-right", label: "Fade Right" },
                    { value: "slide-up", label: "Slide Up" },
                  ],
                },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "features",
              label: "Features Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enable Animation", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "select",
                  options: [
                    { value: "fade-up", label: "Fade Up" },
                    { value: "fade-left", label: "Fade Left" },
                    { value: "fade-right", label: "Fade Right" },
                    { value: "slide-up", label: "Slide Up" },
                  ],
                },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
                { key: "stagger", label: "Stagger Delay (ms)", type: "number" },
              ],
            },
            {
              key: "icons",
              label: "Icons Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enable Animation", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "select",
                  options: [
                    { value: "fade-up", label: "Fade Up" },
                    { value: "fade-left", label: "Fade Left" },
                    { value: "fade-right", label: "Fade Right" },
                    { value: "slide-up", label: "Slide Up" },
                  ],
                },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
                { key: "stagger", label: "Stagger Delay (ms)", type: "number" },
              ],
            },
          ],
        },
        {
          key: "colors",
          label: "Colors",
          type: "object",
          fields: [
            {
              key: "background",
              label: "Section Background",
              type: "color",
              placeholder: "#ffffff",
            },
            {
              key: "cardBackground",
              label: "Card Background",
              type: "color",
              placeholder: "#ffffff",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              placeholder: "#059669",
            },
            {
              key: "descriptionColor",
              label: "Description Color",
              type: "color",
              placeholder: "#4b5563",
            },
            {
              key: "borderColor",
              label: "Border Color",
              type: "color",
              placeholder: "#e5e7eb",
            },
            {
              key: "ringColor",
              label: "Ring Color",
              type: "color",
              placeholder: "#ecfdf5",
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "header.title", label: "Header Title", type: "text" },
        {
          key: "header.description",
          label: "Header Description",
          type: "text",
        },
        { key: "features.list", label: "Features List", type: "array" },
        { key: "layout.direction", label: "Direction", type: "select" },
        {
          key: "animations.header.enabled",
          label: "Header Animation",
          type: "boolean",
        },
        {
          key: "animations.features.enabled",
          label: "Features Animation",
          type: "boolean",
        },
        {
          key: "animations.icons.enabled",
          label: "Icons Animation",
          type: "boolean",
        },
        { key: "colors.background", label: "Background Color", type: "color" },
        { key: "colors.titleColor", label: "Title Color", type: "color" },
        {
          key: "colors.descriptionColor",
          label: "Description Color",
          type: "color",
        },
      ],
    },
  ],
};
