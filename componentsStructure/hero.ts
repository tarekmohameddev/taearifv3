import { ComponentStructure } from "./types";

export const heroStructure: ComponentStructure = {
  componentType: "hero",
  variants: [
    {
      id: "hero1",
      name: "Hero 1 - Modern Search",
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
              placeholder: "90vh",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "80vh",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "70vh",
            },
          ],
        },
        {
          key: "minHeight",
          label: "Minimum Height",
          type: "object",
          fields: [
            {
              key: "desktop",
              label: "Desktop",
              type: "text",
              placeholder: "520px",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "480px",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "400px",
            },
          ],
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            { key: "image", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.45",
                },
                { key: "color", label: "Color", type: "color" },
              ],
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "subtitle", label: "Subtitle", type: "text" },
            { key: "paddingTop", label: "Padding Top", type: "text" },
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
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        { key: "desktop", label: "Desktop", type: "text" },
                        { key: "tablet", label: "Tablet", type: "text" },
                        { key: "mobile", label: "Mobile", type: "text" },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    { key: "color", label: "Color", type: "color" },
                    { key: "lineHeight", label: "Line Height", type: "text" },
                  ],
                },
                {
                  key: "subtitle",
                  label: "Subtitle Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        { key: "desktop", label: "Desktop", type: "text" },
                        { key: "tablet", label: "Tablet", type: "text" },
                        { key: "mobile", label: "Mobile", type: "text" },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    { key: "color", label: "Color", type: "color" },
                  ],
                },
              ],
            },
            { key: "alignment", label: "Alignment", type: "text" },
            { key: "maxWidth", label: "Max Width", type: "text" },
          ],
        },
        {
          key: "searchForm",
          label: "Search Form",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            { key: "position", label: "Position", type: "text" },
            { key: "offset", label: "Offset", type: "text" },
            {
              key: "background",
              label: "Form Background",
              type: "object",
              fields: [
                { key: "color", label: "Color", type: "color" },
                { key: "opacity", label: "Opacity", type: "text" },
                { key: "shadow", label: "Shadow", type: "text" },
                { key: "border", label: "Border", type: "text" },
                { key: "borderRadius", label: "Border Radius", type: "text" },
              ],
            },
            {
              key: "fields",
              label: "Form Fields",
              type: "object",
              fields: [
                {
                  key: "purpose",
                  label: "Purpose Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [
                        { key: "value", label: "Value", type: "text" },
                        { key: "label", label: "Label", type: "text" },
                      ],
                    },
                    { key: "default", label: "Default", type: "text" },
                  ],
                },
                {
                  key: "city",
                  label: "City Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                  ],
                },
                {
                  key: "type",
                  label: "Type Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [{ key: "value", label: "Value", type: "text" }],
                    },
                  ],
                },
                {
                  key: "price",
                  label: "Price Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [
                        { key: "id", label: "ID", type: "text" },
                        { key: "label", label: "Label", type: "text" },
                      ],
                    },
                  ],
                },
                {
                  key: "keywords",
                  label: "Keywords Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                  ],
                },
              ],
            },
            {
              key: "responsive",
              label: "Responsive Layout",
              type: "object",
              fields: [
                { key: "desktop", label: "Desktop", type: "text" },
                { key: "tablet", label: "Tablet", type: "text" },
                { key: "mobile", label: "Mobile", type: "text" },
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
              key: "title",
              label: "Title Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "subtitle",
              label: "Subtitle Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "searchForm",
              label: "Search Form Animation",
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
        { key: "background.image", label: "Background Image", type: "image" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.subtitle", label: "Subtitle", type: "text" },
        {
          key: "content.paddingTop",
          label: "Content Padding Top",
          type: "text",
        },
        {
          key: "searchForm.enabled",
          label: "Show Search Form",
          type: "boolean",
        },
        {
          key: "searchForm.fields.purpose.enabled",
          label: "Show Purpose Field",
          type: "boolean",
        },
        {
          key: "searchForm.fields.city.enabled",
          label: "Show City Field",
          type: "boolean",
        },
        {
          key: "searchForm.fields.type.enabled",
          label: "Show Type Field",
          type: "boolean",
        },
        {
          key: "searchForm.fields.price.enabled",
          label: "Show Price Field",
          type: "boolean",
        },
        {
          key: "searchForm.fields.keywords.enabled",
          label: "Show Keywords Field",
          type: "boolean",
        },
      ],
    },
    {
      id: "hero2",
      name: "Hero 2 - Simple Image",
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
              placeholder: "229px",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "229px",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "229px",
            },
          ],
        },
        {
          key: "minHeight",
          label: "Minimum Height",
          type: "object",
          fields: [
            {
              key: "desktop",
              label: "Desktop",
              type: "text",
              placeholder: "229px",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "229px",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "229px",
            },
          ],
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            { key: "image", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.6",
                },
                { key: "color", label: "Color", type: "color" },
              ],
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
            { key: "alignment", label: "Alignment", type: "text" },
            { key: "maxWidth", label: "Max Width", type: "text" },
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
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "36px",
                        },
                        {
                          key: "tablet",
                          label: "Tablet",
                          type: "text",
                          placeholder: "36px",
                        },
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "36px",
                        },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    { key: "color", label: "Color", type: "color" },
                    { key: "lineHeight", label: "Line Height", type: "text" },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "15px",
                        },
                        {
                          key: "tablet",
                          label: "Tablet",
                          type: "text",
                          placeholder: "15px",
                        },
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "15px",
                        },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    { key: "color", label: "Color", type: "color" },
                  ],
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
              key: "title",
              label: "Title Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "description",
              label: "Description Animation",
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
        { key: "background.image", label: "Background Image", type: "image" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.description", label: "Description", type: "text" },
        {
          key: "background.overlay.enabled",
          label: "Show Overlay",
          type: "boolean",
        },
        {
          key: "background.overlay.opacity",
          label: "Overlay Opacity",
          type: "text",
        },
        {
          key: "background.overlay.color",
          label: "Overlay Color",
          type: "color",
        },
      ],
    },
  ],
};
