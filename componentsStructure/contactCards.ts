import { ComponentStructure } from "./types";

export const contactCardsStructure: ComponentStructure = {
  componentType: "contactCards",
  variants: [
    {
      id: "contactCards1",
      name: "Contact Cards 1 - Contact Information Cards",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "container",
              label: "Container",
              type: "object",
              fields: [
                {
                  key: "padding",
                  label: "Padding",
                  type: "object",
                  fields: [
                    {
                      key: "vertical",
                      label: "Vertical",
                      type: "text",
                      placeholder: "py-[48px] md:py-[104px]",
                    },
                    {
                      key: "horizontal",
                      label: "Horizontal",
                      type: "text",
                      placeholder: "px-4 sm:px-10",
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
                  key: "columns",
                  label: "Columns",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "grid-cols-1",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "md:grid-cols-3",
                    },
                  ],
                },
                {
                  key: "gap",
                  label: "Gap",
                  type: "text",
                  placeholder: "gap-[24px]",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "rounded-[10px]",
                },
              ],
            },
          ],
        },
        {
          key: "cards",
          label: "Contact Cards",
          type: "array",
          addLabel: "Add Contact Card",
          itemLabel: "Contact Card",
          of: [
            {
              key: "icon",
              label: "Icon",
              type: "object",
              fields: [
                { key: "src", label: "Image Source", type: "image" },
                { key: "alt", label: "Alt Text", type: "text" },
                {
                  key: "size",
                  label: "Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "w-[40px] h-[40px]",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "md:w-[60px] md:h-[60px]",
                    },
                  ],
                },
              ],
            },
            {
              key: "title",
              label: "Title",
              type: "object",
              fields: [
                { key: "text", label: "Text", type: "text" },
                {
                  key: "style",
                  label: "Style",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "text-[16px]",
                        },
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "md:text-[24px]",
                        },
                      ],
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-bold",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Title uses secondary color
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-[35px]",
                    },
                  ],
                },
              ],
            },
            {
              key: "content",
              label: "Content",
              type: "object",
              fields: [
                {
                  key: "type",
                  label: "Content Type",
                  type: "select",
                  options: [
                    { value: "text", label: "Simple Text" },
                    { value: "links", label: "Links Array" },
                  ],
                },
                {
                  key: "text",
                  label: "Text Content",
                  type: "text",
                },
                {
                  key: "links",
                  label: "Links",
                  type: "array",
                  addLabel: "Add Link",
                  itemLabel: "Link",
                  of: [
                    { key: "text", label: "Link Text", type: "text" },
                    { key: "href", label: "Link URL", type: "url" },
                  ],
                },
                {
                  key: "style",
                  label: "Content Style",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "text-[16px]",
                        },
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "md:text-[20px]",
                        },
                      ],
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-normal",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-[35px]",
                    },
                  ],
                },
              ],
            },
            {
              key: "cardStyle",
              label: "Card Style",
              type: "object",
              fields: [
                {
                  key: "height",
                  label: "Height",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "h-[182px]",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "md:h-[210px]",
                    },
                  ],
                },
                {
                  key: "gap",
                  label: "Gap",
                  type: "object",
                  fields: [
                    {
                      key: "main",
                      label: "Main Gap",
                      type: "text",
                      placeholder: "gap-y-[16px]",
                    },
                    {
                      key: "content",
                      label: "Content Gap",
                      type: "object",
                      fields: [
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "gap-y-[8px]",
                        },
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "md:gap-y-[16px]",
                        },
                      ],
                    },
                    {
                      key: "links",
                      label: "Links Gap",
                      type: "text",
                      placeholder: "gap-x-[50px]",
                    },
                  ],
                },
                {
                  key: "shadow",
                  label: "Box Shadow",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    {
                      key: "value",
                      label: "Shadow Value",
                      type: "text",
                      placeholder: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
                    },
                  ],
                },
                {
                  key: "alignment",
                  label: "Alignment",
                  type: "object",
                  fields: [
                    {
                      key: "horizontal",
                      label: "Horizontal",
                      type: "text",
                      placeholder: "items-center",
                    },
                    {
                      key: "vertical",
                      label: "Vertical",
                      type: "text",
                      placeholder: "justify-center",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "responsive",
          label: "Responsive Settings",
          type: "object",
          fields: [
            {
              key: "breakpoints",
              label: "Breakpoints",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "768px",
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "1024px",
                },
              ],
            },
            {
              key: "gridColumns",
              label: "Grid Columns",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "number",
                  placeholder: "1",
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "number",
                  placeholder: "3",
                },
              ],
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "icon",
              label: "Icon Styling",
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
              label: "Title Styling",
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
              key: "content",
              label: "Content Styling",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Content Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Content uses secondary color from branding
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
              key: "cards",
              label: "Cards Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "text",
                  placeholder: "fadeInUp",
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "500",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "0",
                },
                {
                  key: "stagger",
                  label: "Stagger (ms)",
                  type: "number",
                  placeholder: "100",
                },
              ],
            },
            {
              key: "icons",
              label: "Icons Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "text",
                  placeholder: "scaleIn",
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "300",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "200",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "cards",
          label: "Contact Cards",
          type: "array",
          addLabel: "Add Contact Card",
          itemLabel: "Contact Card",
          of: [
            {
              key: "icon",
              label: "Icon",
              type: "object",
              fields: [
                { key: "src", label: "Image Source", type: "image" },
                { key: "alt", label: "Alt Text", type: "text" },
                {
                  key: "size",
                  label: "Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "w-[40px] h-[40px]",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "md:w-[60px] md:h-[60px]",
                    },
                  ],
                },
              ],
            },
            {
              key: "title",
              label: "Title",
              type: "object",
              fields: [
                { key: "text", label: "Text", type: "text" },
                {
                  key: "style",
                  label: "Style",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "text-[16px]",
                        },
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "md:text-[24px]",
                        },
                      ],
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-bold",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Title uses secondary color
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-[35px]",
                    },
                  ],
                },
              ],
            },
            {
              key: "content",
              label: "Content",
              type: "object",
              fields: [
                {
                  key: "type",
                  label: "Content Type",
                  type: "select",
                  options: [
                    { value: "text", label: "Simple Text" },
                    { value: "links", label: "Links Array" },
                  ],
                },
                {
                  key: "text",
                  label: "Text Content",
                  type: "text",
                },
                {
                  key: "links",
                  label: "Links",
                  type: "array",
                  addLabel: "Add Link",
                  itemLabel: "Link",
                  of: [
                    { key: "text", label: "Link Text", type: "text" },
                    { key: "href", label: "Link URL", type: "url" },
                  ],
                },
                {
                  key: "style",
                  label: "Content Style",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "text-[16px]",
                        },
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "md:text-[20px]",
                        },
                      ],
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-normal",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-[35px]",
                    },
                  ],
                },
              ],
            },
            {
              key: "cardStyle",
              label: "Card Style",
              type: "object",
              fields: [
                {
                  key: "height",
                  label: "Height",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "h-[182px]",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "md:h-[210px]",
                    },
                  ],
                },
                {
                  key: "gap",
                  label: "Gap",
                  type: "object",
                  fields: [
                    {
                      key: "main",
                      label: "Main Gap",
                      type: "text",
                      placeholder: "gap-y-[16px]",
                    },
                    {
                      key: "content",
                      label: "Content Gap",
                      type: "object",
                      fields: [
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "gap-y-[8px]",
                        },
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "md:gap-y-[16px]",
                        },
                      ],
                    },
                    {
                      key: "links",
                      label: "Links Gap",
                      type: "text",
                      placeholder: "gap-x-[50px]",
                    },
                  ],
                },
                {
                  key: "shadow",
                  label: "Box Shadow",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    {
                      key: "value",
                      label: "Shadow Value",
                      type: "text",
                      placeholder: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
                    },
                  ],
                },
                {
                  key: "alignment",
                  label: "Alignment",
                  type: "object",
                  fields: [
                    {
                      key: "horizontal",
                      label: "Horizontal",
                      type: "text",
                      placeholder: "items-center",
                    },
                    {
                      key: "vertical",
                      label: "Vertical",
                      type: "text",
                      placeholder: "justify-center",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
