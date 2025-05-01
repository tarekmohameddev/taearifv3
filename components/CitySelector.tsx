// components/CitySelector.tsx
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

interface CitySelectorProps {
  selectedCityId: string | number | null;
  onCitySelect: (cityId: string | number) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ selectedCityId, onCitySelect }) => {
  const cities = useStore((state) => state.cities);
  const [open, setOpen] = React.useState(false);

  const selectedCity = cities.find(city => city.id === selectedCityId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[365px] justify-between text-black"
        >
          {selectedCity ? selectedCity.name_ar : "اختر مدينة"}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-[365px] p-0">
        <Command>
          <CommandInput placeholder="ابحث عن مدينة..." />
          <CommandList className="text-black max-h-[200px] overflow-y-auto">
            {cities.map((city) => (
              <CommandItem
                key={city.id}
                onSelect={() => {
                  onCitySelect(city.id);
                  setOpen(false);
                }}
                className="text-black"
              >
                {city.name_ar}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitySelector;