    import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // قراءة ملف defaultData.json
    const filePath = path.join(process.cwd(), 'lib', 'defaultData.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // تحويل JSON string إلى object
    const jsonData = JSON.parse(fileContent);
    
    // إرجاع البيانات مع headers مناسبة
    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error reading defaultData.json:', error);
    res.status(500).json({ 
      message: 'Error reading default data',
      error: error.message 
    });
  }
}
