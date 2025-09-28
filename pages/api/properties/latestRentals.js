// API endpoint for latest rental properties
import { properties } from './propertiesData.js';

export default function handler(req, res) {
  // Filter rental properties and sort by creation date (newest first)
  const rentalProperties = properties
    .filter(property => property.transactionType === "rent")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10); // Get latest 10 rental properties

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle different HTTP methods
  if (req.method === 'GET') {
    const { limit } = req.query;
    
    let filteredProperties = rentalProperties;
    
    // Limit results if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredProperties = filteredProperties.slice(0, limitNum);
      }
    }
    
    res.status(200).json({
      success: true,
      data: filteredProperties,
      total: filteredProperties.length
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}