import { ComponentStructure } from "./types";

export const mapSectionStructure: ComponentStructure = {
  componentType: "mapSection",
  variants: [
    {
      id: "mapSection1",
      name: "Map Section 1 - Google Maps Embed",
      fields: [
        { 
          key: "visible", 
          label: "Visible", 
          type: "boolean" 
        },{
          key: "title",
          label: "Section Title",
          type: "text",
          placeholder: "ويمكنك أيضا زيارتنا في أي وقت من خلال موقعنا على الخريطة اسفله"},
        {
          key: "mapUrl",
          label: "Google Maps Embed URL",
          type: "text",
          placeholder: "https://www.google.com/maps/embed?pb=..."},
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [{
              key: "titleColor",
              label: "Title Color",
              type: "color"},
            {
              key: "titleSize",
              label: "Title Size",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "text-xl"},
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "text-2xl"},
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "text-2xl"},
              ]},
            {
              key: "mapHeight",
              label: "Map Height",
              type: "text",
              placeholder: "400px"},
          ]},
        {
          key: "spacing",
          label: "Spacing",
          type: "object",
          fields: [{
              key: "paddingTop",
              label: "Padding Top",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "pt-12"},
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "pt-14"},
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "pt-16"},
              ]},
            {
              key: "paddingBottom",
              label: "Padding Bottom",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "pb-8"},
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "pb-10"},
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "pb-12"},
              ]},
          ]},
      ],
      
      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "title", label: "Title", type: "text" },
        { key: "mapUrl", label: "Map URL", type: "text" },
      ]},
  ]};

