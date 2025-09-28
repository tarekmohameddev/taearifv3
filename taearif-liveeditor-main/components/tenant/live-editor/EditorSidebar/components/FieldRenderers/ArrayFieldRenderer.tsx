"use client";
import React, { useState } from "react";
import { FieldDefinition } from "@/componentsStructure/types";

interface ArrayFieldRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any[];
  updateValue: (path: string, value: any) => void;
  getValueByPath: (path: string) => any;
  renderField: (def: FieldDefinition, basePath?: string) => React.ReactNode;
}

export function ArrayFieldRenderer({
  def,
  normalizedPath,
  value,
  updateValue,
  getValueByPath,
  renderField,
}: ArrayFieldRendererProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const arrDef = def as any;

  // Primitive array support (e.g., movingServices.en: string[])
  if (arrDef.itemType === "text") {
    const items: string[] = Array.isArray(value) ? value : [];
    const addItem = () => {
      const newItems = [...items, ""];
      updateValue(normalizedPath, newItems);
    };
    const updateItem = (idx: number, v: string) => {
      const next = items.slice();
      next[idx] = v;
      updateValue(normalizedPath, next);
    };
    const removeItem = (idx: number) => {
      const next = items.slice();
      next.splice(idx, 1);
      updateValue(normalizedPath, next);
    };
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            {def.label}
          </span>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 hover:bg-blue-100 border border-transparent hover:border-blue-300 transition-all duration-200"
          >
            Add
          </button>
        </div>
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={it}
              onChange={(e) => updateItem(idx, e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Enhanced Object array support with universal compatibility
  const items: any[] = Array.isArray(value) ? value : [];
  
  // Smart default value generator based on field definitions
  const generateDefaultItem = (): any => {
    const newItem: any = {};
    for (const f of arrDef.of) {
      // Generate smart defaults based on field type
      switch (f.type) {
        case "text":
          newItem[f.key] = f.defaultValue || "";
          break;
        case "number":
          newItem[f.key] = f.defaultValue || 0;
          break;
        case "boolean":
          newItem[f.key] = f.defaultValue || false;
          break;
        case "color":
          newItem[f.key] = f.defaultValue || "#000000";
          break;
        case "image":
          newItem[f.key] = f.defaultValue || "";
          break;
        case "select":
          newItem[f.key] = f.defaultValue || (f.options?.[0]?.value || "");
          break;
        case "object":
          newItem[f.key] = f.defaultValue || {};
          break;
        case "array":
          newItem[f.key] = f.defaultValue || [];
          break;
        default:
          newItem[f.key] = f.defaultValue || "";
      }
    }
    return newItem;
  };

  const addItem = () => {
    const newItem = generateDefaultItem();
    updateValue(normalizedPath, [...items, newItem]);
  };

  const expandAll = () => {
    setExpanded((s) => {
      const next = { ...s } as Record<string, boolean>;
      for (let i = 0; i < items.length; i++)
        next[`${normalizedPath}.${i}`] = true;
      return next;
    });
  };

  const collapseAll = () => {
    setExpanded((s) => {
      const next = { ...s } as Record<string, boolean>;
      for (let i = 0; i < items.length; i++)
        next[`${normalizedPath}.${i}`] = false;
      return next;
    });
  };

  // Enhanced item title generation with multiple fallback strategies
  const getItemTitle = (item: any, idx: number): string => {
    // Try multiple common title patterns
    const titlePatterns = [
      item?.title?.en,
      item?.title,
      item?.text?.en,
      item?.text,
      item?.name?.en,
      item?.name,
      item?.label?.en,
      item?.label,
      item?.heading?.en,
      item?.heading,
      item?.id,
      item?.key,
      item?.value
    ];

    const candidate = titlePatterns.find(pattern => 
      pattern && typeof pattern === 'string' && pattern.trim().length > 0
    );

    const base = candidate
      ? String(candidate).trim()
      : `${arrDef.itemLabel || "Item"} ${idx + 1}`;
    
    // Truncate long titles
    return base.length > 50 ? base.substring(0, 47) + "..." : base;
  };

  // Enhanced nested array support for complex structures like menu items
  const renderNestedArray = (field: any, itemPath: string, item: any) => {
    if (field.type !== "array") return null;
    
    const nestedItems = Array.isArray(item[field.key]) ? item[field.key] : [];
    
    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-slate-700 text-sm">{field.label}</h5>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {nestedItems.length} items
            </span>
            <button
              type="button"
              onClick={() => {
                const newItem = field.of ? field.of.reduce((acc: any, f: any) => {
                  acc[f.key] = f.defaultValue || (f.type === "text" ? "" : f.type === "number" ? 0 : f.type === "boolean" ? false : "");
                  return acc;
                }, {}) : {};
                const updatedItem = { ...item };
                updatedItem[field.key] = [...nestedItems, newItem];
                updateValue(itemPath, updatedItem);
              }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add {field.itemLabel || "Item"}
            </button>
          </div>
        </div>
        
        {nestedItems.map((nestedItem: any, nestedIdx: number) => (
          <div key={nestedIdx} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">
                {field.itemLabel || "Item"} {nestedIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  const updatedItem = { ...item };
                  updatedItem[field.key] = nestedItems.filter((_: any, i: number) => i !== nestedIdx);
                  updateValue(itemPath, updatedItem);
                }}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </div>
            
            {field.of && field.of.map((nestedField: any) => (
              <div key={nestedField.key} className="mb-2">
                {renderField(nestedField, `${itemPath}.${field.key}.${nestedIdx}`)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Enhanced item subtitle for menu items (shows type and submenu count)
  const getItemSubtitle = (item: any): string => {
    const parts: string[] = [];
    
    if (item?.type) {
      parts.push(`Type: ${item.type}`);
    }
    
    if (item?.submenu && Array.isArray(item.submenu)) {
      const totalSubItems = item.submenu.reduce((total: number, sub: any) => {
        return total + (Array.isArray(sub.items) ? sub.items.length : 0);
      }, 0);
      parts.push(`${item.submenu.length} submenu${item.submenu.length !== 1 ? 's' : ''} (${totalSubItems} items)`);
    }
    
    if (item?.url) {
      parts.push(`URL: ${item.url}`);
    }
    
    return parts.join(' • ');
  };

  // Enhanced validation for array items with better error messages
  const validateItem = (item: any, index: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check required fields based on field definitions
    for (const f of arrDef.of) {
      if (f.type === "text" && (!item[f.key] || item[f.key].trim() === "")) {
        // Only mark as error if it's a critical field
        if (f.key.includes("title") || f.key.includes("name") || f.key.includes("text")) {
          errors.push(`${f.label || f.key} is required`);
        }
      }
    }
    
    return { isValid: errors.length === 0, errors };
  };

  return (
    <div className="group bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </div>
          <div>
            <span className="font-bold text-slate-800">{def.label}</span>
            <p className="text-xs text-slate-500 mt-1">
              {items.length} items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-2 text-xs rounded-lg bg-slate-100 hover:bg-blue-100 border border-transparent hover:border-blue-300 transition-all duration-200"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-2 text-xs rounded-lg bg-slate-100 hover:bg-purple-100 border border-transparent hover:border-purple-300 transition-all duration-200"
          >
            Collapse All
          </button>
          <button
            onClick={addItem}
            className="group/btn relative overflow-hidden px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
            <div className="relative flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-sm">{arrDef.addLabel || "Add"}</span>
            </div>
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4 bg-gradient-to-b from-white to-slate-50">
        {items.map((item: any, idx: number) => {
          const key = `${normalizedPath}.${idx}`;
          const isOpen = expanded[key] ?? false;
          const validation = validateItem(item, idx);
          
          const toggle = () =>
            setExpanded((s) => ({ ...s, [key]: !isOpen }));
          
          const move = (dir: -1 | 1) => {
            const next = items.slice();
            const newIdx = idx + dir;
            if (newIdx < 0 || newIdx >= items.length) {
              return;
            }
            
            const tmp = next[idx];
            next[idx] = next[newIdx];
            next[newIdx] = tmp;
            
            updateValue(normalizedPath, next);
          };

          const duplicateItem = () => {
            const duplicatedItem = { ...item };
            const newItems = [...items];
            newItems.splice(idx + 1, 0, duplicatedItem);
            updateValue(normalizedPath, newItems);
          };

          const clearItem = () => {
            const clearedItem = generateDefaultItem();
            const newItems = [...items];
            newItems[idx] = clearedItem;
            updateValue(normalizedPath, newItems);
          };
          return (
            <div
              key={idx}
              className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden transition-all duration-200 ${
                validation.isValid 
                  ? "border-slate-200 hover:border-slate-300" 
                  : "border-red-200 hover:border-red-300"
              }`}
            >
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={toggle}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-purple-100 border border-transparent hover:border-purple-300 transition-all duration-200"
                    aria-expanded={isOpen}
                  >
                    <svg
                      className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    validation.isValid 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
                      : "bg-gradient-to-br from-red-500 to-red-600"
                  }`}>
                    <span className="text-white text-xs font-bold">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[280px]">
                      {getItemTitle(item, idx)}
                    </span>
                    {/* Enhanced subtitle for menu items */}
                    {arrDef.itemLabel === "Item" && getItemSubtitle(item) && (
                      <span className="text-xs text-slate-500 truncate max-w-[280px]">
                        {getItemSubtitle(item)}
                      </span>
                    )}
                    {/* Show menu item type badge */}
                    {arrDef.itemLabel === "Item" && item?.type && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === "link" ? "bg-blue-100 text-blue-800" :
                          item.type === "mega_menu" ? "bg-purple-100 text-purple-800" :
                          item.type === "dropdown" ? "bg-green-100 text-green-800" :
                          item.type === "button" ? "bg-orange-100 text-orange-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {item.type}
                        </span>
                        {item?.submenu && Array.isArray(item.submenu) && item.submenu.length > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {item.submenu.length} submenu{item.submenu.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    )}
                    {!validation.isValid && (
                      <span className="text-xs text-red-500">
                        {validation.errors[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* Move Up Button */}
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    disabled={idx === 0}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 border border-transparent hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <svg
                      className="w-3 h-3 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  
                  {/* Move Down Button */}
                  <button
                    type="button"
                    onClick={() => move(1)}
                    disabled={idx === items.length - 1}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 border border-transparent hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <svg
                      className="w-3 h-3 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Duplicate Button */}
                  <button
                    type="button"
                    onClick={duplicateItem}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-green-100 border border-transparent hover:border-green-300 transition-all duration-200"
                    title="Duplicate Item"
                  >
                    <svg
                      className="w-3 h-3 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>

                  {/* Clear Button */}
                  <button
                    type="button"
                    onClick={clearItem}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-yellow-100 border border-transparent hover:border-yellow-300 transition-all duration-200"
                    title="Clear Item"
                  >
                    <svg
                      className="w-3 h-3 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      const next = items.slice();
                      next.splice(idx, 1);
                      updateValue(normalizedPath, next);
                    }}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 transition-all duration-200"
                    title="Delete Item"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="p-4 space-y-4 bg-gradient-to-b from-white to-slate-50">
                  {arrDef.of.map((f: any) => (
                    <div key={f.key}>
                      {/* Render nested arrays specially */}
                      {f.type === "array" ? (
                        renderNestedArray(f, `${normalizedPath}.${idx}`, item)
                      ) : (
                        renderField(f, `${normalizedPath}.${idx}`)
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No {arrDef.itemLabel || "items"} yet
            </h3>
            <p className="text-slate-500 text-sm mb-4 max-w-sm mx-auto">
              {arrDef.itemLabel ? `Add your first ${arrDef.itemLabel.toLowerCase()} to get started` : "Click the Add button to create your first item"}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={addItem}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                Add {arrDef.itemLabel || "Item"}
              </button>
              {arrDef.of && arrDef.of.length > 0 && (
                <button
                  onClick={() => {
                    // Add multiple items at once
                    const multipleItems = Array.from({ length: 3 }, () => generateDefaultItem());
                    updateValue(normalizedPath, multipleItems);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                >
                  Add 3 {arrDef.itemLabel || "Items"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
