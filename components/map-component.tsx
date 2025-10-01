"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function MapComponent({
  latitude,
  longitude,
  onPositionChange,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !mapRef.current) {
      // Wait for DOM to be ready
      const initMap = () => {
        try {
          const mapElement = document.getElementById("map");
          if (!mapElement) {
            console.warn("Map element not found, retrying...");
            setTimeout(initMap, 100);
            return;
          }

          // Fix Leaflet icon issues by using CDN URLs
          const DefaultIcon = L.icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          L.Marker.prototype.options.icon = DefaultIcon;

          // Initialize map
          const map = L.map("map").setView([latitude, longitude], 13);

          // Add OpenStreetMap tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          // Add marker
          const marker = L.marker([latitude, longitude], {
            draggable: true,
          }).addTo(map);

          // Handle marker drag
          marker.on("dragend", (e: L.DragEndEvent) => {
            const position = marker.getLatLng();
            onPositionChange(position.lat, position.lng);
          });

          // Handle map click
          map.on("click", (e: L.LeafletMouseEvent) => {
            marker.setLatLng(e.latlng);
            onPositionChange(e.latlng.lat, e.latlng.lng);
          });

          mapRef.current = map;
          markerRef.current = marker;
          setMapInitialized(true);
        } catch (error) {
          console.error("Error initializing map:", error);
          // Retry after a short delay
          setTimeout(initMap, 500);
        }
      };

      // Start initialization
      initMap();
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.error("Error removing map:", error);
        }
        mapRef.current = null;
        markerRef.current = null;
        setMapInitialized(false);
      }
    };
  }, []);

  // Update marker position if props change
  useEffect(() => {
    if (markerRef.current && mapRef.current && mapInitialized) {
      try {
        // Only update if position has changed
        const currentPos = markerRef.current.getLatLng();
        if (currentPos.lat !== latitude || currentPos.lng !== longitude) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapRef.current.setView([latitude, longitude]);
        }
      } catch (error) {
        console.error("Error updating map position:", error);
      }
    }
  }, [latitude, longitude, mapInitialized]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError("");

    try {
      // Use OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = Number.parseFloat(lat);
        const longitude = Number.parseFloat(lon);

        // Update marker and map position
        if (markerRef.current && mapRef.current && mapInitialized) {
          try {
            markerRef.current.setLatLng([latitude, longitude]);
            mapRef.current.setView([latitude, longitude], 13);

            // Call the callback to update parent component state
            onPositionChange(latitude, longitude);
          } catch (error) {
            console.error("Error updating map position during search:", error);
          }
        }
      } else {
        setSearchError("لم يتم العثور على نتائج للبحث");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchError("حدث خطأ أثناء البحث");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-3 left-3 right-3 z-[1000] bg-white rounded-md shadow-md">
        <form onSubmit={handleSearch} className="flex items-center p-2">
          <Input
            type="text"
            placeholder="ابحث عن موقع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            dir="rtl"
          />
          <Button
            type="submit"
            size="sm"
            className="mr-2"
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
        {searchError && (
          <div className="bg-red-50 text-red-500 p-2 text-sm text-center rounded-b-md">
            {searchError}
          </div>
        )}
      </div>
      <div
        id="map"
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
      />
      {!mapInitialized && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">جاري تحميل الخريطة...</p>
          </div>
        </div>
      )}
    </div>
  );
}
