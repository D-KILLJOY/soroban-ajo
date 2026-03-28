/**
 * KYC Service - wraps calls to the backend KYC endpoints.
 */

import { ApiError, nextApiClient } from '@/lib/apiClient'
import { apiPaths } from '@/lib/apiEndpoints'

type KycStatusResponse = {
  status: {
    level: number
    status: string
    requestedAt?: string
    verifiedAt?: string
    rejectedAt?: string
    documents?: unknown[]
  }
}

function errorMessageFromApi(e: unknown, fallback: string): string {
  if (e instanceof ApiError && e.body && typeof e.body === 'object' && 'error' in e.body) {
    const msg = (e.body as { error?: unknown }).error
    if (typeof msg === 'string') return msg
  }
  return fallback
}

export class KycService {
  static async getStatus(): Promise<KycStatusResponse['status']> {
    const data = await nextApiClient.request<KycStatusResponse>({
      path: apiPaths.kyc.status,
      method: 'GET',
    })
    return data.status
  }

  static async requestVerification(): Promise<void> {
    try {
      await nextApiClient.request({
        path: apiPaths.kyc.request,
        method: 'POST',
      })
    } catch (e) {
      throw new Error(errorMessageFromApi(e, 'Failed to request verification'))
    }
  }

  static async uploadDocument(docType: string, data: string): Promise<void> {
    try {
      await nextApiClient.request({
        path: apiPaths.kyc.upload,
        method: 'POST',
        body: { docType, data },
      })
    } catch (e) {
      throw new Error(errorMessageFromApi(e, 'Failed to upload document'))
    }
  }
}
