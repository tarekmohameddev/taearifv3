"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageSquare, Loader2, AlertTriangle, PlusCircle } from "lucide-react";
import useCrmStore from "@/context/store/crm";
import axiosInstance from "@/lib/axiosInstance";
import {
  CrmActivityCard,
  CrmCard,
  Project,
  Property,
} from "./crm-activity-card";
import { AddActivityForm } from "./add-activity-form";

export default function CustomerDetailDialog() {
  const { showCustomerDialog, selectedCustomer, setShowCustomerDialog, setSelectedCustomer } = useCrmStore();
  
  const [cards, setCards] = useState<CrmCard[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      setShowAddForm(false); // Reset form visibility
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [cardsRes, projectsRes, propertiesRes] = await Promise.all([
            axiosInstance.get(`/v1/crm/cards?customer_id=${selectedCustomer.id}`),
            axiosInstance.get("/projects"),
            axiosInstance.get("/properties"),
          ]);

          if (cardsRes.data.status === "success") {
            setCards(cardsRes.data.data.cards || []);
          }
          if (projectsRes.data.status === "success") {
            setProjects(projectsRes.data.data.projects || []);
          }
          if (propertiesRes.data.status === "success") {
            setProperties(propertiesRes.data.data.properties || []);
          }
        } catch (err) {
          console.error("Failed to fetch customer details:", err);
          setError("فشل في تحميل تفاصيل العميل.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [selectedCustomer]);
  
  const handleAddCard = async (data: any) => {
    if (!selectedCustomer) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        card_customer_id: selectedCustomer.id,
      };
      const response = await axiosInstance.post("/v1/crm/cards", payload);
      if (response.data.status === true) {
        // Assuming the response returns the newly created card
        const newCard = response.data.data; 
        setCards(prev => [newCard, ...prev]);
        setShowAddForm(false);
      } else {
        setError(response.data.message || "فشل في إضافة النشاط.");
      }
    } catch (err) {
      console.error("Failed to add card:", err);
      setError("حدث خطأ أثناء إضافة النشاط.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleClose = () => {
    setShowCustomerDialog(false);
    setTimeout(() => {
      setSelectedCustomer(null)
      setCards([]);
      setProjects([]);
      setProperties([]);
    }, 150);
  };

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 3: return <Badge className="bg-red-100 text-red-800">عالية</Badge>;
      case 2: return <Badge className="bg-yellow-100 text-yellow-800">متوسطة</Badge>;
      case 1: return <Badge className="bg-green-100 text-green-800">منخفضة</Badge>;
      default: return <Badge variant="secondary">عادية</Badge>;
    }
  };

  const getDisplayText = (value: any, fallback: string = "غير محدد") => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && 'name_ar' in value) return value.name_ar;
    return fallback;
  };

  const handleCall = () => {
    if (selectedCustomer?.phone_number) {
      window.open(`tel:${selectedCustomer.phone_number}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    if (selectedCustomer?.phone_number) {
      const message = `مرحباً ${selectedCustomer.name}، أتمنى أن تكون بخير.`;
      const whatsappUrl = `https://wa.me/${selectedCustomer.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!selectedCustomer) return null;

  return (
    <Dialog open={showCustomerDialog} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] flex flex-col p-0 sm:p-6 mx-auto my-4 rounded-2xl" dir="قفم">
        <DialogHeader className="flex-shrink-0 border-b pb-4 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedCustomer.name.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-lg sm:text-xl font-bold truncate">{selectedCustomer.name}</DialogTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {getDisplayText(selectedCustomer.customer_type)}
                  </p>
                </div>
              </div>
              <div className="self-start sm:self-center">
                {getPriorityBadge(selectedCustomer.priority)}
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm" 
                onClick={handleCall}
                disabled={!selectedCustomer?.phone_number}
                title={selectedCustomer?.phone_number ? `اتصل بـ ${selectedCustomer.phone_number}` : "لا يوجد رقم هاتف"}
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">اتصل</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm" 
                onClick={handleWhatsApp}
                disabled={!selectedCustomer?.phone_number}
                title={selectedCustomer?.phone_number ? `راسل على واتساب: ${selectedCustomer.phone_number}` : "لا يوجد رقم هاتف"}
              >
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">واتساب</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[300px] sm:min-h-[400px]">
          <div className="max-w-lg mx-auto w-full space-y-4">
            {!showAddForm && (
              <Button variant="outline" className="w-full gap-2 text-sm sm:text-base" onClick={() => setShowAddForm(true)}>
                <PlusCircle className="h-4 w-4" />
                إضافة نشاط أو ملاحظة
              </Button>
            )}

            {showAddForm && (
              <AddActivityForm
                projects={projects}
                properties={properties}
                onSubmit={handleAddCard}
                onCancel={() => setShowAddForm(false)}
                isSubmitting={isSubmitting}
              />
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-48 sm:h-64">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <p className="text-xs sm:text-sm text-muted-foreground">جاري تحميل الأنشطة...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-red-500">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                <p className="text-xs sm:text-sm text-center">{error}</p>
              </div>
            ) : cards.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {cards.map((card) => (
                  <CrmActivityCard
                    key={card.id}
                    card={card}
                    projects={projects}
                    properties={properties}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 sm:h-64">
                <p className="text-xs sm:text-sm text-muted-foreground text-center">لا توجد ملاحظات أو أنشطة لهذا العميل.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
