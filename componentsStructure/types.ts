export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "color"
  | "image"
  | "select"
  | "array"
  | "object";

export interface FieldDefinitionBase {
  key: string; // dot path, e.g. "texts.title" or "slides[0].title" (0 for template)
  label: string;
  type: FieldType;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: { label: string; value: string }[]; // for select
  defaultValue?: any; // default value for the field
  description?: string; // description for the field
}

export interface ObjectFieldDefinition extends FieldDefinitionBase {
  type: "object";
  fields: FieldDefinition[];
}

export interface ArrayFieldDefinition extends FieldDefinitionBase {
  type: "array";
  of: FieldDefinition[]; // fields for each item
  minItems?: number;
  maxItems?: number;
  addLabel?: string;
  itemLabel?: string;
}

export type FieldDefinition =
  | FieldDefinitionBase
  | ObjectFieldDefinition
  | ArrayFieldDefinition;

export interface VariantDefinition {
  id: string; // hero1, hero2, hero3 ...
  name: string;
  description?: string; // description for the variant
  componentPath?: string; // path to the component file
  fields: FieldDefinition[];
  simpleFields?: FieldDefinition[];
}

export interface ComponentStructure {
  componentType: string; // hero
  name?: string; // display name for the component
  variants: VariantDefinition[];
}
