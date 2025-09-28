import { ComponentStructure } from "./types";

export const ctaValuationStructure: ComponentStructure = {
  componentType: "ctaValuation",
  variants: [
    {
      id: "ctaValuation1",
      name: "CTA Valuation 1 - Modern Design",
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
              key: "description1",
              label: "title",
              type: "text",
            },
            {
              key: "description2",
              label: "Description",
              type: "text",
            },
            {
              key: "buttonText",
              label: "Button Text",
              type: "text",
            },
            {
              key: "buttonUrl",
              label: "Button URL",
              type: "text",
            },
          ],
        },
        {
          key: "image",
          label: "Image",
          type: "object",
          fields: [
            {
              key: "src",
              label: "Image Source",
              type: "image",
            },
            {
              key: "alt",
              label: "Image Alt Text",
              type: "text",
            },
            {
              key: "width",
              label: "Image Width",
              type: "number",
            },
            {
              key: "height",
              label: "Image Height",
              type: "number",
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
              key: "buttonBgColor",
              label: "Button Background Color",
              type: "text",
            },
            {
              key: "buttonTextColor",
              label: "Button Text Color",
              type: "text",
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.description1", label: "title", type: "text" },
        { key: "content.description2", label: "Description", type: "text" },
        { key: "content.buttonText", label: "Button Text", type: "text" },
        { key: "content.buttonUrl", label: "Button URL", type: "text" },
        { key: "image.src", label: "Image Source", type: "image" },
        { key: "image.alt", label: "Image Alt Text", type: "text" },
        { key: "styling.bgColor", label: "Background Color", type: "text" },
        { key: "styling.textColor", label: "Text Color", type: "text" },
        { key: "styling.buttonBgColor", label: "Button Background Color", type: "text" },
        { key: "styling.buttonTextColor", label: "Button Text Color", type: "text" },
      ],
    },
  ],
};