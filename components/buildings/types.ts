// Types for Buildings Management System

export interface Property {
  id: number;
  region_id: number | null;
  payment_method: string | null;
  user_id: number;
  project_id: number;
  building_id: number;
  building: any;
  water_meter_number: string | null;
  electricity_meter_number: string | null;
  deed_number: string | null;
  category_id: number;
  featured_image: string;
  floor_planning_image: string[];
  video_image: string | null;
  price: string;
  pricePerMeter: string | null;
  purpose: string;
  type: string;
  beds: number;
  bath: number;
  area: string;
  size: string | null;
  video_url: string | null;
  virtual_tour: string | null;
  status: number;
  property_status: string;
  featured: number;
  features: string[] | string;
  faqs: Array<{
    question: string;
    answer: string;
    displayOnPage: boolean;
  }>;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  reorder: number;
  reorder_featured: number;
  featured_image_url: string;
  title?: string;
  address?: string;
  slug?: string;
}

export interface User {
  id: number;
  tenant_id: number | null;
  account_type: string;
  active: boolean;
  last_login_at: string;
  google_id: string | null;
  first_name: string;
  last_name: string;
  photo: string | null;
  username: string;
  email: string;
  subscribed: boolean;
  subscription_amount: string;
  referral_code: string;
  referred_by: string | null;
  company_name: string;
  phone: string;
  message: string | null;
  city: string;
  state: string;
  address: string;
  country: string;
  rbac_version: number;
  rbac_seeded_at: string;
  featured: number;
  status: number;
  online_status: number;
  verification_link: string;
  email_verified: number;
  subdomain_status: number;
  created_at: string;
  updated_at: string;
  preview_template: number;
  template_img: string | null;
  template_serial_number: number;
  pm_type: string | null;
  pm_last_four: string | null;
  trial_ends_at: string | null;
  template_name: string | null;
  show_home: string | null;
  onboarding_completed: boolean;
  industry_type: string | null;
  short_description: string | null;
  logo: string | null;
  icon: string | null;
  primary_color: string;
  show_even_if_empty: boolean;
}

export interface Building {
  id: number;
  name: string;
  image: string | null;
  deed_number: string | null;
  deed_image: string | null;
  water_meter_number: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  deed_image_url: string | null;
  user: User;
  properties: Property[];
}

export interface BuildingsResponse {
  status: string;
  data: {
    current_page: number;
    data: Building[];
    total: number;
    last_page: number;
    per_page: number;
    first_page_url: string;
    from: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    prev_page_url: string | null;
    to: number;
  };
}

export interface BuildingsStats {
  totalBuildings: number;
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  soldProperties: number;
  residentialProperties: number;
  commercialProperties: number;
  rentProperties: number;
  saleProperties: number;
  avgPropertiesPerBuilding: number;
  occupancyRate: number;
  availabilityRate: number;
}
