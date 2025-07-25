import axiosInstance from "@/lib/axiosInstance"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    const { stage_id } = req.body

    if (!id || !stage_id) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Customer ID and stage ID are required' 
      })
    }

    // Call the backend API to change customer stage
    const response = await axiosInstance.post(`/crm/customers/${id}/change-stage`, {
      stage_id: parseInt(stage_id)
    })

    if (response.data.status === 'success') {
      return res.status(200).json({
        status: 'success',
        message: 'Customer stage updated successfully',
        data: response.data.data
      })
    } else {
      return res.status(400).json({
        status: 'error',
        message: response.data.message || 'Failed to update customer stage'
      })
    }
  } catch (error) {
    console.error('Error updating customer stage:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
} 