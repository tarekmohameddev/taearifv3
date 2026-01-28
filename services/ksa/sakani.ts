/**
 * Sakani Program API Integration
 * 
 * This service handles integration with Sakani housing program
 * 
 * Official: https://sakani.sa/
 */

import axiosInstance from "@/lib/axiosInstance";

// Types
export interface SakaniEligibilityCheckRequest {
  nationalId: string;
  name: string;
  dateOfBirth: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  householdSize: number;
  householdIncome: number;
  currentlyOwnsProperty: boolean;
}

export interface SakaniEligibilityCheckResponse {
  eligible: boolean;
  sakaniId?: string;
  eligibilityScore?: number;
  approvedLoanAmount?: number;
  downPaymentSupport?: number;
  eligibleProducts: Array<
    'ready_unit' | 'under_construction' | 'self_construction' | 'moh_land' | 'easy_installment'
  >;
  message?: string;
  verifiedAt: string;
}

export interface SakaniProductQueryRequest {
  city?: string;
  district?: string;
  productType?: 'ready_unit' | 'under_construction' | 'self_construction' | 'moh_land';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
}

export interface SakaniProduct {
  productId: string;
  productType: string;
  title: string;
  location: {
    city: string;
    district: string;
  };
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  developer?: string;
  availableUnits: number;
  projectCompletionDate?: string;
  images?: string[];
}

/**
 * Check Sakani eligibility for a customer
 */
export async function checkSakaniEligibility(
  request: SakaniEligibilityCheckRequest
): Promise<SakaniEligibilityCheckResponse> {
  // TODO: Integrate with actual Sakani API
  // This would require official API access from Ministry of Housing
  
  try {
    const response = await axiosInstance.post('/api/ksa/sakani/check-eligibility', request);
    return response.data;
  } catch (error) {
    console.error('Error checking Sakani eligibility:', error);
    throw new Error('Failed to check Sakani eligibility');
  }
}

/**
 * Query available Sakani products
 */
export async function querySakaniProducts(
  request: SakaniProductQueryRequest
): Promise<SakaniProduct[]> {
  // TODO: Integrate with actual Sakani API
  
  try {
    const response = await axiosInstance.post('/api/ksa/sakani/query-products', request);
    return response.data.products || [];
  } catch (error) {
    console.error('Error querying Sakani products:', error);
    throw new Error('Failed to query Sakani products');
  }
}

/**
 * Get Sakani beneficiary details
 */
export async function getSakaniBeneficiaryDetails(
  sakaniId: string
): Promise<{
  sakaniId: string;
  name: string;
  eligibilityStatus: 'eligible' | 'not_eligible' | 'pending';
  approvedLoanAmount?: number;
  downPaymentSupport?: number;
  reservedProduct?: string;
  applicationStatus?: 'pending' | 'approved' | 'rejected' | 'completed';
}> {
  // TODO: Integrate with actual Sakani API
  
  try {
    const response = await axiosInstance.get(`/api/ksa/sakani/beneficiary/${sakaniId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Sakani beneficiary details:', error);
    throw new Error('Failed to fetch Sakani beneficiary details');
  }
}

/**
 * Reserve a Sakani product for eligible customer
 */
export async function reserveSakaniProduct(params: {
  sakaniId: string;
  productId: string;
  nationalId: string;
}): Promise<{
  success: boolean;
  reservationId?: string;
  expiryDate?: string;
  message?: string;
}> {
  // TODO: Integrate with actual Sakani API
  
  try {
    const response = await axiosInstance.post('/api/ksa/sakani/reserve-product', params);
    return response.data;
  } catch (error) {
    console.error('Error reserving Sakani product:', error);
    throw new Error('Failed to reserve Sakani product');
  }
}

/**
 * Get REDF (Real Estate Development Fund) support information
 */
export async function getREDFSupportInfo(nationalId: string): Promise<{
  eligible: boolean;
  supportAmount?: number;
  subsidizedInterestRate?: number;
  loanTenure?: number;
  message?: string;
}> {
  // TODO: Integrate with REDF API
  
  try {
    const response = await axiosInstance.post('/api/ksa/redf/support-info', { nationalId });
    return response.data;
  } catch (error) {
    console.error('Error fetching REDF support info:', error);
    throw new Error('Failed to fetch REDF support info');
  }
}
