import { ComponentStructure } from "./types";

export const mapSectionStructure: ComponentStructure = {
  componentType: "mapSection",
  variants: [
    {
      id: "mapSection1",
      name: "Map Section 1 - Interactive Map",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "height",
          label: "Height",
          type: "object",
          fields: [
            {
              key: "desktop",
              label: "Desktop",
              type: "text",
              placeholder: "500px",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "400px",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "300px",
            },
          ],
        },
        {
          key: "map",
          label: "Map Settings",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            { key: "apiKey", label: "Google Maps API Key", type: "text" },
            {
              key: "center",
              label: "Map Center",
              type: "object",
              fields: [
                {
                  key: "lat",
                  label: "Latitude",
                  type: "number",
                  placeholder: "24.7136",
                },
                {
                  key: "lng",
                  label: "Longitude",
                  type: "number",
                  placeholder: "46.6753",
                },
              ],
            },
            {
              key: "zoom",
              label: "Zoom Level",
              type: "number",
              placeholder: "15",
            },
            {
              key: "mapType",
              label: "Map Type",
              type: "select",
              options: [
                { label: "Roadmap", value: "roadmap" },
                { label: "Satellite", value: "satellite" },
                { label: "Hybrid", value: "hybrid" },
                { label: "Terrain", value: "terrain" },
              ],
            },
            {
              key: "style",
              label: "Map Style",
              type: "text",
              placeholder: "default",
            },
            {
              key: "gestureHandling",
              label: "Gesture Handling",
              type: "select",
              options: [
                { label: "Auto", value: "auto" },
                { label: "Cooperative", value: "cooperative" },
                { label: "Greedy", value: "greedy" },
                { label: "None", value: "none" },
              ],
            },
            {
              key: "disableDefaultUI",
              label: "Disable Default UI",
              type: "boolean",
            },
            { key: "zoomControl", label: "Show Zoom Control", type: "boolean" },
            {
              key: "mapTypeControl",
              label: "Show Map Type Control",
              type: "boolean",
            },
            {
              key: "scaleControl",
              label: "Show Scale Control",
              type: "boolean",
            },
            {
              key: "streetViewControl",
              label: "Show Street View Control",
              type: "boolean",
            },
            {
              key: "rotateControl",
              label: "Show Rotate Control",
              type: "boolean",
            },
            {
              key: "fullscreenControl",
              label: "Show Fullscreen Control",
              type: "boolean",
            },
          ],
        },
        {
          key: "markers",
          label: "Map Markers",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            {
              key: "list",
              label: "Markers List",
              type: "array",
              addLabel: "Add Marker",
              itemLabel: "Marker",
              of: [
                { key: "id", label: "ID", type: "text" },
                { key: "title", label: "Title", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                {
                  key: "position",
                  label: "Position",
                  type: "object",
                  fields: [
                    { key: "lat", label: "Latitude", type: "number" },
                    { key: "lng", label: "Longitude", type: "number" },
                  ],
                },
                { key: "icon", label: "Icon URL", type: "image" },
                {
                  key: "iconSize",
                  label: "Icon Size",
                  type: "text",
                  placeholder: "32x32",
                },
                {
                  key: "animation",
                  label: "Animation",
                  type: "select",
                  options: [
                    { label: "None", value: "none" },
                    { label: "Bounce", value: "bounce" },
                    { label: "Drop", value: "drop" },
                  ],
                },
                { key: "clickable", label: "Clickable", type: "boolean" },
                { key: "draggable", label: "Draggable", type: "boolean" },
                { key: "visible", label: "Visible", type: "boolean" },
              ],
            },
          ],
        },
        {
          key: "infoWindow",
          label: "Info Window",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "300px",
            },
            {
              key: "pixelOffset",
              label: "Pixel Offset",
              type: "text",
              placeholder: "0,0",
            },
            {
              key: "disableAutoPan",
              label: "Disable Auto Pan",
              type: "boolean",
            },
            {
              key: "zIndex",
              label: "Z-Index",
              type: "number",
              placeholder: "1000",
            },
            {
              key: "style",
              label: "Info Window Style",
              type: "object",
              fields: [
                {
                  key: "backgroundColor",
                  label: "Background Color",
                  type: "color",
                  useDefaultColor: false, // Background color is usually custom
                },
                { 
                  key: "borderColor", 
                  label: "Border Color", 
                  type: "color",
                  useDefaultColor: false // Border color is usually custom
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "8px",
                },
                {
                  key: "boxShadow",
                  label: "Box Shadow",
                  type: "text",
                  placeholder: "0 2px 10px rgba(0,0,0,0.1)",
                },
              ],
            },
          ],
        },
        {
          key: "overlay",
          label: "Map Overlay",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            {
              key: "opacity",
              label: "Opacity",
              type: "text",
              placeholder: "0.3",
            },
            { 
              key: "color", 
              label: "Overlay Color", 
              type: "color",
              useDefaultColor: false // Overlay color is usually custom
            },
            {
              key: "zIndex",
              label: "Z-Index",
              type: "number",
              placeholder: "1",
            },
          ],
        },
        {
          key: "content",
          label: "Content Overlay",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            {
              key: "position",
              label: "Position",
              type: "select",
              options: [
                { label: "Top Left", value: "top-left" },
                { label: "Top Right", value: "top-right" },
                { label: "Bottom Left", value: "bottom-left" },
                { label: "Bottom Right", value: "bottom-right" },
                { label: "Center", value: "center" },
              ],
            },
            {
              key: "style",
              label: "Content Style",
              type: "object",
              fields: [
                {
                  key: "backgroundColor",
                  label: "Background Color",
                  type: "color",
                  useDefaultColor: false, // Content background is usually custom
                },
                { 
                  key: "textColor", 
                  label: "Text Color", 
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary" // Text uses secondary color
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "text",
                  placeholder: "20px",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "8px",
                },
                {
                  key: "boxShadow",
                  label: "Box Shadow",
                  type: "text",
                  placeholder: "0 2px 10px rgba(0,0,0,0.1)",
                },
                {
                  key: "maxWidth",
                  label: "Max Width",
                  type: "text",
                  placeholder: "300px",
                },
              ],
            },
            {
              key: "font",
              label: "Font Settings",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    {
                      key: "family",
                      label: "Family",
                      type: "text",
                      placeholder: "Tajawal",
                    },
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "24px",
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "600",
                    },
                    { 
                      key: "color", 
                      label: "Color", 
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary" // Title uses secondary color
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "1.2",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    {
                      key: "family",
                      label: "Family",
                      type: "text",
                      placeholder: "Tajawal",
                    },
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "16px",
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "400",
                    },
                    { 
                      key: "color", 
                      label: "Color", 
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary" // Description uses secondary color
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "1.5",
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
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "1024px",
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "1280px",
                },
              ],
            },
            {
              key: "height",
              label: "Responsive Height",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Height",
                  type: "text",
                  placeholder: "300px",
                },
                {
                  key: "tablet",
                  label: "Tablet Height",
                  type: "text",
                  placeholder: "400px",
                },
                {
                  key: "desktop",
                  label: "Desktop Height",
                  type: "text",
                  placeholder: "500px",
                },
              ],
            },
            {
              key: "zoom",
              label: "Responsive Zoom",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Zoom",
                  type: "number",
                  placeholder: "13",
                },
                {
                  key: "tablet",
                  label: "Tablet Zoom",
                  type: "number",
                  placeholder: "14",
                },
                {
                  key: "desktop",
                  label: "Desktop Zoom",
                  type: "number",
                  placeholder: "15",
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
              key: "mapLoad",
              label: "Map Load Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "select",
                  options: [
                    { label: "Fade In", value: "fadeIn" },
                    { label: "Slide Up", value: "slideUp" },
                    { label: "Scale", value: "scale" },
                  ],
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
              ],
            },
            {
              key: "markers",
              label: "Markers Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "select",
                  options: [
                    { label: "Bounce", value: "bounce" },
                    { label: "Drop", value: "drop" },
                    { label: "Fade In", value: "fadeIn" },
                  ],
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
                  placeholder: "100",
                },
                {
                  key: "stagger",
                  label: "Stagger Delay (ms)",
                  type: "number",
                  placeholder: "50",
                },
              ],
            },
            {
              key: "content",
              label: "Content Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "select",
                  options: [
                    { label: "Fade In", value: "fadeIn" },
                    { label: "Slide In", value: "slideIn" },
                    { label: "Scale", value: "scale" },
                  ],
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "400",
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
        {
          key: "events",
          label: "Map Events",
          type: "object",
          fields: [
            { key: "onMapClick", label: "On Map Click", type: "boolean" },
            { key: "onMarkerClick", label: "On Marker Click", type: "boolean" },
            { key: "onMapLoad", label: "On Map Load", type: "boolean" },
            { key: "onZoomChange", label: "On Zoom Change", type: "boolean" },
            {
              key: "onCenterChange",
              label: "On Center Change",
              type: "boolean",
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Content Title", type: "text" },
        {
          key: "content.description",
          label: "Content Description",
          type: "textarea",
        },
        { key: "markers.list", label: "Markers List", type: "array" },
      ],
    },
  ],
};
