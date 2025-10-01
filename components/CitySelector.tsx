import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
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
import { cn } from "@/lib/utils";

interface City {
  id: number;
  name_ar: string;
}

interface CitySelectorProps {
  selectedCityId: number | null;
  onCitySelect: (cityId: number) => void;
  className?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCityId,
  onCitySelect,
  className,
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://nzl-backend.com/api/cities?country_id=1",
        );
        setCities(response.data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  const selectedCity = cities.find((city) => city.id === selectedCityId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-between text-black", className)}
        >
          {selectedCity ? selectedCity.name_ar : "اختر مدينة"}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-full] p-0">
        <Command>
          <CommandInput placeholder="ابحث عن مدينة..." />
          <CommandList className="text-black max-h-[200px] overflow-y-auto z-9999">
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
