// ملف لتحسين تحميل البيانات وتجنب إعادة التحميل

// دالة لتحميل بيانات الـ tenant مسبقاً
export async function preloadTenantData(tenantId: string) {
  try {
    // محاولة جلب البيانات من cache أولاً
    const cachedData = await getCachedTenantData(tenantId);
    if (cachedData) {
      return cachedData;
    }

    // إذا لم تكن البيانات في cache، جلبها من API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tenant/${tenantId}`,
      {
        headers: {
          "Cache-Control": "max-age=300", // cache لمدة 5 دقائق
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant data: ${response.status}`);
    }

    const data = await response.json();

    // حفظ البيانات في cache
    await setCachedTenantData(tenantId, data);

    return data;
  } catch (error) {
    console.error("Error preloading tenant data:", error);
    return null;
  }
}

// دالة للحصول على البيانات من cache
async function getCachedTenantData(tenantId: string) {
  try {
    // استخدام localStorage في client-side
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(`tenant_${tenantId}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // التحقق من أن البيانات لم تنته صلاحيتها (5 دقائق)
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting cached tenant data:", error);
    return null;
  }
}

// دالة لحفظ البيانات في cache
async function setCachedTenantData(tenantId: string, data: any) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `tenant_${tenantId}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
    }
  } catch (error) {
    console.error("Error setting cached tenant data:", error);
  }
}

// دالة لمسح cache البيانات المنتهية الصلاحية
export function clearExpiredCache() {
  try {
    if (typeof window !== "undefined") {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("tenant_")) {
          try {
            const cached = localStorage.getItem(key);
            if (cached) {
              const { timestamp } = JSON.parse(cached);
              // إذا انتهت صلاحية البيانات (أكثر من 5 دقائق)
              if (Date.now() - timestamp > 5 * 60 * 1000) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            // إذا كان هناك خطأ في parsing، احذف المفتاح
            localStorage.removeItem(key);
          }
        }
      });
    }
  } catch (error) {
    console.error("Error clearing expired cache:", error);
  }
}
