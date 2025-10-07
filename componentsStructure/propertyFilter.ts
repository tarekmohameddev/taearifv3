import { ComponentStructure } from "./types";

export const propertyFilterStructure: ComponentStructure = {
  componentType: "propertyFilter",
  variants: [
    {
      id: "propertyFilter1",
      name: "Property Filter 1 - Search & Filter Form",
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
              key: "searchPlaceholder",
              label: "Search Input Placeholder",
              type: "text",
            },
            {
              key: "propertyTypePlaceholder",
              label: "Property Type Placeholder",
              type: "text",
            },
            {
              key: "pricePlaceholder",
              label: "Price Input Placeholder",
              type: "text",
            },
            {
              key: "searchButtonText",
              label: "Search Button Text",
              type: "text",
            },
            {
              key: "noResultsText",
              label: "No Results Text",
              type: "text",
            },
            {
              key: "propertyTypes",
              label: "Property Types List",
              type: "array",
              itemType: "text",
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "form",
              label: "Form Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
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
                  key: "gap",
                  label: "Gap Between Fields",
                  type: "text",
                },
              ],
            },
            {
              key: "inputs",
              label: "Input Fields Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
                  type: "text",
                },
                {
                  key: "borderColor",
                  label: "Border Color",
                  type: "text",
                },
                {
                  key: "textColor",
                  label: "Text Color",
                  type: "text",
                },
                {
                  key: "placeholderColor",
                  label: "Placeholder Color",
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
                  key: "height",
                  label: "Height",
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
              key: "dropdown",
              label: "Dropdown Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
                  type: "text",
                },
                {
                  key: "borderColor",
                  label: "Border Color",
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
                  key: "maxHeight",
                  label: "Max Height",
                  type: "text",
                },
                {
                  key: "shadow",
                  label: "Box Shadow",
                  type: "text",
                },
              ],
            },
            {
              key: "searchButton",
              label: "Search Button Styling",
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
                {
                  key: "fontWeight",
                  label: "Font Weight",
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
              key: "formLayout",
              label: "Form Layout",
              type: "select",
              options: [
                { label: "Grid", value: "grid" },
                { label: "Flex", value: "flex" },
              ],
            },
            {
              key: "responsive",
              label: "Responsive Settings",
              type: "object",
              fields: [
                {
                  key: "mobileColumns",
                  label: "Mobile Grid Columns",
                  type: "number",
                },
                {
                  key: "tabletColumns",
                  label: "Tablet Grid Columns",
                  type: "number",
                },
                {
                  key: "desktopColumns",
                  label: "Desktop Grid Columns",
                  type: "number",
                },
              ],
            },
            {
              key: "fieldWidths",
              label: "Field Widths",
              type: "object",
              fields: [
                {
                  key: "searchWidth",
                  label: "Search Field Width",
                  type: "text",
                },
                {
                  key: "typeWidth",
                  label: "Type Field Width",
                  type: "text",
                },
                {
                  key: "priceWidth",
                  label: "Price Field Width",
                  type: "text",
                },
                {
                  key: "buttonWidth",
                  label: "Button Width",
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
                  key: "marginBottom",
                  label: "Margin Bottom",
                  type: "text",
                },
                {
                  key: "gap",
                  label: "Gap Between Fields",
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
          key: "content.searchPlaceholder",
          label: "Search Input Placeholder",
          type: "text",
        },
        {
          key: "content.propertyTypePlaceholder",
          label: "Property Type Placeholder",
          type: "text",
        },
        {
          key: "content.pricePlaceholder",
          label: "Price Input Placeholder",
          type: "text",
        },
        {
          key: "content.searchButtonText",
          label: "Search Button Text",
          type: "text",
        },
        {
          key: "content.noResultsText",
          label: "No Results Text",
          type: "text",
        },
        {
          key: "styling.form.bgColor",
          label: "Form Background Color",
          type: "text",
        },
        {
          key: "styling.form.borderRadius",
          label: "Form Border Radius",
          type: "text",
        },
        { key: "styling.form.padding", label: "Form Padding", type: "text" },
        { key: "styling.form.gap", label: "Form Gap", type: "text" },
        {
          key: "styling.inputs.bgColor",
          label: "Input Background Color",
          type: "text",
        },
        {
          key: "styling.inputs.borderColor",
          label: "Input Border Color",
          type: "text",
        },
        {
          key: "styling.inputs.textColor",
          label: "Input Text Color",
          type: "text",
        },
        {
          key: "styling.inputs.placeholderColor",
          label: "Input Placeholder Color",
          type: "text",
        },
        {
          key: "styling.inputs.borderRadius",
          label: "Input Border Radius",
          type: "text",
        },
        { key: "styling.inputs.padding", label: "Input Padding", type: "text" },
        { key: "styling.inputs.height", label: "Input Height", type: "text" },
        {
          key: "styling.inputs.fontSize",
          label: "Input Font Size",
          type: "text",
        },
        {
          key: "styling.dropdown.bgColor",
          label: "Dropdown Background Color",
          type: "text",
        },
        {
          key: "styling.dropdown.borderColor",
          label: "Dropdown Border Color",
          type: "text",
        },
        {
          key: "styling.dropdown.textColor",
          label: "Dropdown Text Color",
          type: "text",
        },
        {
          key: "styling.dropdown.hoverBgColor",
          label: "Dropdown Hover Background Color",
          type: "text",
        },
        {
          key: "styling.dropdown.borderRadius",
          label: "Dropdown Border Radius",
          type: "text",
        },
        {
          key: "styling.dropdown.maxHeight",
          label: "Dropdown Max Height",
          type: "text",
        },
        {
          key: "styling.dropdown.shadow",
          label: "Dropdown Box Shadow",
          type: "text",
        },
        {
          key: "styling.searchButton.bgColor",
          label: "Search Button Background Color",
          type: "text",
        },
        {
          key: "styling.searchButton.textColor",
          label: "Search Button Text Color",
          type: "text",
        },
        {
          key: "styling.searchButton.hoverBgColor",
          label: "Search Button Hover Background Color",
          type: "text",
        },
        {
          key: "styling.searchButton.borderRadius",
          label: "Search Button Border Radius",
          type: "text",
        },
        {
          key: "styling.searchButton.padding",
          label: "Search Button Padding",
          type: "text",
        },
        {
          key: "styling.searchButton.fontSize",
          label: "Search Button Font Size",
          type: "text",
        },
        {
          key: "styling.searchButton.fontWeight",
          label: "Search Button Font Weight",
          type: "text",
        },
        { key: "layout.formLayout", label: "Form Layout", type: "select" },
        {
          key: "layout.responsive.mobileColumns",
          label: "Mobile Grid Columns",
          type: "number",
        },
        {
          key: "layout.responsive.tabletColumns",
          label: "Tablet Grid Columns",
          type: "number",
        },
        {
          key: "layout.responsive.desktopColumns",
          label: "Desktop Grid Columns",
          type: "number",
        },
        {
          key: "layout.fieldWidths.searchWidth",
          label: "Search Field Width",
          type: "text",
        },
        {
          key: "layout.fieldWidths.typeWidth",
          label: "Type Field Width",
          type: "text",
        },
        {
          key: "layout.fieldWidths.priceWidth",
          label: "Price Field Width",
          type: "text",
        },
        {
          key: "layout.fieldWidths.buttonWidth",
          label: "Button Width",
          type: "text",
        },
        {
          key: "layout.spacing.marginBottom",
          label: "Margin Bottom",
          type: "text",
        },
        {
          key: "layout.spacing.gap",
          label: "Gap Between Fields",
          type: "text",
        },
      ],
    },
  ],
};
