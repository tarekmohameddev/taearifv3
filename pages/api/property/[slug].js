export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // This is a mock API endpoint - replace with your actual backend API
    // For now, we'll return the sample data you provided
    const mockPropertyData = {
      property: {
        id: 780,
        slug: "taon-haos-1",
        title: "تاون هاوس 1",
        district: "حي الهنداوية - مكة المكرمة",
        price: "150000.00",
        views: 0,
        bedrooms: 0,
        bathrooms: null,
        area: "3336.00",
        type: "residential",
        transactionType: "rent",
        image:
          "https://taearif.com/properties/15a9c12a-8524-4199-8074-8c4a97a2179c.jpg",
        status: "available",
        createdAt: "2025-10-11T18:52:48.000000Z",
        description:
          "تاون هاوس فاخر بتصميم مودرن، يقع في قلب حي النرجس شمال الرياض. يتميز بتوزيع ذكي للمساحات الداخلية، وحديقة خلفية صغيرة تمنح خصوصية تامة. يتكون من طابقين: الدور الأرضي يضم مجلس واسع ومطبخ مفتوح على الصالة، والدور العلوي يحتوي على 3 غرف نوم رئيسية مع دورة مياه خاصة لكل غرفة.",
        features: [],
        location: {
          lat: 24.769278,
          lng: 46.754937,
          address:
            "RFHA4461، 4461 الخبيت، 7076، حي الحمراء، الرياض 13216، السعودية، مكة المكرمة",
        },
        images: [
          "https://taearif.com/properties/15a9c12a-8524-4199-8074-8c4a97a2179c.jpg",
          "https://taearif.com/properties/bef9bab9-ce52-4fdb-a798-9af2af185f6d.jpg",
          "https://taearif.com/properties/b1f399d0-6532-453c-8ae7-8e858bf70732.png",
          "https://taearif.com/properties/eaf47f70-2fb5-4c4f-812a-a65511d6e2d4.png",
          "https://taearif.com/properties/4f8c4946-f1f9-4da8-bc93-f6d5f9783b1c.png",
          "https://taearif.com/properties/0512b5bf-f808-42e1-af7c-ffcce8c7e08a.png",
        ],
        payment_method: "quarterly",
        pricePerMeter: "500.00",
        floor_planning_image: [
          "https://taearif.com/properties/8e67eb01-1ee5-4ee0-93ab-184216bf2821.webp",
          "https://taearif.com/properties/32493d38-2f90-4e32-b3fd-1eb7bbac673e.jpg",
          "https://taearif.com/properties/dac2441b-7575-41ae-82dc-700c3318440f.jpg",
          "https://taearif.com/properties/ec2b8e55-9b51-464b-ab28-8e78e53eb581.webp",
          "https://taearif.com/properties/965c0e80-179f-48b5-aed7-6320f9452db3.jpg",
        ],
        video_url: null,
        virtual_tour:
          "https://www.youtube.com/watch?v=aZhTP0I9YnM&list=RDlzwQgqZmaus&index=24",
        video_image: null,
        faqs: [
          {
            id: 1760208634403,
            question: "هل العقار مفروش؟",
            answer: "نعم",
            displayOnPage: true,
          },
          {
            id: 1760208659628,
            question: "هل العقار جديد أم مستخدم؟",
            answer:
              "العقار جديد تمامًا، تم الانتهاء من البناء في عام 2024 ولم يُسكن من قبل.",
            displayOnPage: true,
          },
          {
            id: 1760208672603,
            question: "هل العقار مزود بضمانات؟",
            answer:
              "نعم، يوجد ضمان على الهيكل الخرساني لمدة 10 سنوات، وضمانات على الكهرباء والسباكة لمدة سنتين.",
            displayOnPage: true,
          },
          {
            id: 1760208680395,
            question: "هل يوجد غرفة خادمة أو سائق؟",
            answer: "نعم، يوجد غرفة خادمة بدورة مياه خاصة، ولا يوجد غرفة سائق.",
            displayOnPage: true,
          },
          {
            id: 1760208689451,
            question: "هل العقار متصل بنظام سمارت هوم؟",
            answer:
              "نعم، يحتوي على نظام ذكي للتحكم في الإضاءة والتكييف عن بُعد.",
            displayOnPage: true,
          },
          {
            id: 1760208697619,
            question: "هل الموقع قريب من الخدمات والمدارس؟",
            answer:
              "الموقع مميز جدًا في حي النرجس بالرياض، قريب من طريق أبو بكر الصديق، ومدارس ومراكز تسوق وخدمات متعددة.",
            displayOnPage: true,
          },
          {
            id: 1760208705659,
            question: "هل يوجد مجلس خارجي أو حديقة؟",
            answer: "يوجد حديقة خلفية صغيرة ومجلس داخلي واسع للضيوف.",
            displayOnPage: true,
          },
        ],
        building: null,
        property_id: 937,
        facade_id: 5,
        length: "20.00",
        width: "15.00",
        street_width_north: "15.00",
        street_width_south: "10.00",
        street_width_east: "12.00",
        street_width_west: "20.00",
        building_age: 2026,
        rooms: 2,
        created_at: "2025-10-11T18:52:49.000000Z",
        updated_at: "2025-10-11T18:52:49.000000Z",
        floors: 4,
        floor_number: 1,
        kitchen: 1,
        driver_room: 1,
        maid_room: 3,
        dining_room: 5,
        living_room: 1,
        majlis: 4,
        storage_room: 4,
        basement: 3,
        swimming_pool: 4,
        balcony: 3,
        garden: 1,
        annex: 1,
        elevator: 1,
        private_parking: 4,
        size: "3336.00",
      },
    };

    // Check if the slug matches
    if (slug === mockPropertyData.property.slug) {
      return res.status(200).json(mockPropertyData);
    } else {
      return res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    console.error("Error fetching property:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
