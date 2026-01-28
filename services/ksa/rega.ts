/**
 * REGA (Real Estate General Authority) API Integration
 * 
 * This service handles integration with REGA platforms:
 * - FAL (Real Estate Brokerage)
 * - Real Estate Registry
 * - Real Estate Indicators
 * 
 * Official API: https://rega.gov.sa/en/eservices/
 */

import axiosInstance from "@/lib/axiosInstance";

// Types
export interface REGABrokerageLicenseVerificationRequest {
  licenseNumber: string;
  nationalId?: string;
}

export interface REGABrokerageLicenseVerificationResponse {
  licenseNumber: string;
  licenseType: 'individual' | 'establishment';
  status: 'active' | 'expired' | 'suspended';
  issuedDate: string;
  expiryDate: string;
  holderName: string;
  verified: boolean;
}

export interface REGABrokerageContractQueryRequest {
  nationalId: string;
  contractType?: 'sale' | 'rent' | 'both';
}

export interface REGABrokerageContract {
  contractId: string;
  contractNumber: string;
  type: 'sale' | 'rent' | 'both';
  status: 'active' | 'completed' | 'cancelled';
  propertyId?: string;
  startDate: string;
  endDate?: string;
  brokerId: string;
  clientId: string;
}

/**
 * Verify brokerage license status via REGA FAL platform
 */
export async function verifyBrokerageLicense(
  request: REGABrokerageLicenseVerificationRequest
): Promise<REGABrokerageLicenseVerificationResponse> {
  // TODO: Integrate with actual REGA API
  // For now, this is a stub that calls our backend which would proxy to REGA
  
  try {
    const response = await axiosInstance.post('/api/ksa/rega/verify-license', request);
    return response.data;
  } catch (error) {
    console.error('Error verifying brokerage license:', error);
    throw new Error('Failed to verify brokerage license');
  }
}

/**
 * Query brokerage contracts for a specific user
 */
export async function queryBrokerageContracts(
  request: REGABrokerageContractQueryRequest
): Promise<REGABrokerageContract[]> {
  // TODO: Integrate with actual REGA API
  
  try {
    const response = await axiosInstance.post('/api/ksa/rega/query-contracts', request);
    return response.data.contracts || [];
  } catch (error) {
    console.error('Error querying brokerage contracts:', error);
    throw new Error('Failed to query brokerage contracts');
  }
}

/**
 * Get real estate indicators (market data) for a specific area
 */
export async function getRealEstateIndicators(params: {
  city?: string;
  district?: string;
  propertyType?: string;
  period?: string; // e.g., '2024-Q1'
}) {
  // TODO: Integrate with Real Estate Indicators platform
  
  try {
    const response = await axiosInstance.get('/api/ksa/rega/indicators', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching real estate indicators:', error);
    throw new Error('Failed to fetch real estate indicators');
  }
}

/**
 * Verify property deed (صك) in Real Estate Registry
 */
export async function verifyPropertyDeed(deedNumber: string) {
  // TODO: Integrate with Real Estate Registry
  
  try {
    const response = await axiosInstance.post('/api/ksa/rega/verify-deed', { deedNumber });
    return response.data;
  } catch (error) {
    console.error('Error verifying property deed:', error);
    throw new Error('Failed to verify property deed');
  }
}
