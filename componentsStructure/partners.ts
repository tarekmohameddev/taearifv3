import { ComponentStructure } from "./types";

export const partnersStructure: ComponentStructure = {
  componentType: "partners",
  variants: [
    {
      id: "partners1",
      name: "Partners 1 - Trusted Partners Grid",
      fields: [
        // ═══════════════════════════════════════════════════════════
        // BASIC FIELDS
        // ═══════════════════════════════════════════════════════════
        { 
          key: "visible", 
          label: "Visible", 
          type: "boolean" 
        },
        
        // ═══════════════════════════════════════════════════════════
        // LAYOUT CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "1600px"
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
                  placeholder: "5rem"
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                  placeholder: "5rem"
                }
              ]
            }
          ]
        },
        
        // ═══════════════════════════════════════════════════════════
        // CONTENT
        // ═══════════════════════════════════════════════════════════
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Section Title",
              type: "text",
              placeholder: "موثوق من خبراء العقار. في جميع أنحاء المملكة."
            },
            {
              key: "titleHighlight",
              label: "Title Highlight Text",
              type: "text",
              placeholder: "خبراء العقار."
            },
            {
              key: "description",
              label: "Section Description",
              type: "text",
              placeholder: "من المسوّقين إلى المكاتب والمطوّرين..."
            }
          ]
        },
        
        // ═══════════════════════════════════════════════════════════
        // PARTNERS ARRAY - Dynamic Images
        // ═══════════════════════════════════════════════════════════
        {
          key: "partners",
          label: "Partners",
          type: "array",
          addLabel: "Add Partner",
          itemLabel: "Partner",
          of: [
            {
              key: "src",
              label: "Partner Logo",
              type: "image"
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Partner Logo"
            }
          ]
        },
        
        // ═══════════════════════════════════════════════════════════
        // GRID CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "grid",
          label: "Grid Settings",
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
                  placeholder: "2"
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "number",
                  placeholder: "3"
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "number",
                  placeholder: "6"
                }
              ]
            },
            {
              key: "gap",
              label: "Gap Between Cards",
              type: "text",
              placeholder: "2rem"
            }
          ]
        },
        
        // ═══════════════════════════════════════════════════════════
        // STYLING
        // ═══════════════════════════════════════════════════════════
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "backgroundColor",
              label: "Background Color",
              type: "color",
              defaultValue: "transparent"
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Title color uses primary color from branding
            },
            {
              key: "titleHighlightColor",
              label: "Title Highlight Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Title highlight color uses primary color from branding
            },
            {
              key: "descriptionColor",
              label: "Description Color",
              type: "color"
            },
            {
              key: "cardBackgroundColor",
              label: "Card Background Color",
              type: "color"
            },
            {
              key: "cardHoverBackgroundColor",
              label: "Card Hover Background Color",
              type: "color"
            },
            {
              key: "logoOpacity",
              label: "Logo Opacity",
              type: "number",
              placeholder: "0.7"
            },
            {
              key: "logoHoverOpacity",
              label: "Logo Hover Opacity",
              type: "number",
              placeholder: "1.0"
            }
          ]
        },
        
        // ═══════════════════════════════════════════════════════════
        // TYPOGRAPHY
        // ═══════════════════════════════════════════════════════════
        {
          key: "typography",
          label: "Typography",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Title Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "2xl"
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "4xl"
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "6xl"
                    }
                  ]
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "bold"
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal"
                },
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "tight"
                }
              ]
            },
            {
              key: "description",
              label: "Description Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "base"
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "lg"
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "xl"
                    }
                  ]
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal"
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal"
                },
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "relaxed"
                }
              ]
            }
          ]
        },
        
        // ═══════════════════════════════════════════════════════════
        // ANIMATION SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "animation",
          label: "Animation",
          type: "object",
          fields: [
            {
              key: "enabled",
              label: "Enable Animation",
              type: "boolean"
            },
            {
              key: "type",
              label: "Animation Type",
              type: "text",
              placeholder: "fade-up"
            },
            {
              key: "duration",
              label: "Duration (ms)",
              type: "number",
              placeholder: "1000"
            },
            {
              key: "threshold",
              label: "Intersection Threshold",
              type: "number",
              placeholder: "0.1"
            }
          ]
        }
      ],
      
      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.titleHighlight", label: "Title Highlight", type: "text" },
        { key: "content.description", label: "Description", type: "text" },
        {
          key: "partners",
          label: "Partners",
          type: "array",
          addLabel: "Add Partner",
          itemLabel: "Partner",
          of: [
            {
              key: "src",
              label: "Partner Logo",
              type: "image"
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Partner Logo"
            }
          ]
        }
      ]
    }
  ]
};

