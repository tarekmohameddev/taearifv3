import { ComponentStructure } from "./types";

export const cardStructure: ComponentStructure = {
  componentType: "card",
  ThemeTwo: "card",
  variants: [
    {
      id: "card4",
      name: "Card 4 - Property Card",
      ThemeTwo: "card4",
      fields: [
        // ═══════════════════════════════════════════════════════════
        // BASIC FIELDS
        // ═══════════════════════════════════════════════════════════
        { 
          key: "visible", 
          label: "Visible", 
          type: "boolean",
          ThemeTwo: "visible"
        },
        {
          key: "ThemeTwo",
          label: "Theme Two",
          type: "text",
          placeholder: "card4",
          ThemeTwo: "ThemeTwo"
        },
        
        // ═══════════════════════════════════════════════════════════
        // PROPERTY DATA
        // ═══════════════════════════════════════════════════════════
        {
          key: "property",
          label: "Property",
          type: "object",
          ThemeTwo: "property",
          fields: [
            {
              key: "ThemeTwo",
              label: "Theme Two",
              type: "text",
              placeholder: "property",
              ThemeTwo: "ThemeTwo"
            },
            {
              key: "id",
              label: "Property ID",
              type: "text",
              placeholder: "1",
              ThemeTwo: "id"
            },
            {
              key: "image",
              label: "Image URL",
              type: "image",
              ThemeTwo: "image"
            },
            {
              key: "title",
              label: "Property Title",
              type: "text",
              placeholder: "مشروع سكني فاخر",
              ThemeTwo: "title"
            },
            {
              key: "city",
              label: "City",
              type: "text",
              placeholder: "الرياض",
              ThemeTwo: "city"
            },
            {
              key: "district",
              label: "District",
              type: "text",
              placeholder: "حي النرجس",
              ThemeTwo: "district"
            },
            {
              key: "status",
              label: "Status",
              type: "text",
              placeholder: "للبيع",
              ThemeTwo: "status"
            },
            {
              key: "area",
              label: "Area (m²)",
              type: "object",
              ThemeTwo: "area",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "area",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "150",
                  ThemeTwo: "min"
                },
                {
                  key: "max",
                  label: "Max",
                  type: "number",
                  placeholder: "300",
                  ThemeTwo: "max"
                }
              ]
            },
            {
              key: "rooms",
              label: "Rooms",
              type: "object",
              ThemeTwo: "rooms",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "rooms",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "3",
                  ThemeTwo: "min"
                },
                {
                  key: "max",
                  label: "Max",
                  type: "number",
                  placeholder: "5",
                  ThemeTwo: "max"
                }
              ]
            },
            {
              key: "units",
              label: "Units",
              type: "number",
              placeholder: "50",
              ThemeTwo: "units"
            },
            {
              key: "floors",
              label: "Floors",
              type: "object",
              ThemeTwo: "floors",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "floors",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "3",
                  ThemeTwo: "min"
                },
                {
                  key: "max",
                  label: "Max",
                  type: "number",
                  placeholder: "5",
                  ThemeTwo: "max"
                }
              ]
            },
            {
              key: "price",
              label: "Price (SAR)",
              type: "object",
              ThemeTwo: "price",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "price",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "500000",
                  ThemeTwo: "min"
                },
                {
                  key: "max",
                  label: "Max",
                  type: "number",
                  placeholder: "1500000",
                  ThemeTwo: "max"
                }
              ]
            },
            {
              key: "bathrooms",
              label: "Bathrooms",
              type: "object",
              ThemeTwo: "bathrooms",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "bathrooms",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "2",
                  ThemeTwo: "min"
                },
                {
                  key: "max",
                  label: "Max",
                  type: "number",
                  placeholder: "4",
                  ThemeTwo: "max"
                }
              ]
            },
            {
              key: "featured",
              label: "Featured",
              type: "boolean",
              ThemeTwo: "featured"
            },
            {
              key: "url",
              label: "URL",
              type: "text",
              placeholder: "#",
              ThemeTwo: "url"
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
          ThemeTwo: "styling",
          fields: [
            {
              key: "ThemeTwo",
              label: "Theme Two",
              type: "text",
              placeholder: "styling",
              ThemeTwo: "ThemeTwo"
            },
            {
              key: "cardBackgroundColor",
              label: "Card Background Color",
              type: "color",
              ThemeTwo: "cardBackgroundColor"
            },
            {
              key: "cardBorderRadius",
              label: "Card Border Radius",
              type: "text",
              placeholder: "20px",
              ThemeTwo: "cardBorderRadius"
            },
            {
              key: "cardShadow",
              label: "Card Shadow",
              type: "text",
              placeholder: "sm",
              ThemeTwo: "cardShadow"
            },
            {
              key: "cardHoverShadow",
              label: "Card Hover Shadow",
              type: "text",
              placeholder: "md",
              ThemeTwo: "cardHoverShadow"
            },
            {
              key: "featuredBadgeBackground",
              label: "Featured Badge Background",
              type: "color",
              ThemeTwo: "featuredBadgeBackground"
            },
            {
              key: "featuredBadgeTextColor",
              label: "Featured Badge Text Color",
              type: "color",
              ThemeTwo: "featuredBadgeTextColor"
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              ThemeTwo: "titleColor"
            },
            {
              key: "cityDistrictColor",
              label: "City/District Color",
              type: "color",
              ThemeTwo: "cityDistrictColor"
            },
            {
              key: "statusColor",
              label: "Status Color",
              type: "color",
              ThemeTwo: "statusColor"
            },
            {
              key: "dividerColor",
              label: "Divider Color",
              type: "color",
              ThemeTwo: "dividerColor"
            },
            {
              key: "areaIconColor",
              label: "Area Icon Color",
              type: "color",
              ThemeTwo: "areaIconColor"
            },
            {
              key: "areaTextColor",
              label: "Area Text Color",
              type: "color",
              ThemeTwo: "areaTextColor"
            },
            {
              key: "areaLabelColor",
              label: "Area Label Color",
              type: "color",
              ThemeTwo: "areaLabelColor"
            },
            {
              key: "roomsIconColor",
              label: "Rooms Icon Color",
              type: "color",
              ThemeTwo: "roomsIconColor"
            },
            {
              key: "roomsTextColor",
              label: "Rooms Text Color",
              type: "color",
              ThemeTwo: "roomsTextColor"
            },
            {
              key: "roomsLabelColor",
              label: "Rooms Label Color",
              type: "color",
              ThemeTwo: "roomsLabelColor"
            },
            {
              key: "unitsIconColor",
              label: "Units Icon Color",
              type: "color",
              ThemeTwo: "unitsIconColor"
            },
            {
              key: "unitsTextColor",
              label: "Units Text Color",
              type: "color",
              ThemeTwo: "unitsTextColor"
            },
            {
              key: "unitsLabelColor",
              label: "Units Label Color",
              type: "color",
              ThemeTwo: "unitsLabelColor"
            },
            {
              key: "floorsIconColor",
              label: "Floors Icon Color",
              type: "color",
              ThemeTwo: "floorsIconColor"
            },
            {
              key: "floorsTextColor",
              label: "Floors Text Color",
              type: "color",
              ThemeTwo: "floorsTextColor"
            },
            {
              key: "floorsLabelColor",
              label: "Floors Label Color",
              type: "color",
              ThemeTwo: "floorsLabelColor"
            },
            {
              key: "priceBackgroundColor",
              label: "Price Background Color",
              type: "color",
              ThemeTwo: "priceBackgroundColor"
            },
            {
              key: "priceTextColor",
              label: "Price Text Color",
              type: "color",
              ThemeTwo: "priceTextColor"
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
          ThemeTwo: "typography",
          fields: [
            {
              key: "ThemeTwo",
              label: "Theme Two",
              type: "text",
              placeholder: "typography",
              ThemeTwo: "ThemeTwo"
            },
            {
              key: "title",
              label: "Title Typography",
              type: "object",
              ThemeTwo: "title",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "title",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                  placeholder: "xl",
                  ThemeTwo: "fontSize"
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "bold",
                  ThemeTwo: "fontWeight"
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                  ThemeTwo: "fontFamily"
                }
              ]
            },
            {
              key: "cityDistrict",
              label: "City/District Typography",
              type: "object",
              ThemeTwo: "cityDistrict",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "cityDistrict",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                  placeholder: "sm",
                  ThemeTwo: "fontSize"
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal",
                  ThemeTwo: "fontWeight"
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                  ThemeTwo: "fontFamily"
                }
              ]
            },
            {
              key: "status",
              label: "Status Typography",
              type: "object",
              ThemeTwo: "status",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "status",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                  placeholder: "lg",
                  ThemeTwo: "fontSize"
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "semibold",
                  ThemeTwo: "fontWeight"
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                  ThemeTwo: "fontFamily"
                }
              ]
            },
            {
              key: "detailLabel",
              label: "Detail Label Typography",
              type: "object",
              ThemeTwo: "detailLabel",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "detailLabel",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                  placeholder: "xs",
                  ThemeTwo: "fontSize"
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal",
                  ThemeTwo: "fontWeight"
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                  ThemeTwo: "fontFamily"
                }
              ]
            },
            {
              key: "detailValue",
              label: "Detail Value Typography",
              type: "object",
              ThemeTwo: "detailValue",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "detailValue",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                  placeholder: "sm",
                  ThemeTwo: "fontSize"
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "medium",
                  ThemeTwo: "fontWeight"
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                  ThemeTwo: "fontFamily"
                }
              ]
            },
            {
              key: "price",
              label: "Price Typography",
              type: "object",
              ThemeTwo: "price",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "price",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                  placeholder: "base",
                  ThemeTwo: "fontSize"
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "medium",
                  ThemeTwo: "fontWeight"
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                  ThemeTwo: "fontFamily"
                }
              ]
            }
          ]
        },
        
        // ═══════════════════════════════════════════════════════════
        // RESPONSIVE
        // ═══════════════════════════════════════════════════════════
        {
          key: "responsive",
          label: "Responsive",
          type: "object",
          ThemeTwo: "responsive",
          fields: [
            {
              key: "ThemeTwo",
              label: "Theme Two",
              type: "text",
              placeholder: "responsive",
              ThemeTwo: "ThemeTwo"
            },
            {
              key: "imageHeight",
              label: "Image Height",
              type: "object",
              ThemeTwo: "imageHeight",
              fields: [
                {
                  key: "ThemeTwo",
                  label: "Theme Two",
                  type: "text",
                  placeholder: "imageHeight",
                  ThemeTwo: "ThemeTwo"
                },
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "250px",
                  ThemeTwo: "mobile"
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "300px",
                  ThemeTwo: "tablet"
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "337px",
                  ThemeTwo: "desktop"
                }
              ]
            }
          ]
        }
      ],
      
      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean", ThemeTwo: "visible" },
        { key: "property.title", label: "Property Title", type: "text", ThemeTwo: "title" },
        { key: "property.city", label: "City", type: "text", ThemeTwo: "city" },
        { key: "property.district", label: "District", type: "text", ThemeTwo: "district" },
        { key: "property.status", label: "Status", type: "text", ThemeTwo: "status" },
        { key: "property.price", label: "Price", type: "object", ThemeTwo: "price" }
      ]
    }
  ]
};

