"use client";
import {
  Building,
  Building2,
  Home,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Building } from "./types";

interface BuildingsStatsProps {
  buildings: Building[];
  loading?: boolean;
}

export default function BuildingsStats({ buildings, loading = false }: BuildingsStatsProps) {
  // Calculate statistics
  const totalBuildings = buildings.length;
  const totalProperties = buildings.reduce((acc, building) => acc + building.properties.length, 0);
  
  const availableProperties = buildings.reduce(
    (acc, building) => 
      acc + building.properties.filter(p => p.property_status === "available").length,
    0
  );
  
  const rentedProperties = buildings.reduce(
    (acc, building) => 
      acc + building.properties.filter(p => p.property_status === "rented").length,
    0
  );
  
  const soldProperties = buildings.reduce(
    (acc, building) => 
      acc + building.properties.filter(p => p.property_status === "sold").length,
    0
  );

  const residentialProperties = buildings.reduce(
    (acc, building) => 
      acc + building.properties.filter(p => p.type === "residential").length,
    0
  );
  
  const commercialProperties = buildings.reduce(
    (acc, building) => 
      acc + building.properties.filter(p => p.type === "commercial").length,
    0
  );

  const rentProperties = buildings.reduce(
    (acc, building) => 
      acc + building.properties.filter(p => p.purpose.toLowerCase() === "rent").length,
    0
  );
  
  const saleProperties = buildings.reduce(
    (acc, building) => 
      acc + building.properties.filter(p => p.purpose.toLowerCase() === "sale").length,
    0
  );

  // Calculate average properties per building
  const avgPropertiesPerBuilding = totalBuildings > 0 ? (totalProperties / totalBuildings).toFixed(1) : 0;
  
  // Calculate occupancy rate
  const occupancyRate = totalProperties > 0 ? ((rentedProperties / totalProperties) * 100).toFixed(1) : 0;
  
  // Calculate availability rate
  const availabilityRate = totalProperties > 0 ? ((availableProperties / totalProperties) * 100).toFixed(1) : 0;

  const stats = [
    {
      title: "إجمالي العمارات",
      value: totalBuildings,
      icon: Building2,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      description: "عمارة",
    },
    {
      title: "إجمالي العقارات",
      value: totalProperties,
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "عقار",
    },
    {
      title: "العقارات المتاحة",
      value: availableProperties,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "متاح للإيجار",
    },
    {
      title: "العقارات المؤجرة",
      value: rentedProperties,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "مؤجر حالياً",
    },
  ];

  const detailedStats = [
    {
      title: "العقارات المباعة",
      value: soldProperties,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "متوسط العقارات لكل عمارة",
      value: avgPropertiesPerBuilding,
      icon: PieChart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "معدل الإشغال",
      value: `${occupancyRate}%`,
      icon: Activity,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "معدل التوفر",
      value: `${availabilityRate}%`,
      icon: Clock,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  const propertyTypeStats = [
    {
      title: "العقارات السكنية",
      value: residentialProperties,
      percentage: totalProperties > 0 ? ((residentialProperties / totalProperties) * 100).toFixed(1) : 0,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "العقارات التجارية",
      value: commercialProperties,
      percentage: totalProperties > 0 ? ((commercialProperties / totalProperties) * 100).toFixed(1) : 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const propertyPurposeStats = [
    {
      title: "عقارات للإيجار",
      value: rentProperties,
      percentage: totalProperties > 0 ? ((rentProperties / totalProperties) * 100).toFixed(1) : 0,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "عقارات للبيع",
      value: saleProperties,
      percentage: totalProperties > 0 ? ((saleProperties / totalProperties) * 100).toFixed(1) : 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border border-gray-200">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {detailedStats.map((stat, index) => (
          <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Type Distribution */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">توزيع العقارات حسب النوع</CardTitle>
          <CardDescription>نسبة العقارات السكنية والتجارية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propertyTypeStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Home className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-black">{stat.title}</p>
                    <p className="text-sm text-gray-600">{stat.value} عقار</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-black">{stat.percentage}%</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${stat.bgColor.replace('bg-', 'bg-').replace('-50', '-500')}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Purpose Distribution */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">توزيع العقارات حسب الغرض</CardTitle>
          <CardDescription>نسبة العقارات للإيجار والبيع</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propertyPurposeStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <DollarSign className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-black">{stat.title}</p>
                    <p className="text-sm text-gray-600">{stat.value} عقار</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-black">{stat.percentage}%</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${stat.bgColor.replace('bg-', 'bg-').replace('-50', '-500')}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
