"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActiveFiltersDisplayProps {
  filters: any;
  onRemoveFilter: (filterKey: string, filterValue?: any) => void;
  onClearAll: () => void;
}

export function ActiveFiltersDisplay({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersDisplayProps) {
  const getFilterDisplayName = (key: string, value: any) => {
    switch (key) {
      case 'purposes_filter':
        return value === 'rent' ? 'للإيجار' : value === 'sale' ? 'للبيع' : value;
      case 'type':
        return value === 'residential' ? 'سكني' : 
               value === 'commercial' ? 'تجاري' : 
               value === 'rent' ? 'للإيجار' : 
               value === 'sale' ? 'للبيع' : value;
      case 'price_from':
        return `من ${value.toLocaleString()} ريال`;
      case 'price_to':
        return `إلى ${value.toLocaleString()} ريال`;
      case 'area_from':
        return `من ${value} م²`;
      case 'area_to':
        return `إلى ${value} م²`;
      case 'beds':
        return `${value}+ غرف`;
      case 'baths':
        return `${value}+ حمامات`;
      case 'features':
        return value;
      default:
        return value;
    }
  };

  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; value: any; displayName: string }> = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 0) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((item: any) => {
            activeFilters.push({
              key,
              value: item,
              displayName: getFilterDisplayName(key, item)
            });
          });
        } else if (!Array.isArray(value)) {
          activeFilters.push({
            key,
            value,
            displayName: getFilterDisplayName(key, value)
          });
        }
      }
    });
    
    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <span className="text-sm font-medium text-gray-700">الفلاتر النشطة:</span>
      
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value}-${index}`}
          variant="secondary"
          className="bg-black text-white hover:bg-gray-800 flex items-center gap-1"
        >
          {filter.displayName}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-gray-600"
            onClick={() => onRemoveFilter(filter.key, filter.value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="text-gray-600 hover:text-black border-gray-300"
      >
        مسح الكل
      </Button>
    </div>
  );
}
