// utils/uploadSingle.js
import axiosInstance from "@/lib/axiosInstance";

export async function uploadSingleFile(file, context, subFolder = null) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("context", context);
  if (subFolder) {
    formData.append("sub_folder", subFolder);
  }

  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_Backend_URL}/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
