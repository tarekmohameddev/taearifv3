// components/DistrictSelector.tsx
import React from "react";
import useStore from "@/context/Store";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface DistrictSelectorProps {
  selectedDistrictId: string | number | null;
  onDistrictSelect: (districtId: string | number) => void;
}

const DistrictSelector: React.FC<DistrictSelectorProps> = ({ selectedDistrictId, onDistrictSelect }) => {
  const districts = useStore((state) => state.neighborhoods);
  const [open, setOpen] = React.useState(false);

  const selectedDistrict = districts.find(district => district.id === selectedDistrictId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[365px] justify-between text-black"
        >
          {selectedDistrict ? selectedDistrict.name_ar : "اختر المنطقة"}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-[365px] p-0">
        <Command>
          <CommandInput placeholder="ابحث عن منطقة..." />
          <CommandList className="text-black max-h-[200px] overflow-y-auto">
            {districts.map((district) => (
              <CommandItem
                key={district.id}
                onSelect={() => {
                  onDistrictSelect(district.id);
                  setOpen(false);
                }}
                className="text-black"
              >
                {district.name_ar}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DistrictSelector;