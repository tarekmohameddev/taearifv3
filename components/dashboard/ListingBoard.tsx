"use client";

import Link from "next/link";
import { MapPin, Bed, Bath, Square } from "lucide-react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: number;
  type: "للبيع" | "للإيجار";
  status: "متاح" | "محجوز" | "مباع";
  imageColor: string;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "فيلا فاخرة - النرجس",
    location: "الرياض، النرجس",
    price: "$850,000",
    beds: 5,
    baths: 4,
    area: 420,
    type: "للبيع",
    status: "متاح",
    imageColor: "#E8F5EF",
  },
  {
    id: "2",
    title: "شقة حديثة - الملقا",
    location: "الرياض، الملقا",
    price: "$2,500 / شهر",
    beds: 3,
    baths: 2,
    area: 180,
    type: "للإيجار",
    status: "متاح",
    imageColor: "#E3F2FD",
  },
  {
    id: "3",
    title: "دوبلكس راقي - حي الياسمين",
    location: "جدة، الياسمين",
    price: "$420,000",
    beds: 4,
    baths: 3,
    area: 280,
    type: "للبيع",
    status: "محجوز",
    imageColor: "#FFF3E0",
  },
  {
    id: "4",
    title: "شقة استوديو - العليا",
    location: "الرياض، العليا",
    price: "$1,200 / شهر",
    beds: 1,
    baths: 1,
    area: 75,
    type: "للإيجار",
    status: "متاح",
    imageColor: "#F3E5F5",
  },
  {
    id: "5",
    title: "تاون هاوس - ذهبان",
    location: "جدة، ذهبان",
    price: "$320,000",
    beds: 4,
    baths: 3,
    area: 240,
    type: "للبيع",
    status: "مباع",
    imageColor: "#E8EAF6",
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "متاح":  { bg: "#E8F5EF", text: "#1A3C34" },
  "محجوز": { bg: "#FFF3E0", text: "#E07A3A" },
  "مباع":  { bg: "#FDEAEA", text: "#D32F2F" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "للبيع":   { bg: "#E3F2FD", text: "#4A90A4" },
  "للإيجار": { bg: "#E8F5EF", text: "#4CAF82" },
};

function PropertyCard({ property }: { property: Property }) {
  const statusStyle = STATUS_COLORS[property.status] ?? STATUS_COLORS["متاح"];
  const typeStyle   = TYPE_COLORS[property.type]   ?? TYPE_COLORS["للبيع"];

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
    >
      {/* Property Image Placeholder */}
      <div
        style={{
          height: 110,
          width: "100%",
          background: property.imageColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Simple house SVG */}
        <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, height: 45, opacity: 0.4 }}>
          <path d="M40 5 L75 28 L75 58 L5 58 L5 28 Z" fill="#1A3C34" />
          <rect x="28" y="35" width="24" height="23" fill="#E8F5EF" />
          <rect x="52" y="38" width="16" height="16" fill="#E8F5EF" />
          <rect x="12" y="38" width="16" height="16" fill="#E8F5EF" />
        </svg>
        {/* Type Badge */}
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 6,
            background: typeStyle.bg,
            color: typeStyle.text,
          }}
        >
          {property.type}
        </span>
      </div>

      {/* Card Content */}
      <div style={{ padding: "12px 14px" }}>
        <h4
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#1A1A1A",
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {property.title}
        </h4>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin style={{ width: 11, height: 11, color: "#9CA3AF", flexShrink: 0 }} />
          <span
            style={{
              fontSize: 11,
              color: "#9CA3AF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {property.location}
          </span>
        </div>

        {/* Price */}
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3C34", marginBottom: 8 }}>
          {property.price}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Bed style={{ width: 11, height: 11, color: "#9CA3AF" }} />
              <span style={{ fontSize: 11, color: "#6B7280" }}>{property.beds}</span>
            </span>
            <span className="flex items-center gap-1">
              <Bath style={{ width: 11, height: 11, color: "#9CA3AF" }} />
              <span style={{ fontSize: 11, color: "#6B7280" }}>{property.baths}</span>
            </span>
            <span className="flex items-center gap-1">
              <Square style={{ width: 11, height: 11, color: "#9CA3AF" }} />
              <span style={{ fontSize: 11, color: "#6B7280" }}>{property.area}م²</span>
            </span>
          </div>
          {/* Status Badge */}
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: 6,
              background: statusStyle.bg,
              color: statusStyle.text,
            }}
          >
            {property.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ListingBoard() {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>لوحة العقارات</h3>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, color: "#6B7280" }}>الأحدث</span>
          <Link
            href="/dashboard/properties"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1A3C34",
              textDecoration: "none",
              padding: "4px 12px",
              borderRadius: 20,
              border: "1px solid #1A3C34",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1A3C34";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#1A3C34";
            }}
          >
            عرض الكل
          </Link>
        </div>
      </div>

      {/* Properties Row */}
      <div className="flex gap-3">
        {MOCK_PROPERTIES.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
