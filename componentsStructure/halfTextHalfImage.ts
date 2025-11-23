import { ComponentStructure } from "./types";

export const halfTextHalfImageStructure: ComponentStructure = {
  componentType: "halfTextHalfImage",
  variants: [
    {
      id: "halfTextHalfImage1",
      name: "Half Text Half Image 1 - Modern",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },
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
              key: "textWidth",
              label: "Text Width (%)",
              type: "number",
            },
            {
              key: "imageWidth",
              label: "Image Width (%)",
              type: "number",
            },
            {
              key: "gap",
              label: "Gap Between Sections",
              type: "text",
            },
            {
              key: "minHeight",
              label: "Minimum Height",
              type: "text",
            },
          ],
        },
        {
          key: "spacing",
          label: "Spacing",
          type: "object",
          fields: [
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                { key: "top", label: "Top", type: "number" },
                { key: "bottom", label: "Bottom", type: "number" },
                { key: "left", label: "Left", type: "number" },
                { key: "right", label: "Right", type: "number" },
              ],
            },
            {
              key: "margin",
              label: "Margin",
              type: "object",
              fields: [
                { key: "top", label: "Top", type: "number" },
                { key: "bottom", label: "Bottom", type: "number" },
                { key: "left", label: "Left", type: "number" },
                { key: "right", label: "Right", type: "number" },
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
              key: "eyebrow",
              label: "Eyebrow Text",
              type: "text",
            },
            {
              key: "title",
              label: "Title",
              type: "text",
            },
            {
              key: "description",
              label: "Description",
              type: "text",
            },
            {
              key: "button",
              label: "Button",
              type: "object",
              fields: [
                { key: "text", label: "Button Text", type: "text" },
                { key: "enabled", label: "Show Button", type: "boolean" },
                { key: "url", label: "Button URL", type: "text" },
                {
                  key: "style",
                  label: "Button Style",
                  type: "object",
                  fields: [
                    {
                      key: "backgroundColor",
                      label: "Background Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Button background uses primary color
                    },
                    { 
                      key: "textColor", 
                      label: "Text Color", 
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary" // Button text uses primary color
                    },
                    {
                      key: "hoverBackgroundColor",
                      label: "Hover Background",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Button hover background uses primary color
                    },
                    {
                      key: "hoverTextColor",
                      label: "Hover Text Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary" // Button hover text uses primary color
                    },
                    { key: "width", label: "Width", type: "text" },
                    { key: "height", label: "Height", type: "text" },
                    {
                      key: "borderRadius",
                      label: "Border Radius",
                      type: "text",
                    },
                  ],
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
              key: "eyebrow",
              label: "Eyebrow Font",
              type: "object",
              fields: [
                { key: "size", label: "Size", type: "text" },
                { key: "weight", label: "Weight", type: "text" },
                { 
                  key: "color", 
                  label: "Color", 
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary" // Subtitle uses secondary color
                },
                { key: "lineHeight", label: "Line Height", type: "text" },
              ],
            },
            {
              key: "title",
              label: "Title Font",
              type: "object",
              fields: [
                { key: "size", label: "Size", type: "text" },
                { key: "weight", label: "Weight", type: "text" },
                { 
                  key: "color", 
                  label: "Color", 
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary" // Title uses secondary color
                },
                { key: "lineHeight", label: "Line Height", type: "text" },
              ],
            },
            {
              key: "description",
              label: "Description Font",
              type: "object",
              fields: [
                { key: "size", label: "Size", type: "text" },
                { key: "weight", label: "Weight", type: "text" },
                { 
                  key: "color", 
                  label: "Color", 
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary" // Description uses secondary color
                },
                { key: "lineHeight", label: "Line Height", type: "text" },
              ],
            },
          ],
        },
        {
          key: "image",
          label: "Image",
          type: "object",
          fields: [
            { key: "src", label: "Image Source", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "style",
              label: "Image Style",
              type: "object",
              fields: [
                { key: "aspectRatio", label: "Aspect Ratio", type: "text" },
                {
                  key: "objectFit",
                  label: "Object Fit",
                  type: "select",
                  options: [
                    { value: "contain", label: "Contain" },
                    { value: "cover", label: "Cover" },
                    { value: "fill", label: "Fill" },
                  ],
                },
                { key: "borderRadius", label: "Border Radius", type: "text" },
              ],
            },
            {
              key: "background",
              label: "Background Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Show Background", type: "boolean" },
                { key: "color", label: "Background Color", type: "color" },
                { key: "width", label: "Width (%)", type: "number" },
                { key: "borderRadius", label: "Border Radius", type: "text" },
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
                { key: "textOrder", label: "Text Order", type: "number" },
                { key: "imageOrder", label: "Image Order", type: "number" },
                { key: "textWidth", label: "Text Width", type: "text" },
                { key: "imageWidth", label: "Image Width", type: "text" },
                {
                  key: "marginBottom",
                  label: "Image Margin Bottom",
                  type: "text",
                },
              ],
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "object",
              fields: [
                { key: "textOrder", label: "Text Order", type: "number" },
                { key: "imageOrder", label: "Image Order", type: "number" },
                { key: "textWidth", label: "Text Width", type: "text" },
                { key: "imageWidth", label: "Image Width", type: "text" },
                {
                  key: "marginBottom",
                  label: "Image Margin Bottom",
                  type: "text",
                },
              ],
            },
            {
              key: "desktop",
              label: "Desktop",
              type: "object",
              fields: [
                { key: "textOrder", label: "Text Order", type: "number" },
                { key: "imageOrder", label: "Image Order", type: "number" },
                { key: "textWidth", label: "Text Width", type: "text" },
                { key: "imageWidth", label: "Image Width", type: "text" },
                {
                  key: "marginBottom",
                  label: "Image Margin Bottom",
                  type: "text",
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
              key: "text",
              label: "Text Animation",
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
              key: "image",
              label: "Image Animation",
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
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.eyebrow", label: "Eyebrow Text", type: "text" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.description", label: "Description", type: "text" },
        { key: "content.button.text", label: "Button Text", type: "text" },
        { key: "image.src", label: "Image", type: "image" },
        { key: "image.alt", label: "Image Alt Text", type: "text" },
      ],
    },
    {
      id: "halfTextHalfImage2",
      name: "Half Text Half Image 2 - With Stats",
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
              key: "gridCols",
              label: "Grid Columns",
              type: "text",
              placeholder: "md:grid-cols-10",
            },
            {
              key: "gap",
              label: "Gap",
              type: "object",
              fields: [
                {
                  key: "x",
                  label: "Horizontal Gap",
                  type: "text",
                  placeholder: "gap-x-10",
                },
                {
                  key: "y",
                  label: "Vertical Gap",
                  type: "text",
                  placeholder: "gap-y-16",
                },
                {
                  key: "yMd",
                  label: "Medium Vertical Gap",
                  type: "text",
                  placeholder: "md:gap-y-10",
                },
              ],
            },
          ],
        },
        {
          key: "spacing",
          label: "Spacing",
          type: "object",
          fields: [
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                {
                  key: "x",
                  label: "Horizontal",
                  type: "text",
                  placeholder: "px-4",
                },
                {
                  key: "y",
                  label: "Vertical",
                  type: "text",
                  placeholder: "py-5",
                },
                {
                  key: "smX",
                  label: "Small Horizontal",
                  type: "text",
                  placeholder: "sm:px-6",
                },
                {
                  key: "smY",
                  label: "Small Vertical",
                  type: "text",
                  placeholder: "sm:py-20",
                },
                {
                  key: "lgX",
                  label: "Large Horizontal",
                  type: "text",
                  placeholder: "lg:px-8",
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
            { key: "eyebrow", label: "Eyebrow Text", type: "text" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
            {
              key: "stats",
              label: "Statistics",
              type: "object",
              fields: [
                {
                  key: "stat1",
                  label: "Stat 1",
                  type: "object",
                  fields: [
                    { key: "value", label: "Value", type: "text" },
                    { key: "label", label: "Label", type: "text" },
                  ],
                },
                {
                  key: "stat2",
                  label: "Stat 2",
                  type: "object",
                  fields: [
                    { key: "value", label: "Value", type: "text" },
                    { key: "label", label: "Label", type: "text" },
                  ],
                },
                {
                  key: "stat3",
                  label: "Stat 3",
                  type: "object",
                  fields: [
                    { key: "value", label: "Value", type: "text" },
                    { key: "label", label: "Label", type: "text" },
                  ],
                },
                {
                  key: "stat4",
                  label: "Stat 4",
                  type: "object",
                  fields: [
                    { key: "value", label: "Value", type: "text" },
                    { key: "label", label: "Label", type: "text" },
                  ],
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
              key: "eyebrow",
              label: "Eyebrow Font",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "section-title text-emerald-700",
                },
                {
                  key: "marginBottom",
                  label: "Margin Bottom",
                  type: "text",
                  placeholder: "mb-3",
                },
              ],
            },
            {
              key: "title",
              label: "Title Font",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "section-title leading-[1.25] text-black",
                },
                {
                  key: "textBalance",
                  label: "Text Balance",
                  type: "text",
                  placeholder: "text-balance",
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
                  placeholder: "section-subtitle-large max-w-3xl",
                },
              ],
            },
            {
              key: "stats",
              label: "Stats Font",
              type: "object",
              fields: [
                {
                  key: "valueClassName",
                  label: "Value CSS Classes",
                  type: "text",
                  placeholder: "text-2xl text-emerald-700",
                },
                {
                  key: "labelClassName",
                  label: "Label CSS Classes",
                  type: "text",
                  placeholder: "text-xl text-black",
                },
                {
                  key: "labelMarginTop",
                  label: "Label Margin Top",
                  type: "text",
                  placeholder: "mt-1",
                },
              ],
            },
          ],
        },
        {
          key: "image",
          label: "Image",
          type: "object",
          fields: [
            { key: "src", label: "Image Source", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "width",
              label: "Width",
              type: "number",
              placeholder: "800",
            },
            {
              key: "height",
              label: "Height",
              type: "number",
              placeholder: "600",
            },
            {
              key: "style",
              label: "Image Style",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "w-full h-full object-cover rounded-[15px]",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "rounded-[15px]",
                },
              ],
            },
            {
              key: "background",
              label: "Background Block",
              type: "object",
              fields: [
                { key: "enabled", label: "Show Green Block", type: "boolean" },
                {
                  key: "color",
                  label: "Background Color",
                  type: "color",
                  placeholder: "#059669",
                },
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "bg-emerald-600 rounded-[10px]",
                },
                {
                  key: "positioning",
                  label: "Positioning",
                  type: "object",
                  fields: [
                    {
                      key: "pr",
                      label: "Padding Right",
                      type: "text",
                      placeholder: "pr-[15px]",
                    },
                    {
                      key: "pb",
                      label: "Padding Bottom",
                      type: "text",
                      placeholder: "pb-[15px]",
                    },
                    {
                      key: "xlPr",
                      label: "XL Padding Right",
                      type: "text",
                      placeholder: "xl:pr-[21px]",
                    },
                    {
                      key: "xlPb",
                      label: "XL Padding Bottom",
                      type: "text",
                      placeholder: "xl:pb-[21px]",
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
              key: "grid",
              label: "Grid Layout",
              type: "object",
              fields: [
                {
                  key: "textCols",
                  label: "Text Columns",
                  type: "text",
                  placeholder: "md:col-span-5",
                },
                {
                  key: "imageCols",
                  label: "Image Columns",
                  type: "text",
                  placeholder: "md:col-span-5",
                },
                {
                  key: "textOrder",
                  label: "Text Order",
                  type: "text",
                  placeholder: "order-2 md:order-2",
                },
                {
                  key: "imageOrder",
                  label: "Image Order",
                  type: "text",
                  placeholder: "order-2 md:order-2",
                },
              ],
            },
            {
              key: "stats",
              label: "Stats Grid",
              type: "object",
              fields: [
                {
                  key: "gridCols",
                  label: "Grid Columns",
                  type: "text",
                  placeholder: "grid-cols-2 sm:grid-cols-4",
                },
                {
                  key: "gap",
                  label: "Gap",
                  type: "text",
                  placeholder: "gap-4",
                },
                {
                  key: "marginTop",
                  label: "Margin Top",
                  type: "text",
                  placeholder: "mt-10",
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
              key: "text",
              label: "Text Animation",
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
              key: "image",
              label: "Image Animation",
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
              key: "stats",
              label: "Stats Animation",
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
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.eyebrow", label: "Eyebrow Text", type: "text" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.description", label: "Description", type: "text" },
        {
          key: "content.stats.stat1.value",
          label: "Stat 1 Value",
          type: "text",
        },
        {
          key: "content.stats.stat1.label",
          label: "Stat 1 Label",
          type: "text",
        },
        {
          key: "content.stats.stat2.value",
          label: "Stat 2 Value",
          type: "text",
        },
        {
          key: "content.stats.stat2.label",
          label: "Stat 2 Label",
          type: "text",
        },
        {
          key: "content.stats.stat3.value",
          label: "Stat 3 Value",
          type: "text",
        },
        {
          key: "content.stats.stat3.label",
          label: "Stat 3 Label",
          type: "text",
        },
        {
          key: "content.stats.stat4.value",
          label: "Stat 4 Value",
          type: "text",
        },
        {
          key: "content.stats.stat4.label",
          label: "Stat 4 Label",
          type: "text",
        },
        { key: "image.src", label: "Image", type: "image" },
        { key: "image.alt", label: "Image Alt Text", type: "text" },
      ],
    },
    {
      id: "halfTextHalfImage3",
      name: "Half Text Half Image 3 - Trusted Partner",
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
              key: "gap",
              label: "Gap",
              type: "object",
              fields: [
                {
                  key: "x",
                  label: "Horizontal Gap",
                  type: "text",
                  placeholder: "gap-x-16",
                },
                {
                  key: "y",
                  label: "Vertical Gap",
                  type: "text",
                  placeholder: "gap-y-16",
                },
              ],
            },
            {
              key: "minHeight",
              label: "Minimum Height",
              type: "text",
              placeholder: "md:min-h-[369px]",
            },
          ],
        },
        {
          key: "spacing",
          label: "Spacing",
          type: "object",
          fields: [
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                {
                  key: "x",
                  label: "Horizontal",
                  type: "text",
                  placeholder: "px-4",
                },
                {
                  key: "y",
                  label: "Vertical",
                  type: "text",
                  placeholder: "pt-12 pb-6",
                },
                {
                  key: "lgY",
                  label: "Large Vertical",
                  type: "text",
                  placeholder: "lg:pt-26 lg:pb-13",
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
            { key: "eyebrow", label: "Eyebrow Text", type: "text" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
            {
              key: "imagePosition",
              label: "Image Position",
              type: "select",
              options: [
                { value: "left", label: "Left" },
                { value: "right", label: "Right" },
              ],
            },
            {
              key: "button",
              label: "Button",
              type: "object",
              fields: [
                { key: "text", label: "Button Text", type: "text" },
                { key: "enabled", label: "Show Button", type: "boolean" },
                {
                  key: "style",
                  label: "Button Style",
                  type: "object",
                  fields: [
                    {
                      key: "width",
                      label: "Width",
                      type: "text",
                      placeholder: "w-[119px] md:w-[148px]",
                    },
                    {
                      key: "height",
                      label: "Height",
                      type: "text",
                      placeholder: "h-[46px] md:h-[52px]",
                    },
                    {
                      key: "backgroundColor",
                      label: "Background Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Button background uses primary color
                    },
                    { 
                      key: "textColor", 
                      label: "Text Color", 
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary" // Button text uses primary color
                    },
                    {
                      key: "borderRadius",
                      label: "Border Radius",
                      type: "text",
                      placeholder: "rounded-[10px]",
                    },
                    {
                      key: "hoverBackgroundColor",
                      label: "Hover Background Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Button hover background uses primary color
                    },
                    {
                      key: "hoverTextColor",
                      label: "Hover Text Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary" // Button hover text uses primary color
                    },
                  ],
                },
              ],
            },
            {
              key: "font",
              label: "Font Settings",
              type: "object",
              fields: [
                {
                  key: "eyebrow",
                  label: "Eyebrow Font",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "text-xs md:text-base xl:text-lg",
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-normal",
                    },
                    { key: "color", label: "Color", type: "color" },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-[22.5px]",
                    },
                  ],
                },
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "section-title-large",
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-normal",
                    },
                    { key: "color", label: "Color", type: "color" },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "lg:leading-[64px]",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "text-sm md:text-sm xl:text-xl",
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-normal",
                    },
                    { key: "color", label: "Color", type: "color" },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-[35px]",
                    },
                  ],
                },
                {
                  key: "button",
                  label: "Button Font",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "text-sm md:text-base xl:text-xl",
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-normal",
                    },
                    { key: "color", label: "Color", type: "color" },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-[22.5px]",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "image",
          label: "Image Settings",
          type: "object",
          fields: [
            { key: "src", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "width",
              label: "Width",
              type: "text",
              placeholder: "w-full md:w-[47.2%]",
            },
            {
              key: "aspectRatio",
              label: "Aspect Ratio",
              type: "text",
              placeholder: "aspect-[800/500]",
            },
            {
              key: "background",
              label: "Background Block",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Show Background Block",
                  type: "boolean",
                },
                { key: "color", label: "Background Color", type: "color" },
                {
                  key: "width",
                  label: "Width",
                  type: "text",
                  placeholder: "w-[54%] md:w-1/2",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "rounded-[5px]",
                },
                {
                  key: "position",
                  label: "Position",
                  type: "text",
                  placeholder: "absolute top-0 left-0",
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
              key: "text",
              label: "Text Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "image",
              label: "Image Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "button",
              label: "Button Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.eyebrow", label: "Eyebrow Text", type: "text" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.description", label: "Description", type: "text" },
        { key: "content.button.text", label: "Button Text", type: "text" },
        { key: "image.src", label: "Image", type: "image" },
        { key: "image.alt", label: "Image Alt Text", type: "text" },
      ],
    },
  ],
};
