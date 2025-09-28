"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Palette } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

const predefinedColors = [
  "#FF0000",
  "#FF4500",
  "#FFA500",
  "#FFD700",
  "#FFFF00",
  "#9ACD32",
  "#32CD32",
  "#00FF00",
  "#00FA9A",
  "#00FFFF",
  "#00BFFF",
  "#0000FF",
  "#8A2BE2",
  "#FF00FF",
  "#FF1493",
  "#FF69B4",
  "#000000",
  "#696969",
  "#808080",
  "#A9A9A9",
  "#C0C0C0",
  "#D3D3D3",
  "#DCDCDC",
  "#FFFFFF",
];

export function ColorPicker({
  value,
  onChange,
  label,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setInputValue(color);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    if (!inputValue.match(/^#[0-9A-Fa-f]{6}$/)) {
      setInputValue(value);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-12 h-10 p-0 border-2 border-gray-200 hover:border-gray-300"
              style={{ backgroundColor: value }}
            >
              <Palette className="w-4 h-4 text-white drop-shadow-lg" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" ref={popoverRef}>
            <div className="space-y-4">
              <div className="grid grid-cols-8 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors relative"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  >
                    {value === color && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="#FF0000"
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleColorSelect(inputValue)}
                  disabled={!inputValue.match(/^#[0-9A-Fa-f]{6}$/)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="#FF0000"
          className="flex-1"
        />
      </div>
    </div>
  );
}
