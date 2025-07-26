// utils/uploadMultiple.js
import axiosInstance from "@/lib/axiosInstance";

export async function uploadMultipleFiles(files, context, subFolder = null) {
  const formData = new FormData();

  // إضافة جميع الملفات إلى formData
  for (let file of files) {
    formData.append("files[]", file);
  }

  // إضافة السياق والمجلد الفرعي إن وجد
  formData.append("context", context);
  if (subFolder) {
    formData.append("sub_folder", subFolder);
  }

  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_Backend_URL}/upload-multiple`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data.data.files;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
