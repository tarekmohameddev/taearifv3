/**
 * EJAR Platform API Integration
 * 
 * This service handles integration with EJAR (إيجار) rental platform
 * 
 * Official API: https://rega.gov.sa/en/eservices/ejar/
 */

import axiosInstance from "@/lib/axiosInstance";

// Types
export interface EjarContractCreationRequest {
  propertyId: string;
  landlordId: string;
  tenantId: string;
  tenantName: string;
  tenantNationalId: string;
  monthlyRent: number;
  securityDeposit?: number;
  startDate: string;
  endDate: string;
  paymentSchedule: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  tenancyType: 'residential' | 'commercial' | 'industrial';
  autoRenewal?: boolean;
}

export interface EjarContractCreationResponse {
  success: boolean;
  ejarContractNumber?: string;
  ejarUrl?: string;
  message?: string;
}

export interface EjarContractQueryRequest {
  ejarContractNumber?: string;
  nationalId?: string;
  propertyId?: string;
}

export interface EjarContract {
  ejarContractNumber: string;
  propertyId: string;
  landlordName: string;
  tenantName: string;
  monthlyRent: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated' | 'renewed';
  createdAt: string;
  ejarUrl?: string;
}

/**
 * Create a new rental contract in EJAR platform
 */
export async function createEjarContract(
  request: EjarContractCreationRequest
): Promise<EjarContractCreationResponse> {
  // TODO: Integrate with actual EJAR API
  // This would typically require OAuth authentication with EJAR
  
  try {
    const response = await axiosInstance.post('/api/ksa/ejar/create-contract', request);
    return response.data;
  } catch (error) {
    console.error('Error creating EJAR contract:', error);
    throw new Error('Failed to create EJAR contract');
  }
}

/**
 * Query existing EJAR contracts
 */
export async function queryEjarContracts(
  request: EjarContractQueryRequest
): Promise<EjarContract[]> {
  // TODO: Integrate with actual EJAR API
  
  try {
    const response = await axiosInstance.post('/api/ksa/ejar/query-contracts', request);
    return response.data.contracts || [];
  } catch (error) {
    console.error('Error querying EJAR contracts:', error);
    throw new Error('Failed to query EJAR contracts');
  }
}

/**
 * Renew an existing EJAR contract
 */
export async function renewEjarContract(
  ejarContractNumber: string,
  newEndDate: string,
  newMonthlyRent?: number
): Promise<EjarContractCreationResponse> {
  // TODO: Integrate with actual EJAR API
  
  try {
    const response = await axiosInstance.post('/api/ksa/ejar/renew-contract', {
      ejarContractNumber,
      newEndDate,
      newMonthlyRent,
    });
    return response.data;
  } catch (error) {
    console.error('Error renewing EJAR contract:', error);
    throw new Error('Failed to renew EJAR contract');
  }
}

/**
 * Terminate an existing EJAR contract
 */
export async function terminateEjarContract(
  ejarContractNumber: string,
  terminationReason: string
): Promise<{ success: boolean; message?: string }> {
  // TODO: Integrate with actual EJAR API
  
  try {
    const response = await axiosInstance.post('/api/ksa/ejar/terminate-contract', {
      ejarContractNumber,
      terminationReason,
    });
    return response.data;
  } catch (error) {
    console.error('Error terminating EJAR contract:', error);
    throw new Error('Failed to terminate EJAR contract');
  }
}

/**
 * Get EJAR contract details by contract number
 */
export async function getEjarContractDetails(
  ejarContractNumber: string
): Promise<EjarContract> {
  // TODO: Integrate with actual EJAR API
  
  try {
    const response = await axiosInstance.get(`/api/ksa/ejar/contract/${ejarContractNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching EJAR contract details:', error);
    throw new Error('Failed to fetch EJAR contract details');
  }
}
