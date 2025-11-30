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
                  globalColorType: "primary", // Background uses primary color (with 10% opacity applied)
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
                  globalColorType: "primary", // Step titles use primary color from branding
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
            {
              key: "header",
              label: "Header Styling",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Header Title Color",
                  type: "object",
                  fields: [
                    {
                      key: "color",
                      label: "Header Title Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Header title uses primary color from branding
                    },
                  ],
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
              globalColorType: "primary", // Background uses primary color (with 10% opacity applied)
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
                {
                  key: "color",
                  label: "Title Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Header title uses primary color from branding
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
                  key: "name",
                  label: "Icon Name",
                  type: "select",
                  showIcons: true, // Flag to show icons in dropdown
                  options: [
                    // Lucide Icons - Most Common for Steps
                    { value: "Search", label: "Search", iconLibrary: "lucide" },
                    { value: "FileText", label: "File Text", iconLibrary: "lucide" },
                    { value: "Camera", label: "Camera", iconLibrary: "lucide" },
                    { value: "Megaphone", label: "Megaphone", iconLibrary: "lucide" },
                    { value: "Globe", label: "Globe", iconLibrary: "lucide" },
                    { value: "Users", label: "Users", iconLibrary: "lucide" },
                    { value: "Home", label: "Home", iconLibrary: "lucide" },
                    { value: "Building2", label: "Building", iconLibrary: "lucide" },
                    { value: "MapPin", label: "Map Pin", iconLibrary: "lucide" },
                    { value: "Phone", label: "Phone", iconLibrary: "lucide" },
                    { value: "Mail", label: "Mail", iconLibrary: "lucide" },
                    { value: "CheckCircle", label: "Check Circle", iconLibrary: "lucide" },
                    { value: "Award", label: "Award", iconLibrary: "lucide" },
                    { value: "Shield", label: "Shield", iconLibrary: "lucide" },
                    { value: "Target", label: "Target", iconLibrary: "lucide" },
                    { value: "Rocket", label: "Rocket", iconLibrary: "lucide" },
                    { value: "Lightbulb", label: "Lightbulb", iconLibrary: "lucide" },
                    { value: "BarChart", label: "Bar Chart", iconLibrary: "lucide" },
                    { value: "UserCheck", label: "User Check", iconLibrary: "lucide" },
                    { value: "Handshake", label: "Handshake", iconLibrary: "lucide" },
                    { value: "Calendar", label: "Calendar", iconLibrary: "lucide" },
                    { value: "Clock", label: "Clock", iconLibrary: "lucide" },
                    { value: "MessageSquare", label: "Message Square", iconLibrary: "lucide" },
                    { value: "Send", label: "Send", iconLibrary: "lucide" },
                    { value: "Edit", label: "Edit", iconLibrary: "lucide" },
                    { value: "Save", label: "Save", iconLibrary: "lucide" },
                    { value: "Upload", label: "Upload", iconLibrary: "lucide" },
                    { value: "Download", label: "Download", iconLibrary: "lucide" },
                    { value: "Key", label: "Key", iconLibrary: "lucide" },
                    { value: "Lock", label: "Lock", iconLibrary: "lucide" },
                    { value: "Filter", label: "Filter", iconLibrary: "lucide" },
                    { value: "Share", label: "Share", iconLibrary: "lucide" },
                    // React Icons - Font Awesome
                    { value: "FaHome", label: "Home (FA)", iconLibrary: "react-icons" },
                    { value: "FaBuilding", label: "Building (FA)", iconLibrary: "react-icons" },
                    { value: "FaSearch", label: "Search (FA)", iconLibrary: "react-icons" },
                    { value: "FaFileAlt", label: "File (FA)", iconLibrary: "react-icons" },
                    { value: "FaCamera", label: "Camera (FA)", iconLibrary: "react-icons" },
                    { value: "FaUsers", label: "Users (FA)", iconLibrary: "react-icons" },
                    { value: "FaPhone", label: "Phone (FA)", iconLibrary: "react-icons" },
                    { value: "FaEnvelope", label: "Envelope (FA)", iconLibrary: "react-icons" },
                    // React Icons - Material Design
                    { value: "MdHome", label: "Home (MD)", iconLibrary: "react-icons" },
                    { value: "MdBusiness", label: "Business (MD)", iconLibrary: "react-icons" },
                    { value: "MdSearch", label: "Search (MD)", iconLibrary: "react-icons" },
                    { value: "MdDescription", label: "Description (MD)", iconLibrary: "react-icons" },
                    { value: "MdCameraAlt", label: "Camera (MD)", iconLibrary: "react-icons" },
                    { value: "MdPeople", label: "People (MD)", iconLibrary: "react-icons" },
                    { value: "MdPhone", label: "Phone (MD)", iconLibrary: "react-icons" },
                    { value: "MdEmail", label: "Email (MD)", iconLibrary: "react-icons" },
                    { value: "MdCheckCircle", label: "Check Circle (MD)", iconLibrary: "react-icons" },
                    { value: "MdTrendingUp", label: "Trending Up (MD)", iconLibrary: "react-icons" },
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
                  globalColorType: "primary", // Step titles use primary color from branding
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
                  key: "name",
                  label: "Icon Name",
                  type: "select",
                  showIcons: true, // Flag to show icons in dropdown
                  options: [
                    // Lucide Icons - Most Common for Steps
                    { value: "Search", label: "Search", iconLibrary: "lucide" },
                    { value: "FileText", label: "File Text", iconLibrary: "lucide" },
                    { value: "Camera", label: "Camera", iconLibrary: "lucide" },
                    { value: "Megaphone", label: "Megaphone", iconLibrary: "lucide" },
                    { value: "Globe", label: "Globe", iconLibrary: "lucide" },
                    { value: "Users", label: "Users", iconLibrary: "lucide" },
                    { value: "Home", label: "Home", iconLibrary: "lucide" },
                    { value: "Building2", label: "Building", iconLibrary: "lucide" },
                    { value: "MapPin", label: "Map Pin", iconLibrary: "lucide" },
                    { value: "Phone", label: "Phone", iconLibrary: "lucide" },
                    { value: "Mail", label: "Mail", iconLibrary: "lucide" },
                    { value: "CheckCircle", label: "Check Circle", iconLibrary: "lucide" },
                    { value: "Award", label: "Award", iconLibrary: "lucide" },
                    { value: "Shield", label: "Shield", iconLibrary: "lucide" },
                    { value: "Target", label: "Target", iconLibrary: "lucide" },
                    { value: "Rocket", label: "Rocket", iconLibrary: "lucide" },
                    { value: "Lightbulb", label: "Lightbulb", iconLibrary: "lucide" },
                    { value: "BarChart", label: "Bar Chart", iconLibrary: "lucide" },
                    { value: "UserCheck", label: "User Check", iconLibrary: "lucide" },
                    { value: "Handshake", label: "Handshake", iconLibrary: "lucide" },
                    { value: "Calendar", label: "Calendar", iconLibrary: "lucide" },
                    { value: "Clock", label: "Clock", iconLibrary: "lucide" },
                    { value: "MessageSquare", label: "Message Square", iconLibrary: "lucide" },
                    { value: "Send", label: "Send", iconLibrary: "lucide" },
                    { value: "Edit", label: "Edit", iconLibrary: "lucide" },
                    { value: "Save", label: "Save", iconLibrary: "lucide" },
                    { value: "Upload", label: "Upload", iconLibrary: "lucide" },
                    { value: "Download", label: "Download", iconLibrary: "lucide" },
                    { value: "Key", label: "Key", iconLibrary: "lucide" },
                    { value: "Lock", label: "Lock", iconLibrary: "lucide" },
                    { value: "Filter", label: "Filter", iconLibrary: "lucide" },
                    { value: "Share", label: "Share", iconLibrary: "lucide" },
                    // React Icons - Font Awesome
                    { value: "FaHome", label: "Home (FA)", iconLibrary: "react-icons" },
                    { value: "FaBuilding", label: "Building (FA)", iconLibrary: "react-icons" },
                    { value: "FaSearch", label: "Search (FA)", iconLibrary: "react-icons" },
                    { value: "FaFileAlt", label: "File (FA)", iconLibrary: "react-icons" },
                    { value: "FaCamera", label: "Camera (FA)", iconLibrary: "react-icons" },
                    { value: "FaUsers", label: "Users (FA)", iconLibrary: "react-icons" },
                    { value: "FaPhone", label: "Phone (FA)", iconLibrary: "react-icons" },
                    { value: "FaEnvelope", label: "Envelope (FA)", iconLibrary: "react-icons" },
                    // React Icons - Material Design
                    { value: "MdHome", label: "Home (MD)", iconLibrary: "react-icons" },
                    { value: "MdBusiness", label: "Business (MD)", iconLibrary: "react-icons" },
                    { value: "MdSearch", label: "Search (MD)", iconLibrary: "react-icons" },
                    { value: "MdDescription", label: "Description (MD)", iconLibrary: "react-icons" },
                    { value: "MdCameraAlt", label: "Camera (MD)", iconLibrary: "react-icons" },
                    { value: "MdPeople", label: "People (MD)", iconLibrary: "react-icons" },
                    { value: "MdPhone", label: "Phone (MD)", iconLibrary: "react-icons" },
                    { value: "MdEmail", label: "Email (MD)", iconLibrary: "react-icons" },
                    { value: "MdCheckCircle", label: "Check Circle (MD)", iconLibrary: "react-icons" },
                    { value: "MdTrendingUp", label: "Trending Up (MD)", iconLibrary: "react-icons" },
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
                  globalColorType: "primary", // Step titles use primary color from branding
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
      ],
    },
  ],
};
