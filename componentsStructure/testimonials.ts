import { ComponentStructure } from "./types";

export const testimonialsStructure: ComponentStructure = {
  componentType: "testimonials",
  variants: [
    {
      id: "testimonials1",
      name: "Testimonials 1 - Swiper Carousel",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "title",
          label: "Section Title",
          type: "text",
          placeholder: "آراء عملائنا",
        },
        {
          key: "description",
          label: "Section Description",
          type: "text",
          placeholder: "تعرف على تجارب عملائنا مع خدماتنا",
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            { key: "color", label: "Background Color", type: "color" },
            { key: "image", label: "Background Image", type: "image" },
            { key: "alt", label: "Image Alt Text", type: "text" },
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
                  placeholder: "0.1",
                },
                { key: "color", label: "Color", type: "color" },
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
              key: "paddingY",
              label: "Vertical Padding",
              type: "text",
              placeholder: "py-14 sm:py-16",
            },
            {
              key: "marginBottom",
              label: "Header Margin Bottom",
              type: "text",
              placeholder: "mb-8",
            },
          ],
        },
        {
          key: "header",
          label: "Header Styling",
          type: "object",
          fields: [
            {
              key: "alignment",
              label: "Text Alignment",
              type: "text",
              placeholder: "text-center md:text-right",
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "mx-auto px-5 sm:px-26",
            },
            {
              key: "title",
              label: "Title Styling",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "section-title",
                },
                { key: "color", label: "Color", type: "color" },
                {
                  key: "size",
                  label: "Font Size",
                  type: "text",
                  placeholder: "text-3xl sm:text-4xl",
                },
                {
                  key: "weight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "font-bold",
                },
              ],
            },
            {
              key: "description",
              label: "Description Styling",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "section-subtitle-large",
                },
                { key: "color", label: "Color", type: "color" },
                {
                  key: "size",
                  label: "Font Size",
                  type: "text",
                  placeholder: "text-lg",
                },
                {
                  key: "weight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "font-normal",
                },
              ],
            },
          ],
        },
        {
          key: "carousel",
          label: "Carousel Settings",
          type: "object",
          fields: [
            {
              key: "desktopCount",
              label: "Desktop Slides Count",
              type: "number",
              placeholder: "3",
            },
            {
              key: "space",
              label: "Space Between Slides",
              type: "number",
              placeholder: "20",
            },
            { key: "autoplay", label: "Enable Autoplay", type: "boolean" },
            {
              key: "showPagination",
              label: "Show Pagination",
              type: "boolean",
            },
            { key: "loop", label: "Enable Loop", type: "boolean" },
            {
              key: "slideHeight",
              label: "Slide Height",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Height",
                  type: "text",
                  placeholder: "!h-[260px]",
                },
                {
                  key: "tablet",
                  label: "Tablet Height",
                  type: "text",
                  placeholder: "sm:!h-[220px]",
                },
                {
                  key: "desktop",
                  label: "Desktop Height",
                  type: "text",
                  placeholder: "md:!h-[240px]",
                },
                {
                  key: "largeDesktop",
                  label: "Large Desktop Height",
                  type: "text",
                  placeholder: "lg:!h-[260px]",
                },
              ],
            },
          ],
        },
        {
          key: "testimonials",
          label: "Testimonials Data",
          type: "array",
          addLabel: "Add Testimonial",
          itemLabel: "Testimonial",
          of: [
            { key: "id", label: "ID", type: "text" },
            { key: "quote", label: "Quote Text", type: "text" },
            { key: "name", label: "Customer Name", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "rating", label: "Rating (1-5)", type: "number" },
            { key: "avatar", label: "Avatar Image", type: "image" },
            { key: "company", label: "Company", type: "text" },
            { key: "date", label: "Date", type: "text" },
          ],
        },
        {
          key: "card",
          label: "Testimonial Card Styling",
          type: "object",
          fields: [
            {
              key: "backgroundColor",
              label: "Background Color",
              type: "color",
            },
            { key: "borderColor", label: "Border Color", type: "color" },
            {
              key: "borderRadius",
              label: "Border Radius",
              type: "text",
              placeholder: "rounded-2xl",
            },
            {
              key: "shadow",
              label: "Shadow",
              type: "text",
              placeholder: "shadow-sm",
            },
            {
              key: "padding",
              label: "Padding",
              type: "text",
              placeholder: "p-6",
            },
            {
              key: "minHeight",
              label: "Min Height",
              type: "text",
              placeholder: "h-[200px]",
            },
            {
              key: "quoteIcon",
              label: "Quote Icon",
              type: "object",
              fields: [
                { key: "color", label: "Icon Color", type: "color" },
                {
                  key: "size",
                  label: "Icon Size",
                  type: "text",
                  placeholder: "w-[34px] h-[27px]",
                },
                {
                  key: "position",
                  label: "Position",
                  type: "text",
                  placeholder: "top-[-15px] left-0",
                },
              ],
            },
            {
              key: "text",
              label: "Text Styling",
              type: "object",
              fields: [
                { key: "color", label: "Text Color", type: "color" },
                {
                  key: "size",
                  label: "Font Size",
                  type: "text",
                  placeholder: "text-md",
                },
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "leading-6",
                },
                {
                  key: "maxLines",
                  label: "Max Lines",
                  type: "text",
                  placeholder: "line-clamp-3",
                },
              ],
            },
            {
              key: "footer",
              label: "Card Footer",
              type: "object",
              fields: [
                {
                  key: "marginTop",
                  label: "Margin Top",
                  type: "text",
                  placeholder: "mt-auto",
                },
                {
                  key: "paddingTop",
                  label: "Padding Top",
                  type: "text",
                  placeholder: "pt-3",
                },
                {
                  key: "customerInfo",
                  label: "Customer Info",
                  type: "object",
                  fields: [
                    { key: "nameColor", label: "Name Color", type: "color" },
                    {
                      key: "nameWeight",
                      label: "Name Font Weight",
                      type: "text",
                      placeholder: "font-extrabold",
                    },
                    {
                      key: "locationColor",
                      label: "Location Color",
                      type: "color",
                    },
                  ],
                },
                {
                  key: "rating",
                  label: "Rating Stars",
                  type: "object",
                  fields: [
                    {
                      key: "activeColor",
                      label: "Active Star Color",
                      type: "color",
                    },
                    {
                      key: "inactiveColor",
                      label: "Inactive Star Color",
                      type: "color",
                    },
                    {
                      key: "size",
                      label: "Star Size",
                      type: "text",
                      placeholder: "size-3",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "pagination",
          label: "Pagination Styling",
          type: "object",
          fields: [
            {
              key: "bulletWidth",
              label: "Bullet Width",
              type: "text",
              placeholder: "12px",
            },
            {
              key: "bulletHeight",
              label: "Bullet Height",
              type: "text",
              placeholder: "12px",
            },
            { key: "bulletColor", label: "Bullet Color", type: "color" },
            {
              key: "bulletOpacity",
              label: "Bullet Opacity",
              type: "text",
              placeholder: "1",
            },
            {
              key: "bulletMargin",
              label: "Bullet Margin",
              type: "text",
              placeholder: "0 4px",
            },
            {
              key: "activeBulletWidth",
              label: "Active Bullet Width",
              type: "text",
              placeholder: "32px",
            },
            {
              key: "activeBulletColor",
              label: "Active Bullet Color",
              type: "color",
            },
            {
              key: "activeBulletBorderRadius",
              label: "Active Bullet Border Radius",
              type: "text",
              placeholder: "6px",
            },
            {
              key: "paginationBottom",
              label: "Pagination Bottom Position",
              type: "text",
              placeholder: "-40px",
            },
          ],
        },
        {
          key: "responsive",
          label: "Responsive Behavior",
          type: "object",
          fields: [
            {
              key: "mobileSlides",
              label: "Mobile Slides Count",
              type: "number",
              placeholder: "1",
            },
            {
              key: "tabletSlides",
              label: "Tablet Slides Count",
              type: "number",
              placeholder: "2",
            },
            {
              key: "desktopSlides",
              label: "Desktop Slides Count",
              type: "number",
              placeholder: "3",
            },
            {
              key: "largeDesktopSlides",
              label: "Large Desktop Slides Count",
              type: "number",
              placeholder: "3",
            },
          ],
        },
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "cards",
              label: "Card Animations",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "text",
                  placeholder: "fade-in",
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
                  placeholder: "100",
                },
              ],
            },
            {
              key: "header",
              label: "Header Animations",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "text",
                  placeholder: "slide-up",
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
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "description", label: "Section Description", type: "text" },
        { key: "background.color", label: "Background Color", type: "color" },
        {
          key: "carousel.desktopCount",
          label: "Desktop Slides Count",
          type: "number",
        },
        { key: "carousel.autoplay", label: "Enable Autoplay", type: "boolean" },
        {
          key: "carousel.showPagination",
          label: "Show Pagination",
          type: "boolean",
        },
        {
          key: "card.backgroundColor",
          label: "Card Background Color",
          type: "color",
        },
        {
          key: "card.quoteIcon.color",
          label: "Quote Icon Color",
          type: "color",
        },
        {
          key: "pagination.activeBulletColor",
          label: "Active Pagination Color",
          type: "color",
        },
      ],
    },
  ],
};
