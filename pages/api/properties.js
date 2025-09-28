// API endpoint for properties data
import { properties } from './properties/propertiesData.js';

export default function handler(req, res) {

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle different HTTP methods
  if (req.method === 'GET') {
    const { id, type, transactionType } = req.query;
    
    let filteredProperties = properties;
    
    // Filter by ID if provided
    if (id) {
      const property = properties.find(p => p.id === id);
      if (property) {
        return res.status(200).json({
          success: true,
          data: property
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }
    }
    
    // Filter by type if provided
    if (type) {
      filteredProperties = filteredProperties.filter(p => p.type === type);
    }
    
    // Filter by transaction type if provided
    if (transactionType) {
      filteredProperties = filteredProperties.filter(p => p.transactionType === transactionType);
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