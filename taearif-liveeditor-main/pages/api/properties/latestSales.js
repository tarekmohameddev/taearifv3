// API endpoint for latest sales properties
import { properties } from './propertiesData.js';

export default function handler(req, res) {
  // Filter sale properties and sort by creation date (newest first)
  const saleProperties = properties
    .filter(property => property.transactionType === "sale")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10); // Get latest 10 sale properties

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return the filtered properties data
    res.status(200).json({
      success: true,
      data: saleProperties,
      count: saleProperties.length
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
