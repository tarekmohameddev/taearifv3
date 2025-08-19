import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useCustomersFiltersStore from "@/context/store/customersFilters";

// Interface for filter data from API
interface FilterData {
  cities: Array<{ id: number; name_ar: string; name_en: string }>;
  districts: Array<{ id: number; city_id: number; name_ar: string; name_en: string }>;
  types: Array<{ id: number; name: string; value: string; icon: string; color: string }>;
  priorities: Array<{ id: number; name: string; value: number; icon: string; color: string }>;
  stages: Array<{ id: number; name: string; icon: string | null; color: string | null }>;
  procedures: Array<{ id: number; name: string; icon: string; color: string }>;
}

export const FiltersAndSearch = ({
  setCustomersData,
  setTotalCustomers,
  setLoading,
  setError,
}: any) => {
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Get filter states and actions from the Zustand store
  const {
    searchTerm,
    filterType,
    filterCity,
    filterDistrict,
    filterPriority,
    filterData,
    loadingFilters,
    setSearchTerm,
    setFilterType,
    setFilterCity,
    setFilterDistrict,
    setFilterPriority,
    setFilterData,
    setLoadingFilters,
    clearAllFilters,
    hasActiveFilters
  } = useCustomersFiltersStore();

  // Effect to fetch initial filter data from the API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoadingFilters(true);
        const response = await axiosInstance.get("/customers/filters");
        
        if (response.data.status === "success") {
          setFilterData(response.data.data);
        } else {
          console.error("Failed to fetch filters:", response.data.message);
          // Optionally set an error state for the UI
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
        // Handle error, maybe show a toast notification
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [setFilterData, setLoadingFilters]);

  // The core search function, rewritten for correctness and clarity
  const performSearch = useCallback(async () => {
    setIsSearching(true);
    setLoading(true);
    setError(null); // Reset error on new search

    try {
      // Get the latest state directly from the store to avoid stale state issues in callbacks
      const currentState = useCustomersFiltersStore.getState();
      const params = new URLSearchParams();
      
      // Build parameters object only with active filters
      if (currentState.searchTerm.trim()) {
        params.append('q', currentState.searchTerm.trim());
      }
      if (currentState.filterCity !== "all") {
        params.append('city_id', currentState.filterCity);
      }
      if (currentState.filterDistrict !== "all") {
        params.append('district_id', currentState.filterDistrict);
      }
             if (currentState.filterType !== "all") {
         params.append('type_id', currentState.filterType);
       }
      // **FIX**: Send the `id` for priority with the correct parameter name `priority_id`.
      if (currentState.filterPriority !== "all") {
        params.append('priority_id', currentState.filterPriority);
      }
      
      let response;
      // If there are any active filters or a search term, use the search endpoint.
      if (params.toString()) {
        console.log('Searching with params:', `/customers/search?${params.toString()}`);
        response = await axiosInstance.get('/customers/search', { params });
      } else {
        // Otherwise, fetch all customers.
        console.log('Fetching all customers');
        response = await axiosInstance.get("/customers");
      }
      
      if (response.data.status === "success") {
        const { customers, summary } = response.data.data;
        setCustomersData(customers || []);
        setTotalCustomers(summary.total_customers || 0);
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (err: any) {
      console.error("Error in search/fetch operation:", err);
      setError(err.message || "An error occurred while fetching data.");
      setCustomersData([]);
      setTotalCustomers(0);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  }, [setCustomersData, setTotalCustomers, setLoading, setError]);


  // Debounced search on input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      performSearch();
    }, 500); // 500ms delay
  };

  // Handle changes in any of the select filters
  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case 'city':
        setFilterCity(value);
        // Reset district when city changes to avoid inconsistent state
        setFilterDistrict("all");
        break;
      case 'district':
        setFilterDistrict(value);
        break;
      case 'type':
        setFilterType(value);
        break;
      case 'priority':
        setFilterPriority(value);
        break;
    }
    
    // Use setTimeout to ensure the state update is processed before triggering the search
    setTimeout(performSearch, 0);
  };

  // Reset all filters and fetch all customers
  const handleResetFilters = () => {
    clearAllFilters();
    setTimeout(performSearch, 0);
  }

  // Cleanup timeout on component unmount
  useEffect(() => {
    const timeout = searchTimeout.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  // Memoized calculation for filtered districts based on the selected city
  const getFilteredDistricts = useCallback(() => {
    if (!filterData?.districts || filterCity === "all") {
      return filterData?.districts || [];
    }
         return filterData.districts.filter((district: any) => 
       district.city_id.toString() === filterCity
     );
  }, [filterData?.districts, filterCity]);

  // Loading state for filters
  if (loadingFilters) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="h-10 w-[300px] bg-gray-200 rounded-md animate-pulse" />
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-[120px] bg-gray-200 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        {isSearching ? (
          <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          type="search"
          placeholder="البحث في العملاء..."
          className="pr-8 w-[300px]"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        {/* Type Filter */}
        <Select value={filterType} onValueChange={(value) => handleFilterChange('type', value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
                         {filterData?.types?.map((type: any) => (
               <SelectItem key={type.id} value={type.id.toString()}>
                 {type.name}
               </SelectItem>
             ))}
          </SelectContent>
        </Select>
        
        {/* City Filter */}
        <Select value={filterCity} onValueChange={(value) => handleFilterChange('city', value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="المدينة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المدن</SelectItem>
                         {filterData?.cities?.map((city: any) => (
               <SelectItem key={city.id} value={city.id.toString()}>
                 {city.name_ar}
               </SelectItem>
             ))}
          </SelectContent>
        </Select>
        
        {/* District Filter */}
        <Select 
          value={filterDistrict} 
          onValueChange={(value) => handleFilterChange('district', value)}
          disabled={filterCity === 'all'} // Disable if no city is selected
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="الحي" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأحياء</SelectItem>
                         {getFilteredDistricts()?.map((district: any) => (
               <SelectItem key={district.id} value={district.id.toString()}>
                 {district.name_ar}
               </SelectItem>
             ))}
          </SelectContent>
        </Select>
        
        {/* Priority Filter */}
        <Select value={filterPriority} onValueChange={(value) => handleFilterChange('priority', value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="الأولوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأولويات</SelectItem>
                         {filterData?.priorities?.map((priority: any) => (
               // **FIX**: The value is now `priority.id` as requested by the user.
               <SelectItem key={priority.id} value={priority.id.toString()}>
                 {priority.name}
               </SelectItem>
             ))}
          </SelectContent>
        </Select>
        
        {/* Reset Button */}
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleResetFilters}
          disabled={!hasActiveFilters()} // Disable if no filters are active
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
