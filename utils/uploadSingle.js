// utils/uploadSingle.js
import axiosInstance from '@/lib/axiosInstance';

const uploadRules = {
  blog: { path: 'blogs/', maxWidth: 1200, maxSize: 2048, allowedTypes: ['jpg', 'jpeg', 'png', 'webp'] },
  property: { path: 'properties/', maxWidth: 1600, maxSize: 5120, allowedTypes: ['jpg', 'jpeg', 'png', 'webp'] },
  project: { path: 'projects/', maxWidth: 1600, maxSize: 5120, allowedTypes: ['jpg', 'jpeg', 'png', 'webp'] },
  profile: { path: 'profiles/', maxWidth: 500, maxSize: 1024, allowedTypes: ['jpg', 'jpeg', 'png'] },
  logo: { path: 'logos/', maxWidth: 400, maxSize: 1024, allowedTypes: ['jpg', 'jpeg', 'png', 'svg'] },
  content: { path: 'content/', maxWidth: 1600, maxSize: 3072, allowedTypes: ['jpg', 'jpeg', 'png', 'webp', 'svg'] },
  template: { path: 'templates/', maxWidth: 1200, maxSize: 2048, allowedTypes: ['jpg', 'jpeg', 'png'] },
  app: { path: 'apps/', maxWidth: 800, maxSize: 1024, allowedTypes: ['jpg', 'jpeg', 'png', 'svg'] },
};

export async function uploadSingleFile(file, context, subFolder = null) {
  if (!uploadRules[context]) {
    throw new Error('Invalid upload context');
  }
  
  const { maxWidth, maxSize, allowedTypes } = uploadRules[context];
  const fileType = file.name.split('.').pop().toLowerCase();
  const fileSizeKB = file.size / 1024;

  if (!allowedTypes.includes(fileType)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (fileSizeKB > maxSize) {
    throw new Error(`File size exceeds the limit of ${maxSize} KB`);
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('context', context);
  if (subFolder) {
    formData.append('sub_folder', subFolder);
  }

  try {
    const response = await axiosInstance.post('https://taearif.com/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}