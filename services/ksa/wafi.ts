/**
 * Wafi Program API Integration
 * 
 * This service handles integration with Wafi off-plan sales platform
 * 
 * Official: https://wafi.sa/ (managed by Ministry of Housing)
 */

import axiosInstance from "@/lib/axiosInstance";

// Types
export interface WafiLicenseVerificationRequest {
  licenseNumber: string;
  projectId?: string;
  developerCRNumber?: string; // Commercial Registration
}

export interface WafiLicenseVerificationResponse {
  licenseNumber: string;
  projectName: string;
  developerName: string;
  status: 'planning' | 'licensed' | 'construction' | 'completed' | 'handed_over';
  issuedDate: string;
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  verified: boolean;
}

export interface EscrowMilestoneRequest {
  projectId: string;
  milestoneNumber: number;
  percentage: number;
  targetDate: string;
  description: string;
}

export interface EscrowReleaseCertificationRequest {
  projectId: string;
  milestoneId: string;
  certificationDocumentUrl: string;
  certifiedBy: string; // Consulting office
  completionPercentage: number;
  requestedAmount: number;
}

export interface EscrowReleaseCertificationResponse {
  success: boolean;
  certificationId?: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

/**
 * Verify Wafi project license
 */
export async function verifyWafiLicense(
  request: WafiLicenseVerificationRequest
): Promise<WafiLicenseVerificationResponse> {
  // TODO: Integrate with actual Wafi API
  
  try {
    const response = await axiosInstance.post('/api/ksa/wafi/verify-license', request);
    return response.data;
  } catch (error) {
    console.error('Error verifying Wafi license:', error);
    throw new Error('Failed to verify Wafi license');
  }
}

/**
 * Create escrow milestone for off-plan project
 */
export async function createEscrowMilestone(
  request: EscrowMilestoneRequest
): Promise<{ success: boolean; milestoneId?: string }> {
  // TODO: Integrate with actual Wafi/SAMA escrow API
  
  try {
    const response = await axiosInstance.post('/api/ksa/wafi/escrow/milestone', request);
    return response.data;
  } catch (error) {
    console.error('Error creating escrow milestone:', error);
    throw new Error('Failed to create escrow milestone');
  }
}

/**
 * Request escrow release certification
 */
export async function requestEscrowRelease(
  request: EscrowReleaseCertificationRequest
): Promise<EscrowReleaseCertificationResponse> {
  // TODO: Integrate with actual Wafi/SAMA escrow API
  // This would require certification from licensed consulting office
  
  try {
    const response = await axiosInstance.post('/api/ksa/wafi/escrow/release-request', request);
    return response.data;
  } catch (error) {
    console.error('Error requesting escrow release:', error);
    throw new Error('Failed to request escrow release');
  }
}

/**
 * Get escrow account balance for project
 */
export async function getEscrowBalance(projectId: string): Promise<{
  projectId: string;
  totalBalance: number;
  releasedAmount: number;
  pendingRelease: number;
  holdbackAmount: number; // 5% holdback until completion
}> {
  // TODO: Integrate with SAMA escrow API
  
  try {
    const response = await axiosInstance.get(`/api/ksa/wafi/escrow/balance/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching escrow balance:', error);
    throw new Error('Failed to fetch escrow balance');
  }
}

/**
 * Report handover defect
 */
export async function reportHandoverDefect(defect: {
  projectId: string;
  unitId: string;
  category: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
  photos?: string[];
}): Promise<{ success: boolean; defectId?: string }> {
  // TODO: Integrate with Wafi defect tracking system
  
  try {
    const response = await axiosInstance.post('/api/ksa/wafi/defects/report', defect);
    return response.data;
  } catch (error) {
    console.error('Error reporting handover defect:', error);
    throw new Error('Failed to report handover defect');
  }
}

/**
 * Get project construction progress
 */
export async function getProjectProgress(projectId: string): Promise<{
  projectId: string;
  overallProgress: number;
  milestones: Array<{
    milestoneNumber: number;
    status: string;
    percentage: number;
    completionDate?: string;
  }>;
  lastUpdated: string;
}> {
  // TODO: Integrate with Wafi project tracking
  
  try {
    const response = await axiosInstance.get(`/api/ksa/wafi/project/${projectId}/progress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project progress:', error);
    throw new Error('Failed to fetch project progress');
  }
}
