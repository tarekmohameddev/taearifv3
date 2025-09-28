import { ComponentStructure } from "./types";

// Validation schema for header data
const validateHeaderData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['visible', 'menu', 'logo', 'colors'];
  return requiredFields.every(field => field in data);
};

export const headerStructure: ComponentStructure = {
  componentType: "header",
  variants: [
    {
      id: "header1",
      name: "Header 1 - Modern",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "position",
          label: "Position",
          type: "object",
          fields: [
            {
              key: "type",
              label: "Type",
              type: "select",
              options: [
                { label: "Static", value: "static" },
                { label: "Sticky", value: "sticky" },
                { label: "Fixed", value: "fixed" },
              ],
            },
            { key: "top", label: "Top (px)", type: "number" },
            { key: "zIndex", label: "Z-Index", type: "number" },
          ],
        },
        {
          key: "height",
          label: "Heights",
          type: "object",
          fields: [
            { key: "desktop", label: "Desktop (px)", type: "number" },
            { key: "tablet", label: "Tablet (px)", type: "number" },
            { key: "mobile", label: "Mobile (px)", type: "number" },
          ],
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            {
              key: "type",
              label: "Mode",
              type: "select",
              options: [
                { label: "Solid", value: "solid" },
                { label: "Gradient", value: "gradient" },
              ],
            },
            {
              key: "opacity",
              label: "Opacity (0-1)",
              type: "text",
              placeholder: "0.95",
            },
            { key: "blur", label: "Blur (Backdrop)", type: "boolean" },
            {
              key: "colors",
              label: "Colors",
              type: "object",
              fields: [
                { key: "from", label: "From", type: "color" },
                { key: "to", label: "To", type: "color" },
              ],
            },
          ],
        },
        {
          key: "colors",
          label: "Colors",
          type: "object",
          fields: [
            { key: "text", label: "Text Color", type: "color" },
            { key: "link", label: "Nav Link Color", type: "color" },
            { key: "linkHover", label: "Nav Link Hover", type: "color" },
            { key: "linkActive", label: "Nav Link Active", type: "color" },
            { key: "icon", label: "Icon Color", type: "color" },
            { key: "iconHover", label: "Icon Hover", type: "color" },
            { key: "border", label: "Border Color", type: "color" },
            { key: "accent", label: "Accent Color", type: "color" },
          ],
        },
        {
          key: "logo",
          label: "Logo",
          type: "object",
          fields: [
            {
              key: "type",
              label: "Type",
              type: "select",
              options: [
                { label: "Image+Text", value: "image+text" },
                { label: "Image Only", value: "image" },
                { label: "Text Only", value: "text" },
              ],
            },
            { key: "image", label: "Image URL", type: "image" },
            { key: "text", label: "Text", type: "text" },
            {
              key: "font",
              label: "Font",
              type: "object",
              fields: [
                { key: "family", label: "Family", type: "text" },
                { key: "size", label: "Size (px)", type: "number" },
                {
                  key: "weight",
                  label: "Weight",
                  type: "select",
                  options: [
                    { label: "Regular", value: "normal" },
                    { label: "Medium", value: "500" },
                    { label: "Semi Bold", value: "600" },
                    { label: "Bold", value: "bold" },
                  ],
                },
              ],
            },
            { key: "url", label: "URL", type: "text" },
            {
              key: "clickAction",
              label: "Click Action",
              type: "select",
              options: [
                { label: "Navigate", value: "navigate" },
                { label: "None", value: "none" },
              ],
            },
          ],
        },
        {
          key: "menu",
          label: "Menu Items",
          type: "array",
          addLabel: "Add Item",
          itemLabel: "Item",
          of: [
            {
              key: "type",
              label: "Type",
              type: "select",
              options: [
                { label: "Link", value: "link" },
                { label: "Mega Menu", value: "mega_menu" },
                { label: "Dropdown", value: "dropdown" },
                { label: "Button", value: "button" },
              ],
            },
            { key: "text", label: "Text", type: "text" },
            { key: "icon", label: "Icon (name)", type: "text" },
            { key: "url", label: "URL", type: "text" },
            {
              key: "dynamicData",
              label: "Dynamic Data",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "source", label: "Source API", type: "text" },
                {
                  key: "mapping",
                  label: "Mapping",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label Field", type: "text" },
                    { key: "url", label: "URL Pattern", type: "text" },
                  ],
                },
              ],
            },
            {
              key: "submenu",
              label: "Submenu",
              type: "array",
              addLabel: "Add Subsection",
              itemLabel: "Section",
              of: [
                {
                  key: "type",
                  label: "Type",
                  type: "select",
                  options: [
                    { label: "Section", value: "section" },
                    { label: "Links", value: "links" },
                  ],
                },
                { key: "title", label: "Title", type: "text" },
                {
                  key: "items",
                  label: "Items",
                  type: "array",
                  addLabel: "Add Item",
                  itemLabel: "Item",
                  of: [
                    { key: "text", label: "Label", type: "text" },
                    { key: "url", label: "URL", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "actions",
          label: "Actions",
          type: "object",
          fields: [
            {
              key: "search",
              label: "Search",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "placeholder", label: "Placeholder", type: "text" },
                {
                  key: "searchType",
                  label: "Type",
                  type: "select",
                  options: [
                    { label: "Global", value: "global" },
                    { label: "Products", value: "products" },
                  ],
                },
                {
                  key: "liveSuggestions",
                  label: "Live Suggestions",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "api", label: "API", type: "text" },
                  ],
                },
              ],
            },
            {
              key: "user",
              label: "User Actions",
              type: "object",
              fields: [
                { key: "showProfile", label: "Show Profile", type: "boolean" },
                { key: "showCart", label: "Show Cart", type: "boolean" },
                { key: "showWishlist", label: "Show Wishlist", type: "boolean" },
                { key: "showNotifications", label: "Show Notifications", type: "boolean" },
              ],
            },
            {
              key: "mobile",
              label: "Mobile Menu",
              type: "object",
              fields: [
                { key: "showLogo", label: "Show Logo in Mobile Menu", type: "boolean" },
                { key: "showLanguageToggle", label: "Show Language Toggle", type: "boolean" },
                { key: "showSearch", label: "Show Search in Mobile Menu", type: "boolean" },
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
              key: "breakpoints",
              label: "Breakpoints",
              type: "object",
              fields: [
                { key: "mobile", label: "Mobile (px)", type: "number" },
                { key: "tablet", label: "Tablet (px)", type: "number" },
                { key: "desktop", label: "Desktop (px)", type: "number" },
              ],
            },
            {
              key: "mobileMenu",
              label: "Mobile Menu",
              type: "object",
              fields: [
                { key: "side", label: "Side", type: "select", options: [
                  { label: "Left", value: "left" },
                  { label: "Right", value: "right" },
                ]},
                { key: "width", label: "Width (px)", type: "number" },
                { key: "overlay", label: "Show Overlay", type: "boolean" },
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
              key: "menuItems",
              label: "Menu Items",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "mobileMenu",
              label: "Mobile Menu",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "easing", label: "Easing", type: "text" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "background.type",
          label: "Background Mode",
          type: "select",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Gradient", value: "gradient" },
          ],
        },
        {
          key: "background.colors.from",
          label: "Background From",
          type: "color",
        },
        { key: "background.colors.to", label: "Background To", type: "color" },
        { key: "colors.text", label: "Text Color", type: "color" },
        { key: "colors.link", label: "Nav Link", type: "color" },
        { key: "colors.linkHover", label: "Nav Link Hover", type: "color" },
        { key: "colors.linkActive", label: "Nav Link Active", type: "color" },
        { key: "colors.icon", label: "Icon", type: "color" },
        { key: "colors.iconHover", label: "Icon Hover", type: "color" },
        { key: "colors.border", label: "Border", type: "color" },
        { key: "colors.accent", label: "Accent", type: "color" },
        { key: "logo.image", label: "Logo Image", type: "image" },
        { key: "logo.text", label: "Logo Text", type: "text" },
      ],
    },
  ],
};
