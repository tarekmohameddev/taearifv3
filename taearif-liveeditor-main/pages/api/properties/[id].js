// API endpoint for single property by ID
import { properties } from './propertiesData.js';

export default function handler(req, res) {

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle different HTTP methods
  if (req.method === 'GET') {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }
    
    // Find property by ID
    const property = properties.find(p => p.id === id);
    
    if (property) {
      res.status(200).json({
        success: true,
        data: property
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
