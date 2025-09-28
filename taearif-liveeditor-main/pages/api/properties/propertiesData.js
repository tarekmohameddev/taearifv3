// Shared properties data for all API endpoints
export const properties = [
  // عقارات للإيجار
  {
    id: "1",
    title: "شقة أرضية فاخرة",
    district: "حي الجواخي - عيون الجواخي المنزه",
    price: "18000",
    views: 134,
    bedrooms: 3,
    bathrooms: 2,
    area: "130",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-07-15T10:30:00Z",
    description: "شقة أرضية فاخرة في موقع مميز، مدخل مستقل، غرفتين نوم بينهم دورة مياه، صالة، مطبخ، وغرفة طعام، مجلس مع دورة مياه، مكيفات شباك، تيار كهربائي مستقل",
    features: ["مكيفات شباك", "تيار كهربائي مستقل", "مدخل مستقل", "مجلس منفصل"],
    location: {
      lat: 26.5054641,
      lng: 43.6368531,
      address: "حي الجواخي - عيون الجواخي المنزه، الرياض"
    },
    contact: {
      name: "أحمد محمد",
      phone: "+966501234567",
      email: "ahmed@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "2",
    title: "شقة عوائل مريحة",
    district: "حي الازهة - مخطط الرياح",
    price: "15000",
    views: 211,
    bedrooms: 2,
    bathrooms: 1,
    area: "100",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-06-22T14:15:00Z",
    description: "شقة عوائل مريحة في مخطط الرياح، غرفتين نوم، صالة واسعة، مطبخ مجهز، دورة مياه واحدة، مكيفات شباك",
    features: ["مكيفات شباك", "مطبخ مجهز", "صالة واسعة"],
    location: {
      lat: 26.5154641,
      lng: 43.6468531,
      address: "حي الازهة - مخطط الرياح، الرياض"
    },
    contact: {
      name: "فاطمة أحمد",
      phone: "+966502345678",
      email: "fatima@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "3",
    title: "شقة عوائل اقتصادية",
    district: "حي التعليم قريب من جامع ابن الخطابي التعليم",
    price: "6000",
    views: 140,
    bedrooms: 2,
    bathrooms: 1,
    area: "80",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "rented",
    createdAt: "2025-05-08T09:45:00Z",
    description: "شقة عوائل اقتصادية في حي التعليم، قريبة من المسجد والمدارس، غرفتين نوم، صالة، مطبخ صغير",
    features: ["قريبة من المسجد", "قريبة من المدارس", "سعر اقتصادي"],
    location: {
      lat: 26.5254641,
      lng: 43.6568531,
      address: "حي التعليم، الرياض"
    },
    contact: {
      name: "محمد علي",
      phone: "+966503456789",
      email: "mohammed@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "4",
    title: "شقة عوائل واسعة",
    district: "الخزان - قرب مسجد العيدي",
    price: "13000",
    views: 189,
    bedrooms: 4,
    bathrooms: 2,
    area: "150",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-08-03T16:20:00Z",
    description: "شقة عوائل واسعة في الخزان، أربع غرف نوم، صالتين، مطبخ كبير، دورتين مياه، مكيفات شباك، قريبة من المسجد",
    features: ["أربع غرف نوم", "صالتين", "مطبخ كبير", "قريبة من المسجد"],
    location: {
      lat: 26.5354641,
      lng: 43.6668531,
      address: "الخزان، الرياض"
    },
    contact: {
      name: "سارة أحمد",
      phone: "+966504567890",
      email: "sara@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "5",
    title: "دور علوي واسع",
    district: "حي الروابي - شارع الملك",
    price: "22000",
    views: 93,
    bedrooms: 5,
    bathrooms: 3,
    area: "200",
    type: "دور علوي",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-04-12T11:10:00Z",
    description: "دور علوي واسع في حي الروابي، خمس غرف نوم، ثلاث دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، مكيفات شباك",
    features: ["خمس غرف نوم", "ثلاث دورات مياه", "مجلس منفصل", "مطبخ مجهز"],
    location: {
      lat: 26.5454641,
      lng: 43.6768531,
      address: "حي الروابي - شارع الملك، الرياض"
    },
    contact: {
      name: "عبدالله محمد",
      phone: "+966505678901",
      email: "abdullah@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "8",
    title: "شقة دوبلكس فاخرة",
    district: "حي النرجس - شارع الأمير",
    price: "25000",
    views: 156,
    bedrooms: 4,
    bathrooms: 3,
    area: "180",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-07-28T13:45:00Z",
    description: "شقة دوبلكس فاخرة في حي النرجس، أربع غرف نوم، ثلاث دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، حديقة صغيرة",
    features: ["أربع غرف نوم", "ثلاث دورات مياه", "حديقة صغيرة", "مجلس منفصل"],
    location: {
      lat: 26.5554641,
      lng: 43.6868531,
      address: "حي النرجس - شارع الأمير، الرياض"
    },
    contact: {
      name: "خالد أحمد",
      phone: "+966506789012",
      email: "khalid@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "9",
    title: "شقة عوائل حديثة",
    district: "حي العليا - شارع التحلية",
    price: "20000",
    views: 198,
    bedrooms: 3,
    bathrooms: 2,
    area: "140",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-06-05T08:30:00Z",
    description: "شقة عوائل حديثة في حي العليا، ثلاث غرف نوم، دورتين مياه، صالة، مطبخ، موقف سيارات، مكيفات مركزية",
    features: ["ثلاث غرف نوم", "موقف سيارات", "مكيفات مركزية", "موقع مميز"],
    location: {
      lat: 26.5654641,
      lng: 43.6968531,
      address: "حي العليا - شارع التحلية، الرياض"
    },
    contact: {
      name: "نورا محمد",
      phone: "+966507890123",
      email: "nora@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "10",
    title: "فيلا عائلية للإيجار",
    district: "حي الشاطئ - كورنيش الدمام",
    price: "35000",
    views: 87,
    bedrooms: 6,
    bathrooms: 4,
    area: "300",
    type: "فيلا",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-05-18T15:25:00Z",
    description: "فيلا عائلية للإيجار في حي الشاطئ، ست غرف نوم، أربع دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، حديقة، موقف سيارات",
    features: ["ست غرف نوم", "أربع دورات مياه", "حديقة", "موقف سيارات", "مجلس منفصل"],
    location: {
      lat: 26.5754641,
      lng: 43.7068531,
      address: "حي الشاطئ - كورنيش الدمام، الرياض"
    },
    contact: {
      name: "سعد العتيبي",
      phone: "+966508901234",
      email: "saad@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "11",
    title: "شقة عوائل هادئة",
    district: "حي الورود - مخطط الملك عبدالله",
    price: "12000",
    views: 145,
    bedrooms: 3,
    bathrooms: 2,
    area: "110",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-07-02T12:00:00Z",
    description: "شقة عوائل هادئة في حي الورود، ثلاث غرف نوم، دورتين مياه، صالة، مطبخ، قريبة من المسجد والمدارس",
    features: ["ثلاث غرف نوم", "قريبة من المسجد", "قريبة من المدارس", "موقع هادئ"],
    location: {
      lat: 26.5854641,
      lng: 43.7168531,
      address: "حي الورود - مخطط الملك عبدالله، الرياض"
    },
    contact: {
      name: "فهد القحطاني",
      phone: "+966509012345",
      email: "fahad@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "12",
    title: "دور مستقل للإيجار",
    district: "حي الجامعة - قرب جامعة الدمام",
    price: "18000",
    views: 112,
    bedrooms: 4,
    bathrooms: 3,
    area: "160",
    type: "دور مستقل",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-04-25T17:40:00Z",
    description: "دور مستقل للإيجار في حي الجامعة، أربع غرف نوم، ثلاث دورات مياه، صالة، مطبخ، مجلس منفصل، قريب من الجامعة",
    features: ["أربع غرف نوم", "ثلاث دورات مياه", "مجلس منفصل", "قريب من الجامعة"],
    location: {
      lat: 26.5954641,
      lng: 43.7268531,
      address: "حي الجامعة - قرب جامعة الدمام، الرياض"
    },
    contact: {
      name: "عبدالرحمن السعد",
      phone: "+966500123456",
      email: "abdulrahman@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "13",
    title: "شقة عوائل مريحة",
    district: "حي الشاطئ - شارع الأمير محمد",
    price: "16000",
    views: 203,
    bedrooms: 3,
    bathrooms: 2,
    area: "125",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-08-10T09:15:00Z",
    description: "شقة عوائل مريحة في حي الشاطئ، ثلاث غرف نوم، دورتين مياه، صالة، مطبخ، قريبة من البحر",
    features: ["ثلاث غرف نوم", "قريبة من البحر", "موقع مميز", "مكيفات شباك"],
    location: {
      lat: 26.6054641,
      lng: 43.7368531,
      address: "حي الشاطئ - شارع الأمير محمد، الرياض"
    },
    contact: {
      name: "مشعل الغامدي",
      phone: "+966501234567",
      email: "mishal@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "14",
    title: "شقة عوائل اقتصادية",
    district: "حي النزهة - شارع الملك فهد",
    price: "8000",
    views: 167,
    bedrooms: 2,
    bathrooms: 1,
    area: "85",
    type: "شقة",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-05-30T14:50:00Z",
    description: "شقة عوائل اقتصادية في حي النزهة، غرفتين نوم، دورة مياه واحدة، صالة، مطبخ، سعر مناسب",
    features: ["غرفتين نوم", "سعر مناسب", "موقع جيد", "مكيفات شباك"],
    location: {
      lat: 26.6154641,
      lng: 43.7468531,
      address: "حي النزهة - شارع الملك فهد، الرياض"
    },
    contact: {
      name: "تركي المطيري",
      phone: "+966502345678",
      email: "turki@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "15",
    title: "فيلا فاخرة للإيجار",
    district: "حي النرجس - شارع الأمير",
    price: "45000",
    views: 76,
    bedrooms: 7,
    bathrooms: 5,
    area: "400",
    type: "فيلا",
    transactionType: "rent",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-06-14T11:35:00Z",
    description: "فيلا فاخرة للإيجار في حي النرجس، سبع غرف نوم، خمس دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، حديقة كبيرة، موقف سيارات",
    features: ["سبع غرف نوم", "خمس دورات مياه", "حديقة كبيرة", "موقف سيارات", "مجلس منفصل"],
    location: {
      lat: 26.6254641,
      lng: 43.7568531,
      address: "حي النرجس - شارع الأمير، الرياض"
    },
    contact: {
      name: "بدر الشمري",
      phone: "+966503456789",
      email: "badr@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },

  // عقارات للبيع
  {
    id: "6",
    title: "فيلا فاخرة للبيع",
    district: "حي النرجس - شارع الأمير",
    price: "850000",
    views: 245,
    bedrooms: 6,
    bathrooms: 4,
    area: "350",
    type: "فيلا",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-07-20T16:45:00Z",
    description: "فيلا فاخرة للبيع في حي النرجس، ست غرف نوم، أربع دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، حديقة، موقف سيارات",
    features: ["ست غرف نوم", "أربع دورات مياه", "حديقة", "موقف سيارات", "مجلس منفصل"],
    location: {
      lat: 26.5554641,
      lng: 43.6868531,
      address: "حي النرجس - شارع الأمير، الرياض"
    },
    contact: {
      name: "خالد أحمد",
      phone: "+966506789012",
      email: "khalid@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "7",
    title: "شقة للبيع",
    district: "حي العليا - شارع التحلية",
    price: "450000",
    views: 178,
    bedrooms: 3,
    bathrooms: 2,
    area: "120",
    type: "شقة",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-05-12T13:20:00Z",
    description: "شقة للبيع في حي العليا، ثلاث غرف نوم، دورتين مياه، صالة، مطبخ، موقف سيارات",
    features: ["ثلاث غرف نوم", "موقف سيارات", "موقع مميز"],
    location: {
      lat: 26.5654641,
      lng: 43.6968531,
      address: "حي العليا - شارع التحلية، الرياض"
    },
    contact: {
      name: "نورا محمد",
      phone: "+966507890123",
      email: "nora@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "16",
    title: "فيلا عائلية للبيع",
    district: "حي الشاطئ - كورنيش الدمام",
    price: "750000",
    views: 189,
    bedrooms: 5,
    bathrooms: 4,
    area: "320",
    type: "فيلا",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-08-05T10:15:00Z",
    description: "فيلا عائلية للبيع في حي الشاطئ، خمس غرف نوم، أربع دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، حديقة، موقف سيارات",
    features: ["خمس غرف نوم", "أربع دورات مياه", "حديقة", "موقف سيارات", "مجلس منفصل"],
    location: {
      lat: 26.5754641,
      lng: 43.7068531,
      address: "حي الشاطئ - كورنيش الدمام، الرياض"
    },
    contact: {
      name: "سعد العتيبي",
      phone: "+966508901234",
      email: "saad@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "17",
    title: "شقة دوبلكس للبيع",
    district: "حي الورود - مخطط الملك عبدالله",
    price: "380000",
    views: 156,
    bedrooms: 4,
    bathrooms: 3,
    area: "180",
    type: "شقة",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-06-28T15:30:00Z",
    description: "شقة دوبلكس للبيع في حي الورود، أربع غرف نوم، ثلاث دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، حديقة صغيرة",
    features: ["أربع غرف نوم", "ثلاث دورات مياه", "حديقة صغيرة", "مجلس منفصل"],
    location: {
      lat: 26.5854641,
      lng: 43.7168531,
      address: "حي الورود - مخطط الملك عبدالله، الرياض"
    },
    contact: {
      name: "فهد القحطاني",
      phone: "+966509012345",
      email: "fahad@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "18",
    title: "دور مستقل للبيع",
    district: "حي الجامعة - قرب جامعة الدمام",
    price: "320000",
    views: 134,
    bedrooms: 4,
    bathrooms: 3,
    area: "160",
    type: "دور مستقل",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-04-18T12:45:00Z",
    description: "دور مستقل للبيع في حي الجامعة، أربع غرف نوم، ثلاث دورات مياه، صالة، مطبخ، مجلس منفصل، قريب من الجامعة",
    features: ["أربع غرف نوم", "ثلاث دورات مياه", "مجلس منفصل", "قريب من الجامعة"],
    location: {
      lat: 26.5954641,
      lng: 43.7268531,
      address: "حي الجامعة - قرب جامعة الدمام، الرياض"
    },
    contact: {
      name: "عبدالرحمن السعد",
      phone: "+966500123456",
      email: "abdulrahman@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "19",
    title: "شقة عوائل للبيع",
    district: "حي الشاطئ - شارع الأمير محمد",
    price: "280000",
    views: 167,
    bedrooms: 3,
    bathrooms: 2,
    area: "125",
    type: "شقة",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-07-08T14:10:00Z",
    description: "شقة عوائل للبيع في حي الشاطئ، ثلاث غرف نوم، دورتين مياه، صالة، مطبخ، قريبة من البحر",
    features: ["ثلاث غرف نوم", "قريبة من البحر", "موقع مميز", "مكيفات شباك"],
    location: {
      lat: 26.6054641,
      lng: 43.7368531,
      address: "حي الشاطئ - شارع الأمير محمد، الرياض"
    },
    contact: {
      name: "مشعل الغامدي",
      phone: "+966501234567",
      email: "mishal@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "20",
    title: "شقة اقتصادية للبيع",
    district: "حي النزهة - شارع الملك فهد",
    price: "180000",
    views: 203,
    bedrooms: 2,
    bathrooms: 1,
    area: "85",
    type: "شقة",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-05-25T09:55:00Z",
    description: "شقة اقتصادية للبيع في حي النزهة، غرفتين نوم، دورة مياه واحدة، صالة، مطبخ، سعر مناسب",
    features: ["غرفتين نوم", "سعر مناسب", "موقع جيد", "مكيفات شباك"],
    location: {
      lat: 26.6154641,
      lng: 43.7468531,
      address: "حي النزهة - شارع الملك فهد، الرياض"
    },
    contact: {
      name: "تركي المطيري",
      phone: "+966502345678",
      email: "turki@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "21",
    title: "فيلا فاخرة للبيع",
    district: "حي النرجس - شارع الأمير",
    price: "950000",
    views: 98,
    bedrooms: 7,
    bathrooms: 5,
    area: "400",
    type: "فيلا",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-06-10T17:25:00Z",
    description: "فيلا فاخرة للبيع في حي النرجس، سبع غرف نوم، خمس دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، حديقة كبيرة، موقف سيارات",
    features: ["سبع غرف نوم", "خمس دورات مياه", "حديقة كبيرة", "موقف سيارات", "مجلس منفصل"],
    location: {
      lat: 26.6254641,
      lng: 43.7568531,
      address: "حي النرجس - شارع الأمير، الرياض"
    },
    contact: {
      name: "بدر الشمري",
      phone: "+966503456789",
      email: "badr@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "22",
    title: "شقة عوائل حديثة للبيع",
    district: "حي العليا - شارع التحلية",
    price: "420000",
    views: 145,
    bedrooms: 3,
    bathrooms: 2,
    area: "140",
    type: "شقة",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-07-30T11:40:00Z",
    description: "شقة عوائل حديثة للبيع في حي العليا، ثلاث غرف نوم، دورتين مياه، صالة، مطبخ، موقف سيارات، مكيفات مركزية",
    features: ["ثلاث غرف نوم", "موقف سيارات", "مكيفات مركزية", "موقع مميز"],
    location: {
      lat: 26.5654641,
      lng: 43.6968531,
      address: "حي العليا - شارع التحلية، الرياض"
    },
    contact: {
      name: "نورا محمد",
      phone: "+966507890123",
      email: "nora@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "23",
    title: "دور علوي للبيع",
    district: "حي الروابي - شارع الملك",
    price: "350000",
    views: 112,
    bedrooms: 5,
    bathrooms: 3,
    area: "200",
    type: "دور علوي",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-04-30T16:15:00Z",
    description: "دور علوي للبيع في حي الروابي، خمس غرف نوم، ثلاث دورات مياه، صالة كبيرة، مطبخ مجهز، مجلس منفصل، مكيفات شباك",
    features: ["خمس غرف نوم", "ثلاث دورات مياه", "مجلس منفصل", "مطبخ مجهز"],
    location: {
      lat: 26.5454641,
      lng: 43.6768531,
      address: "حي الروابي - شارع الملك، الرياض"
    },
    contact: {
      name: "عبدالله محمد",
      phone: "+966505678901",
      email: "abdullah@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "24",
    title: "شقة عوائل واسعة للبيع",
    district: "الخزان - قرب مسجد العيدي",
    price: "290000",
    views: 134,
    bedrooms: 4,
    bathrooms: 2,
    area: "150",
    type: "شقة",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-06-18T13:50:00Z",
    description: "شقة عوائل واسعة للبيع في الخزان، أربع غرف نوم، صالتين، مطبخ كبير، دورتين مياه، مكيفات شباك، قريبة من المسجد",
    features: ["أربع غرف نوم", "صالتين", "مطبخ كبير", "قريبة من المسجد"],
    location: {
      lat: 26.5354641,
      lng: 43.6668531,
      address: "الخزان، الرياض"
    },
    contact: {
      name: "سارة أحمد",
      phone: "+966504567890",
      email: "sara@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  },
  {
    id: "25",
    title: "شقة عوائل اقتصادية للبيع",
    district: "حي التعليم قريب من جامع ابن الخطابي التعليم",
    price: "220000",
    views: 189,
    bedrooms: 2,
    bathrooms: 1,
    area: "80",
    type: "شقة",
    transactionType: "sale",
    image: "/placeholder.svg",
    status: "available",
    createdAt: "2025-05-02T10:20:00Z",
    description: "شقة عوائل اقتصادية للبيع في حي التعليم، قريبة من المسجد والمدارس، غرفتين نوم، صالة، مطبخ صغير",
    features: ["قريبة من المسجد", "قريبة من المدارس", "سعر اقتصادي"],
    location: {
      lat: 26.5254641,
      lng: 43.6568531,
      address: "حي التعليم، الرياض"
    },
    contact: {
      name: "محمد علي",
      phone: "+966503456789",
      email: "mohammed@example.com"
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  }
];