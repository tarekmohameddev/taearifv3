/**
 * Mock API for onboarding steps.
 * Simulates real backend calls with realistic delays.
 * Replace with real axiosInstance calls when backend is ready.
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface BrandSettingsPayload {
  websiteName: string;
  logoBase64?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface ContactInfoPayload {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

export interface FirstPropertyPayload {
  propertyTitle: string;
  propertyType: string;
  propertyPrice: string;
  propertyCity: string;
  propertyImageBase64?: string;
}

export interface IntegrationsPayload {
  whatsappNumber?: string;
  metaPixelId?: string;
}

export interface OnboardingStatusResponse {
  brand: boolean;
  contact: boolean;
  property: boolean;
  integrations: boolean;
}

export async function saveBrandSettings(data: BrandSettingsPayload): Promise<{ success: true; message: string }> {
  await delay(700);
  // Simulate occasional errors for testing
  // if (Math.random() < 0.1) throw new Error("حدث خطأ غير متوقع، حاول مرة أخرى");
  console.log("[Mock API] saveBrandSettings:", data);
  return { success: true, message: "تم حفظ بيانات العلامة التجارية" };
}

export async function saveContactInfo(data: ContactInfoPayload): Promise<{ success: true; message: string }> {
  await delay(600);
  console.log("[Mock API] saveContactInfo:", data);
  return { success: true, message: "تم حفظ بيانات التواصل" };
}

export async function saveFirstProperty(data: FirstPropertyPayload): Promise<{ success: true; message: string; propertyId: string }> {
  await delay(900);
  console.log("[Mock API] saveFirstProperty:", data);
  return {
    success: true,
    message: "تم إضافة العقار بنجاح",
    propertyId: `prop_${Date.now()}`,
  };
}

export async function saveIntegrations(data: IntegrationsPayload): Promise<{ success: true; message: string }> {
  await delay(800);
  console.log("[Mock API] saveIntegrations:", data);
  return { success: true, message: "تم ربط التكاملات بنجاح" };
}

export async function connectWhatsApp(phoneNumber: string): Promise<{ success: true; connected: boolean }> {
  await delay(1200);
  console.log("[Mock API] connectWhatsApp:", phoneNumber);
  return { success: true, connected: true };
}

export async function connectMetaPixel(pixelId: string): Promise<{ success: true; connected: boolean }> {
  await delay(1000);
  console.log("[Mock API] connectMetaPixel:", pixelId);
  return { success: true, connected: true };
}

export async function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  await delay(300);
  return {
    brand: false,
    contact: false,
    property: false,
    integrations: false,
  };
}
