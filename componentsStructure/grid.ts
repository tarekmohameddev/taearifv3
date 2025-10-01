import { ComponentStructure } from "./types";

export const gridStructure: ComponentStructure = {
  componentType: "grid",
  variants: [
    {
      id: "grid1",
      name: "Property Grid 1 - Standard Layout",
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
              key: "title",
              label: "Section Title",
              type: "text",
            },
            {
              key: "subtitle",
              label: "Section Subtitle",
              type: "text",
            },
            {
              key: "emptyMessage",
              label: "Empty State Message",
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
              key: "titleColor",
              label: "Title Color",
              type: "text",
            },
            {
              key: "subtitleColor",
              label: "Subtitle Color",
              type: "text",
            },
            {
              key: "gridGap",
              label: "Grid Gap",
              type: "text",
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
            },
          ],
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "columns",
              label: "Grid Columns",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "number",
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "number",
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "number",
                },
                {
                  key: "large",
                  label: "Large Desktop Columns",
                  type: "number",
                },
              ],
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                {
                  key: "top",
                  label: "Top Padding",
                  type: "text",
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                },
                {
                  key: "horizontal",
                  label: "Horizontal Padding",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Section Title", type: "text" },
        { key: "content.subtitle", label: "Section Subtitle", type: "text" },
        {
          key: "content.emptyMessage",
          label: "Empty State Message",
          type: "text",
        },
        { key: "styling.bgColor", label: "Background Color", type: "text" },
        { key: "styling.textColor", label: "Text Color", type: "text" },
        { key: "styling.titleColor", label: "Title Color", type: "text" },
        { key: "styling.subtitleColor", label: "Subtitle Color", type: "text" },
        { key: "styling.gridGap", label: "Grid Gap", type: "text" },
        { key: "styling.maxWidth", label: "Max Width", type: "text" },
        {
          key: "layout.columns.mobile",
          label: "Mobile Columns",
          type: "number",
        },
        {
          key: "layout.columns.tablet",
          label: "Tablet Columns",
          type: "number",
        },
        {
          key: "layout.columns.desktop",
          label: "Desktop Columns",
          type: "number",
        },
        {
          key: "layout.columns.large",
          label: "Large Desktop Columns",
          type: "number",
        },
        { key: "layout.padding.top", label: "Top Padding", type: "text" },
        { key: "layout.padding.bottom", label: "Bottom Padding", type: "text" },
        {
          key: "layout.padding.horizontal",
          label: "Horizontal Padding",
          type: "text",
        },
      ],
    },
  ],
};
