"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface ModernColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ModernColorPicker({
  label,
  value,
  onChange,
}: ModernColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [alpha, setAlpha] = useState(1);
  const [hexInput, setHexInput] = useState(value || "#000000");
  const pickerRef = useRef<HTMLDivElement>(null);
  // Initialize as false if value is empty (user can start editing immediately)
  const isInitializing = useRef(!value || value === "");
  const lastHexRef = useRef<string>("");

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Initialize from value
  useEffect(() => {
    if (value && value.startsWith("#") && value !== lastHexRef.current) {
      console.log(`🔄 ModernColorPicker: Initializing from value: ${value}`);
      isInitializing.current = true;
      setHexInput(value);
      lastHexRef.current = value;
      const hsl = hexToHsl(value);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      // Mark initialization as complete after state updates
      setTimeout(() => {
        isInitializing.current = false;
        console.log(
          `✅ ModernColorPicker: Initialization complete, ready for changes`,
        );
      }, 50);
    } else if (!value || !value.startsWith("#") || value === "") {
      // If value is empty, we're ready for user input immediately
      console.log(
        `✅ ModernColorPicker: No value provided, ready for user input`,
      );
      isInitializing.current = false;
      // Initialize with default black color
      if (!hexInput || hexInput === "#000000") {
        setHexInput("#000000");
        lastHexRef.current = "#000000";
      }
    }
  }, [value, hexInput]);

  // Store onChange in ref to avoid dependency issues
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Update hex when HSL changes
  useEffect(() => {
    const hex = hslToHex(hue, saturation, lightness);

    // Always update hexInput when HSL changes (for display)
    if (hex !== lastHexRef.current) {
      setHexInput(hex);
      lastHexRef.current = hex;

      // Only call onChange if not initializing (to avoid loops)
      if (!isInitializing.current) {
        console.log(`🎨 ModernColorPicker: Calling onChange with hex: ${hex}`);
        onChangeRef.current(hex);
        console.log(`✅ ModernColorPicker: onChange called`);
      } else {
        console.log(`⏸️ ModernColorPicker: Skipping onChange (initializing)`);
      }
    }
  }, [hue, saturation, lightness]);

  // Handle hex input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(input)) {
      setHexInput(input);
      if (input.length === 7) {
        console.log(`🔄 ModernColorPicker: Hex input changed: ${input}`);
        isInitializing.current = true;
        const hsl = hexToHsl(input);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        lastHexRef.current = input;
        onChangeRef.current(input);
        setTimeout(() => {
          isInitializing.current = false;
          console.log(`✅ ModernColorPicker: Hex input processed`);
        }, 10);
      }
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        {/* Color Preview Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-lg border-2 border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0"
          style={{ backgroundColor: currentColor }}
        >
          <div className="w-full h-full rounded-lg"></div>
        </button>

        {/* Hex Input */}
        <div className="flex-1">
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            placeholder="#000000"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-sm"
          />
        </div>
      </div>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white rounded-xl shadow-2xl border border-slate-200 w-80">
          {/* Saturation/Lightness Area */}
          <div className="relative mb-4">
            <div
              className="w-full h-48 rounded-lg cursor-crosshair relative overflow-hidden"
              style={{
                background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hue}, 100%, 50%)`,
              }}
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const s = Math.round((x / rect.width) * 100);
                const l = Math.round(100 - (y / rect.height) * 100);
                setSaturation(Math.max(0, Math.min(100, s)));
                setLightness(Math.max(0, Math.min(100, l)));

                const handleMove = (moveEvent: MouseEvent) => {
                  const moveRect = rect;
                  const moveX = moveEvent.clientX - moveRect.left;
                  const moveY = moveEvent.clientY - moveRect.top;
                  const moveS = Math.round((moveX / moveRect.width) * 100);
                  const moveL = Math.round(
                    100 - (moveY / moveRect.height) * 100,
                  );
                  setSaturation(Math.max(0, Math.min(100, moveS)));
                  setLightness(Math.max(0, Math.min(100, moveL)));
                };

                const handleUp = () => {
                  document.removeEventListener("mousemove", handleMove);
                  document.removeEventListener("mouseup", handleUp);
                };

                document.addEventListener("mousemove", handleMove);
                document.addEventListener("mouseup", handleUp);
              }}
            >
              {/* Cursor */}
              <div
                className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>

          {/* Hue Slider */}
          <div className="mb-4">
            <div className="relative h-6 rounded-lg overflow-hidden cursor-pointer">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                }}
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const newHue = Math.round((x / rect.width) * 360);
                  setHue(Math.max(0, Math.min(360, newHue)));

                  const handleMove = (moveEvent: MouseEvent) => {
                    const moveRect = rect;
                    const moveX = moveEvent.clientX - moveRect.left;
                    const moveHue = Math.round((moveX / moveRect.width) * 360);
                    setHue(Math.max(0, Math.min(360, moveHue)));
                  };

                  const handleUp = () => {
                    document.removeEventListener("mousemove", handleMove);
                    document.removeEventListener("mouseup", handleUp);
                  };

                  document.addEventListener("mousemove", handleMove);
                  document.addEventListener("mouseup", handleUp);
                }}
              >
                {/* Hue Cursor */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white border border-slate-400 shadow-md pointer-events-none"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Color Values */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1">H</label>
              <input
                type="number"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">S</label>
              <input
                type="number"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">L</label>
              <input
                type="number"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => setLightness(Number(e.target.value))}
                className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
