export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  images?: string[];
  price: number;
  unit: string;
  category: string;
  categorySlug: string;
  subCategory: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  specs?: { label: string; value: string }[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon?: string;
  priority?: boolean;
}

export const CATEGORIES: Category[] = [
  {
    id: "vat-tu-che-chan",
    title: "Vật tư che chắn & bảo vệ công trình",
    description: "Nhóm sản phẩm liên quan trực tiếp đến thi công và bảo vệ sàn, rất phù hợp bán cùng nilon lót sàn.",
    priority: true,
  },
  {
    id: "bao-ho-dau",
    title: "Bảo hộ đầu",
    description: "Dùng để bảo vệ vùng đầu khỏi va đập, vật rơi trong công trình và nhà xưởng.",
  },
  {
    id: "bao-ho-tay",
    title: "Bảo hộ tay",
    description: "Giúp chống cắt, chống nóng, chống hóa chất và chống điện.",
  },
  {
    id: "bao-ho-chan",
    title: "Bảo hộ chân",
    description: "Dùng trong môi trường công trường, nhà xưởng, chống đinh và chống trơn trượt.",
  },
  {
    id: "quan-ao-bao-ho",
    title: "Quần áo bảo hộ",
    description: "Giúp bảo vệ cơ thể khỏi bụi bẩn, nhiệt và hóa chất.",
  },
  {
    id: "thiet-bi-chong-roi",
    title: "Thiết bị chống rơi & làm việc trên cao",
    description: "Dành cho công trình xây dựng, điện lực và vệ sinh kính.",
  },
  {
    id: "thiet-bi-an-toan-khac",
    title: "Thiết bị an toàn khác",
    description: "Các thiết bị hỗ trợ an toàn và cảnh báo trong công trình.",
  },
  {
    id: "dung-cu-cam-tay",
    title: "Dụng cụ thi công cầm tay",
    description: "Các dụng cụ được sử dụng hằng ngày bởi đội thi công.",
  },
  {
    id: "ho-tro-son-noi-that",
    title: "Hỗ trợ sơn & hoàn thiện nội thất",
    description: "Các thiết bị hỗ trợ thi công sơn và bảo vệ nội thất khi làm việc.",
  },
];

export const PRODUCTS: Product[] = [
  // 0. Nilon Lót Sàn Bê Tông
  {
    id: "nilon-lot-san-2zem",
    name: "Nilon Lót Sàn 2zem",
    slug: "nilon-lot-san-2zem",
    category: "nilon-lot-san-be-tong",
    categorySlug: "nilon-lot-san-be-tong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/nilon-lot-san-2zem/img_1.jpg",
    images: [
      "/images/products/nilon-lot-san-2zem/img_1.jpg",
      "/images/products/nilon-lot-san-2zem/img_2.jpg",
      "/images/products/nilon-lot-san-2zem/img_3.jpg",
      "/images/products/nilon-lot-san-2zem/img_4.jpg"
    ],
    description: "Độ dày tiết kiệm, phù hợp cho lót nền đổ bê tông dân dụng, lót chống thấm nền móng công trình.",
    price: 850000,
    unit: "Cuộn",
    isBestSeller: true,
    specs: [
      { label: "Độ dày", value: "2zem (0.02mm)" },
      { label: "Quy cách", value: "Khổ 2m x 100m (hoặc theo yêu cầu)" },
      { label: "Chất liệu", value: "Nhựa PE tái sinh chọn lọc / Nguyên sinh" },
      { label: "Ứng dụng", value: "Lót bê tông lót móng dân dụng, chống mất nước xi măng" }
    ]
  },
  {
    id: "nilon-lot-san-4zem",
    name: "Nilon Lót Sàn 4zem",
    slug: "nilon-lot-san-4zem",
    category: "nilon-lot-san-be-tong",
    categorySlug: "nilon-lot-san-be-tong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/nilon-lot-san-4zem/img_1.jpg",
    images: [
      "/images/products/nilon-lot-san-4zem/img_1.jpg",
      "/images/products/nilon-lot-san-4zem/img_2.jpg",
      "/images/products/nilon-lot-san-4zem/img_3.jpg",
      "/images/products/nilon-lot-san-4zem/img_4.jpg"
    ],
    description: "Độ bền cao, chịu lực xé tốt. Chuyên dùng cho các dự án hạ tầng, đường giao thông, nhà xưởng quy mô lớn.",
    price: 1150000,
    unit: "Cuộn",
    isBestSeller: true,
    specs: [
      { label: "Độ dày", value: "4zem (0.04mm)" },
      { label: "Quy cách", value: "Khổ 2m (xòe 4m) x 100m" },
      { label: "Chất liệu", value: "Nhựa PE tái sinh Grade A cao cấp" },
      { label: "Ứng dụng", value: "Chống thấm móng nhà xưởng, lót đường bê tông nông thôn & hạ tầng KCN" }
    ]
  },
  {
    id: "nilon-lot-san-6zem",
    name: "Nilon Lót Sàn 6zem",
    slug: "nilon-lot-san-6zem",
    category: "nilon-lot-san-be-tong",
    categorySlug: "nilon-lot-san-be-tong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/nilon-lot-san-6zem/img_1.jpg",
    images: [
      "/images/products/nilon-lot-san-6zem/img_1.jpg",
      "/images/products/nilon-lot-san-6zem/img_2.jpg",
      "/images/products/nilon-lot-san-6zem/img_3.jpg",
      "/images/products/nilon-lot-san-6zem/img_4.jpg"
    ],
    description: "Độ dày vượt trội, chống thấm tuyệt đối và chống xé rách cực tốt. Dùng cho công trình đặc thù cao cấp.",
    price: 1650000,
    unit: "Cuộn",
    isBestSeller: true,
    specs: [
      { label: "Độ dày", value: "6zem (0.06mm)" },
      { label: "Quy cách", value: "Khổ 2m (xòe 4m) / Khổ 3m (xòe 6m)" },
      { label: "Chất liệu", value: "Hỗn hợp PE nguyên sinh & tái sinh cao cấp" },
      { label: "Ứng dụng", value: "Lót sàn bê tông chịu tải trọng lớn, công trình hạ tầng trọng điểm" }
    ]
  },
  // 1. Bảo hộ đầu
  {
    id: "mu-bao-ho-cong-trinh",
    name: "Mũ bảo hộ công trình",
    slug: "mu-bao-ho-cong-trinh",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-dau",
    image: "/images/products/mu-bao-ho-cong-trinh/img_1.jpg",
    images: [
      "/images/products/mu-bao-ho-cong-trinh/img_1.jpg",
      "/images/products/mu-bao-ho-cong-trinh/img_2.jpg",
      "/images/products/mu-bao-ho-cong-trinh/img_3.jpg",
      "/images/products/mu-bao-ho-cong-trinh/img_4.jpg"
    ],
    description: "Mũ bảo hộ chất lượng cao, chịu lực tốt.",
    price: 45000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Nhựa HDPE / ABS chịu lực"},{"label":"Trọng lượng","value":"300g - 400g"},{"label":"Tiêu chuẩn","value":"TCVN 6407:1998"},{"label":"Tính năng","value":"Chống va đập, bảo vệ phần đầu"}],
  },
  {
    id: "non-bao-ho-cach-dien",
    name: "Nón bảo hộ cách điện",
    slug: "non-bao-ho-cach-dien",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-dau",
    image: "/images/products/non-bao-ho-cach-dien/img_1.jpg",
    images: [
      "/images/products/non-bao-ho-cach-dien/img_1.jpg",
      "/images/products/non-bao-ho-cach-dien/img_2.jpg",
      "/images/products/non-bao-ho-cach-dien/img_3.jpg",
      "/images/products/non-bao-ho-cach-dien/img_4.jpg"
    ],
    description: "Chống phóng điện, an toàn cho thợ điện.",
    price: 120000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Nhựa HDPE / ABS chịu lực"},{"label":"Trọng lượng","value":"300g - 400g"},{"label":"Tiêu chuẩn","value":"TCVN 6407:1998"},{"label":"Tính năng","value":"Chống va đập, bảo vệ phần đầu"}],
  },
  {
    id: "mu-chong-va-dap",
    name: "Mũ chống va đập",
    slug: "mu-chong-va-dap",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-dau",
    image: "/images/products/mu-chong-va-dap/img_1.jpg",
    images: [
      "/images/products/mu-chong-va-dap/img_1.jpg",
      "/images/products/mu-chong-va-dap/img_2.jpg",
      "/images/products/mu-chong-va-dap/img_3.jpg",
      "/images/products/mu-chong-va-dap/img_4.jpg"
    ],
    description: "Nhẹ nhàng, bảo vệ tối ưu.",
    price: 35000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Nhựa HDPE / ABS chịu lực"},{"label":"Trọng lượng","value":"300g - 400g"},{"label":"Tiêu chuẩn","value":"TCVN 6407:1998"},{"label":"Tính năng","value":"Chống va đập, bảo vệ phần đầu"}],
  },
  {
    id: "kinh-gan-mu-bao-ho",
    name: "Kính gắn mũ bảo hộ",
    slug: "kinh-gan-mu-bao-ho",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-dau",
    image: "/images/products/kinh-gan-mu-bao-ho/img_1.jpg",
    images: [
      "/images/products/kinh-gan-mu-bao-ho/img_1.jpg",
      "/images/products/kinh-gan-mu-bao-ho/img_2.jpg",
      "/images/products/kinh-gan-mu-bao-ho/img_3.jpg",
      "/images/products/kinh-gan-mu-bao-ho/img_4.jpg"
    ],
    description: "Chống bụi, chống tia UV.",
    price: 25000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Nhựa HDPE / ABS chịu lực"},{"label":"Trọng lượng","value":"300g - 400g"},{"label":"Tiêu chuẩn","value":"TCVN 6407:1998"},{"label":"Tính năng","value":"Chống va đập, bảo vệ phần đầu"}],
  },

  // 2. Bảo hộ tay
  {
    id: "gang-tay-soi",
    name: "Găng tay sợi",
    slug: "gang-tay-soi",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-tay",
    image: "/images/products/gang-tay-soi/img_1.jpg",
    images: [
      "/images/products/gang-tay-soi/img_1.jpg",
      "/images/products/gang-tay-soi/img_2.jpg",
      "/images/products/gang-tay-soi/img_3.jpg",
      "/images/products/gang-tay-soi/img_4.jpg"
    ],
    price: 5000,
    unit: "Đôi",
    specs: [{"label":"Chất liệu","value":"Sợi Cotton / Sợi Poly / Cao su"},{"label":"Kích cỡ","value":"Free size"},{"label":"Tính năng","value":"Chống cắt, chống trơn trượt, bảo vệ tay"}],
  },
  {
    id: "gang-tay-phu-cao-su",
    name: "Găng tay phủ cao su",
    slug: "gang-tay-phu-cao-su",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-tay",
    image: "/images/products/gang-tay-phu-cao-su/img_1.jpg",
    images: [
      "/images/products/gang-tay-phu-cao-su/img_1.jpg",
      "/images/products/gang-tay-phu-cao-su/img_2.jpg",
      "/images/products/gang-tay-phu-cao-su/img_3.jpg",
      "/images/products/gang-tay-phu-cao-su/img_4.jpg"
    ],
    price: 15000,
    unit: "Đôi",
    specs: [{"label":"Chất liệu","value":"Sợi Cotton / Sợi Poly / Cao su"},{"label":"Kích cỡ","value":"Free size"},{"label":"Tính năng","value":"Chống cắt, chống trơn trượt, bảo vệ tay"}],
  },
  {
    id: "gang-tay-chong-cat",
    name: "Găng tay chống cắt",
    slug: "gang-tay-chong-cat",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-tay",
    image: "/images/products/gang-tay-chong-cat/img_1.jpg",
    images: [
      "/images/products/gang-tay-chong-cat/img_1.jpg",
      "/images/products/gang-tay-chong-cat/img_2.jpg",
      "/images/products/gang-tay-chong-cat/img_3.jpg",
      "/images/products/gang-tay-chong-cat/img_4.jpg"
    ],
    price: 85000,
    unit: "Đôi",
    specs: [{"label":"Chất liệu","value":"Sợi Cotton / Sợi Poly / Cao su"},{"label":"Kích cỡ","value":"Free size"},{"label":"Tính năng","value":"Chống cắt, chống trơn trượt, bảo vệ tay"}],
  },
  {
    id: "gang-tay-han",
    name: "Găng tay hàn",
    slug: "gang-tay-han",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-tay",
    image: "/images/products/gang-tay-han/img_1.jpg",
    images: [
      "/images/products/gang-tay-han/img_1.jpg",
      "/images/products/gang-tay-han/img_2.jpg",
      "/images/products/gang-tay-han/img_3.jpg",
      "/images/products/gang-tay-han/img_4.jpg"
    ],
    price: 75000,
    unit: "Đôi",
    specs: [{"label":"Chất liệu","value":"Sợi Cotton / Sợi Poly / Cao su"},{"label":"Kích cỡ","value":"Free size"},{"label":"Tính năng","value":"Chống cắt, chống trơn trượt, bảo vệ tay"}],
  },
  {
    id: "gang-tay-cach-dien",
    name: "Găng tay cách điện",
    slug: "gang-tay-cach-dien",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-tay",
    image: "/images/products/gang-tay-cach-dien/img_1.jpg",
    images: [
      "/images/products/gang-tay-cach-dien/img_1.jpg",
      "/images/products/gang-tay-cach-dien/img_2.jpg",
      "/images/products/gang-tay-cach-dien/img_3.jpg",
      "/images/products/gang-tay-cach-dien/img_4.jpg"
    ],
    price: 250000,
    unit: "Đôi",
    specs: [{"label":"Chất liệu","value":"Sợi Cotton / Sợi Poly / Cao su"},{"label":"Kích cỡ","value":"Free size"},{"label":"Tính năng","value":"Chống cắt, chống trơn trượt, bảo vệ tay"}],
  },

  // 3. Bảo hộ chân
  {
    id: "giay-bao-ho",
    name: "Giày bảo hộ",
    slug: "giay-bao-ho",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-chan",
    image: "/images/products/giay-bao-ho/img_1.jpg",
    images: [
      "/images/products/giay-bao-ho/img_1.jpg",
      "/images/products/giay-bao-ho/img_2.jpg",
      "/images/products/giay-bao-ho/img_3.jpg",
      "/images/products/giay-bao-ho/img_4.jpg"
    ],
    price: 350000,
    unit: "Đôi",
    specs: [{"label":"Mũi giày","value":"Lót thép chống dập ngón"},{"label":"Đế giày","value":"Lót thép chống đinh, chống trơn trượt"},{"label":"Chất liệu","value":"Da công nghiệp / Da thật / Nhựa"},{"label":"Tiêu chuẩn","value":"Tiêu chuẩn an toàn CE S3"}],
  },
  {
    id: "ung-bao-ho",
    name: "Ủng bảo hộ",
    slug: "ung-bao-ho",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-chan",
    image: "/images/products/ung-bao-ho/img_1.jpg",
    images: [
      "/images/products/ung-bao-ho/img_1.jpg",
      "/images/products/ung-bao-ho/img_2.jpg",
      "/images/products/ung-bao-ho/img_3.jpg",
      "/images/products/ung-bao-ho/img_4.jpg"
    ],
    price: 85000,
    unit: "Đôi",
    specs: [{"label":"Mũi giày","value":"Lót thép chống dập ngón"},{"label":"Đế giày","value":"Lót thép chống đinh, chống trơn trượt"},{"label":"Chất liệu","value":"Da công nghiệp / Da thật / Nhựa"},{"label":"Tiêu chuẩn","value":"Tiêu chuẩn an toàn CE S3"}],
  },
  {
    id: "giay-chong-tinh-dien",
    name: "Giày chống tĩnh điện",
    slug: "giay-chong-tinh-dien",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-chan",
    image: "/images/products/giay-chong-tinh-dien/img_1.jpg",
    images: [
      "/images/products/giay-chong-tinh-dien/img_1.jpg",
      "/images/products/giay-chong-tinh-dien/img_2.jpg",
      "/images/products/giay-chong-tinh-dien/img_3.jpg",
      "/images/products/giay-chong-tinh-dien/img_4.jpg"
    ],
    price: 450000,
    unit: "Đôi",
    specs: [{"label":"Mũi giày","value":"Lót thép chống dập ngón"},{"label":"Đế giày","value":"Lót thép chống đinh, chống trơn trượt"},{"label":"Chất liệu","value":"Da công nghiệp / Da thật / Nhựa"},{"label":"Tiêu chuẩn","value":"Tiêu chuẩn an toàn CE S3"}],
  },
  {
    id: "giay-chong-dinh",
    name: "Giày chống đinh",
    slug: "giay-chong-dinh",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "bao-ho-chan",
    image: "/images/products/giay-chong-dinh/img_1.jpg",
    images: [
      "/images/products/giay-chong-dinh/img_1.jpg",
      "/images/products/giay-chong-dinh/img_2.jpg",
      "/images/products/giay-chong-dinh/img_3.jpg",
      "/images/products/giay-chong-dinh/img_4.jpg"
    ],
    price: 550000,
    unit: "Đôi",
    specs: [{"label":"Mũi giày","value":"Lót thép chống dập ngón"},{"label":"Đế giày","value":"Lót thép chống đinh, chống trơn trượt"},{"label":"Chất liệu","value":"Da công nghiệp / Da thật / Nhựa"},{"label":"Tiêu chuẩn","value":"Tiêu chuẩn an toàn CE S3"}],
  },

  // 4. Quần áo bảo hộ
  {
    id: "dong-phuc-cong-nhan",
    name: "Đồng phục công nhân",
    slug: "dong-phuc-cong-nhan",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "quan-ao-bao-ho",
    image: "/images/products/dong-phuc-cong-nhan/img_1.jpg",
    images: [
      "/images/products/dong-phuc-cong-nhan/img_1.jpg",
      "/images/products/dong-phuc-cong-nhan/img_2.jpg",
      "/images/products/dong-phuc-cong-nhan/img_3.jpg",
      "/images/products/dong-phuc-cong-nhan/img_4.jpg"
    ],
    price: 180000,
    unit: "Bộ",
    specs: [{"label":"Chất liệu","value":"Vải Kaki / Pangrim Hàn Quốc / Nilon"},{"label":"Size","value":"S, M, L, XL, XXL"},{"label":"Đặc điểm","value":"Đường may chắc chắn, thấm hút mồ hôi tốt"}],
  },
  {
    id: "quan-ao-phan-quang",
    name: "Quần áo phản quang",
    slug: "quan-ao-phan-quang",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "quan-ao-bao-ho",
    image: "/images/products/quan-ao-phan-quang/img_1.jpg",
    images: [
      "/images/products/quan-ao-phan-quang/img_1.jpg",
      "/images/products/quan-ao-phan-quang/img_2.jpg",
      "/images/products/quan-ao-phan-quang/img_3.jpg",
      "/images/products/quan-ao-phan-quang/img_4.jpg"
    ],
    price: 45000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Vải Kaki / Pangrim Hàn Quốc / Nilon"},{"label":"Size","value":"S, M, L, XL, XXL"},{"label":"Đặc điểm","value":"Đường may chắc chắn, thấm hút mồ hôi tốt"}],
  },
  {
    id: "quan-ao-chong-hoa-chat",
    name: "Quần áo chống hóa chất",
    slug: "quan-ao-chong-hoa-chat",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "quan-ao-bao-ho",
    image: "/images/products/quan-ao-chong-hoa-chat/img_1.jpg",
    images: [
      "/images/products/quan-ao-chong-hoa-chat/img_1.jpg",
      "/images/products/quan-ao-chong-hoa-chat/img_2.jpg",
      "/images/products/quan-ao-chong-hoa-chat/img_3.jpg",
      "/images/products/quan-ao-chong-hoa-chat/img_4.jpg"
    ],
    price: 250000,
    unit: "Bộ",
    specs: [{"label":"Chất liệu","value":"Vải Kaki / Pangrim Hàn Quốc / Nilon"},{"label":"Size","value":"S, M, L, XL, XXL"},{"label":"Đặc điểm","value":"Đường may chắc chắn, thấm hút mồ hôi tốt"}],
  },
  {
    id: "quan-ao-phong-sach",
    name: "Quần áo phòng sạch",
    slug: "quan-ao-phong-sach",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "quan-ao-bao-ho",
    image: "/images/products/quan-ao-phong-sach/img_1.jpg",
    images: [
      "/images/products/quan-ao-phong-sach/img_1.jpg",
      "/images/products/quan-ao-phong-sach/img_2.jpg",
      "/images/products/quan-ao-phong-sach/img_3.jpg",
      "/images/products/quan-ao-phong-sach/img_4.jpg"
    ],
    price: 120000,
    unit: "Bộ",
    specs: [{"label":"Chất liệu","value":"Vải Kaki / Pangrim Hàn Quốc / Nilon"},{"label":"Size","value":"S, M, L, XL, XXL"},{"label":"Đặc điểm","value":"Đường may chắc chắn, thấm hút mồ hôi tốt"}],
  },
  {
    id: "ao-mua-cong-trinh",
    name: "Áo mưa công trình",
    slug: "ao-mua-cong-trinh",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "quan-ao-bao-ho",
    image: "/images/products/ao-mua-cong-trinh/img_1.jpg",
    images: [
      "/images/products/ao-mua-cong-trinh/img_1.jpg",
      "/images/products/ao-mua-cong-trinh/img_2.jpg",
      "/images/products/ao-mua-cong-trinh/img_3.jpg",
      "/images/products/ao-mua-cong-trinh/img_4.jpg"
    ],
    price: 65000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Vải Kaki / Pangrim Hàn Quốc / Nilon"},{"label":"Size","value":"S, M, L, XL, XXL"},{"label":"Đặc điểm","value":"Đường may chắc chắn, thấm hút mồ hôi tốt"}],
  },

  // 5. Thiết bị chống rơi
  {
    id: "day-dai-an-toan",
    name: "Dây đai an toàn",
    slug: "day-dai-an-toan",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "thiet-bi-chong-roi",
    image: "/images/products/day-dai-an-toan/img_1.jpg",
    images: [
      "/images/products/day-dai-an-toan/img_1.jpg",
      "/images/products/day-dai-an-toan/img_2.jpg",
      "/images/products/day-dai-an-toan/img_3.jpg",
      "/images/products/day-dai-an-toan/img_4.jpg"
    ],
    price: 250000,
    unit: "Bộ",
    specs: [{"label":"Chất liệu","value":"Sợi dù cường lực, Móc thép mạ kẽm"},{"label":"Tải trọng","value":"Lên đến 1500kg"},{"label":"Ứng dụng","value":"Làm việc trên cao, vệ sinh kính"}],
  },
  {
    id: "moc-khoa-chong-roi",
    name: "Móc khóa chống rơi",
    slug: "moc-khoa-chong-roi",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "thiet-bi-chong-roi",
    image: "/images/products/moc-khoa-chong-roi/img_1.jpg",
    images: [
      "/images/products/moc-khoa-chong-roi/img_1.jpg",
      "/images/products/moc-khoa-chong-roi/img_2.jpg",
      "/images/products/moc-khoa-chong-roi/img_3.jpg",
      "/images/products/moc-khoa-chong-roi/img_4.jpg"
    ],
    price: 85000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Sợi dù cường lực, Móc thép mạ kẽm"},{"label":"Tải trọng","value":"Lên đến 1500kg"},{"label":"Ứng dụng","value":"Làm việc trên cao, vệ sinh kính"}],
  },
  {
    id: "day-cuu-sinh",
    name: "Dây cứu sinh",
    slug: "day-cuu-sinh",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "thiet-bi-chong-roi",
    image: "/images/products/day-cuu-sinh/img_1.jpg",
    images: [
      "/images/products/day-cuu-sinh/img_1.jpg",
      "/images/products/day-cuu-sinh/img_2.jpg",
      "/images/products/day-cuu-sinh/img_3.jpg",
      "/images/products/day-cuu-sinh/img_4.jpg"
    ],
    price: 15000,
    unit: "Mét",
    specs: [{"label":"Chất liệu","value":"Sợi dù cường lực, Móc thép mạ kẽm"},{"label":"Tải trọng","value":"Lên đến 1500kg"},{"label":"Ứng dụng","value":"Làm việc trên cao, vệ sinh kính"}],
  },
  {
    id: "bo-chong-roi-tu-rut",
    name: "Bộ chống rơi tự rút",
    slug: "bo-chong-roi-tu-rut",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "thiet-bi-chong-roi",
    image: "/images/products/bo-chong-roi-tu-rut/img_1.jpg",
    images: [
      "/images/products/bo-chong-roi-tu-rut/img_1.jpg",
      "/images/products/bo-chong-roi-tu-rut/img_2.jpg",
      "/images/products/bo-chong-roi-tu-rut/img_3.jpg",
      "/images/products/bo-chong-roi-tu-rut/img_4.jpg"
    ],
    price: 1500000,
    unit: "Bộ",
    specs: [{"label":"Chất liệu","value":"Sợi dù cường lực, Móc thép mạ kẽm"},{"label":"Tải trọng","value":"Lên đến 1500kg"},{"label":"Ứng dụng","value":"Làm việc trên cao, vệ sinh kính"}],
  },

  // 6. Thiết bị an toàn khác
  {
    id: "binh-chua-chay",
    name: "Bình chữa cháy",
    slug: "binh-chua-chay",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "thiet-bi-an-toan-khac",
    image: "/images/products/binh-chua-chay/img_1.jpg",
    images: [
      "/images/products/binh-chua-chay/img_1.jpg",
      "/images/products/binh-chua-chay/img_2.jpg",
      "/images/products/binh-chua-chay/img_3.jpg",
      "/images/products/binh-chua-chay/img_4.jpg"
    ],
    price: 280000,
    unit: "Bình",
    specs: [{"label":"Bảo hành","value":"12 tháng"},{"label":"Xuất xứ","value":"Việt Nam / Nhập khẩu"},{"label":"Đóng gói","value":"Tiêu chuẩn"}],
  },
  {
    id: "bien-canh-bao-an-toan",
    name: "Biển cảnh báo an toàn",
    slug: "bien-canh-bao-an-toan",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "thiet-bi-an-toan-khac",
    image: "/images/products/bien-canh-bao-an-toan/img_1.jpg",
    images: [
      "/images/products/bien-canh-bao-an-toan/img_1.jpg",
      "/images/products/bien-canh-bao-an-toan/img_2.jpg",
      "/images/products/bien-canh-bao-an-toan/img_3.jpg",
      "/images/products/bien-canh-bao-an-toan/img_4.jpg"
    ],
    price: 45000,
    unit: "Tấm",
    specs: [{"label":"Bảo hành","value":"12 tháng"},{"label":"Xuất xứ","value":"Việt Nam / Nhập khẩu"},{"label":"Đóng gói","value":"Tiêu chuẩn"}],
  },
  {
    id: "luoi-den-xanh-cong-trinh",
    name: "Lưới đen và lưới xanh công trình",
    slug: "luoi-den-xanh-cong-trinh",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "thiet-bi-an-toan-khac",
    image: "/images/products/luoi-den-xanh-cong-trinh/img_1.jpg",
    images: [
      "/images/products/luoi-den-xanh-cong-trinh/img_1.jpg",
      "/images/products/luoi-den-xanh-cong-trinh/img_2.jpg",
      "/images/products/luoi-den-xanh-cong-trinh/img_3.jpg",
      "/images/products/luoi-den-xanh-cong-trinh/img_4.jpg"
    ],
    price: 12000,
    unit: "m2",
    specs: [{"label":"Bảo hành","value":"12 tháng"},{"label":"Xuất xứ","value":"Việt Nam / Nhập khẩu"},{"label":"Đóng gói","value":"Tiêu chuẩn"}],
  },

  // 7. Vật tư che chắn & bảo vệ công trình (PRIORITY)
  {
    id: "bat-che-cong-trinh",
    name: "Bạt che công trình",
    slug: "bat-che-cong-trinh",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/bat-che-cong-trinh/img_1.jpg",
    images: [
      "/images/products/bat-che-cong-trinh/img_1.jpg",
      "/images/products/bat-che-cong-trinh/img_2.jpg",
      "/images/products/bat-che-cong-trinh/img_3.jpg",
      "/images/products/bat-che-cong-trinh/img_4.jpg"
    ],
    isBestSeller: true,
    price: 15000,
    unit: "m2",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "mang-pe-quan-hang",
    name: "Màng PE quấn hàng",
    slug: "mang-pe-quan-hang",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/mang-pe-quan-hang/img_1.jpg",
    images: [
      "/images/products/mang-pe-quan-hang/img_1.jpg",
      "/images/products/mang-pe-quan-hang/img_2.jpg",
      "/images/products/mang-pe-quan-hang/img_3.jpg",
      "/images/products/mang-pe-quan-hang/img_4.jpg"
    ],
    isBestSeller: true,
    price: 85000,
    unit: "Cuộn",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "bang-keo-cong-nghiep",
    name: "Băng keo công nghiệp",
    slug: "bang-keo-cong-nghiep",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/bang-keo-cong-nghiep/img_1.jpg",
    images: [
      "/images/products/bang-keo-cong-nghiep/img_1.jpg",
      "/images/products/bang-keo-cong-nghiep/img_2.jpg",
      "/images/products/bang-keo-cong-nghiep/img_3.jpg",
      "/images/products/bang-keo-cong-nghiep/img_4.jpg"
    ],
    price: 12000,
    unit: "Cuộn",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "bang-keo-dan-nen",
    name: "Băng keo dán nền",
    slug: "bang-keo-dan-nen",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/bang-keo-dan-nen/img_1.jpg",
    images: [
      "/images/products/bang-keo-dan-nen/img_1.jpg",
      "/images/products/bang-keo-dan-nen/img_2.jpg",
      "/images/products/bang-keo-dan-nen/img_3.jpg",
      "/images/products/bang-keo-dan-nen/img_4.jpg"
    ],
    price: 25000,
    unit: "Cuộn",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "tam-carton-lot-san",
    name: "Tấm carton lót sàn",
    slug: "tam-carton-lot-san",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/tam-carton-lot-san/img_1.jpg",
    images: [
      "/images/products/tam-carton-lot-san/img_1.jpg",
      "/images/products/tam-carton-lot-san/img_2.jpg",
      "/images/products/tam-carton-lot-san/img_3.jpg",
      "/images/products/tam-carton-lot-san/img_4.jpg"
    ],
    price: 8000,
    unit: "Tấm",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "luoi-bao-che-xay-dung",
    name: "Lưới bao che xây dựng",
    slug: "luoi-bao-che-xay-dung",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/luoi-bao-che-xay-dung/img_1.jpg",
    images: [
      "/images/products/luoi-bao-che-xay-dung/img_1.jpg",
      "/images/products/luoi-bao-che-xay-dung/img_2.jpg",
      "/images/products/luoi-bao-che-xay-dung/img_3.jpg",
      "/images/products/luoi-bao-che-xay-dung/img_4.jpg"
    ],
    price: 18000,
    unit: "m2",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "tam-phu-chong-bui",
    name: "Tấm phủ chống bụi",
    slug: "tam-phu-chong-bui",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/tam-phu-chong-bui/img_1.jpg",
    images: [
      "/images/products/tam-phu-chong-bui/img_1.jpg",
      "/images/products/tam-phu-chong-bui/img_2.jpg",
      "/images/products/tam-phu-chong-bui/img_3.jpg",
      "/images/products/tam-phu-chong-bui/img_4.jpg"
    ],
    price: 35000,
    unit: "Tấm",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "tam-nhua-corrugated",
    name: "Tấm nhựa corrugated",
    slug: "tam-nhua-corrugated",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/tam-nhua-corrugated/img_1.jpg",
    images: [
      "/images/products/tam-nhua-corrugated/img_1.jpg",
      "/images/products/tam-nhua-corrugated/img_2.jpg",
      "/images/products/tam-nhua-corrugated/img_3.jpg",
      "/images/products/tam-nhua-corrugated/img_4.jpg"
    ],
    price: 45000,
    unit: "Tấm",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "xop-chong-soc",
    name: "Xốp chống sốc",
    slug: "xop-chong-soc",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/xop-chong-soc/img_1.jpg",
    images: [
      "/images/products/xop-chong-soc/img_1.jpg",
      "/images/products/xop-chong-soc/img_2.jpg",
      "/images/products/xop-chong-soc/img_3.jpg",
      "/images/products/xop-chong-soc/img_4.jpg"
    ],
    price: 150000,
    unit: "Cuộn",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },
  {
    id: "bat-soc-xanh-cam",
    name: "Bạt sọc xanh cam",
    slug: "bat-soc-xanh-cam",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "vat-tu-che-chan",
    image: "/images/products/bat-soc-xanh-cam/img_1.jpg",
    images: [
      "/images/products/bat-soc-xanh-cam/img_1.jpg",
      "/images/products/bat-soc-xanh-cam/img_2.jpg",
      "/images/products/bat-soc-xanh-cam/img_3.jpg",
      "/images/products/bat-soc-xanh-cam/img_4.jpg"
    ],
    price: 18000,
    unit: "m2",
    specs: [{"label":"Chất liệu","value":"Nhựa PE / HDPE / Nilon nguyên sinh"},{"label":"Độ bền","value":"1 đến 3 năm ngoài trời"},{"label":"Kích thước","value":"Đa dạng (1m, 2m, 3m, 4m...)"},{"label":"Tính năng","value":"Che nắng, mưa, bụi bẩn công trình"}],
  },

  // 8. Dụng cụ thi công cầm tay
  {
    id: "dao-roc-giay",
    name: "Dao rọc giấy",
    slug: "dao-roc-giay",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "dung-cu-cam-tay",
    image: "/images/products/dao-roc-giay/img_1.jpg",
    images: [
      "/images/products/dao-roc-giay/img_1.jpg",
      "/images/products/dao-roc-giay/img_2.jpg",
      "/images/products/dao-roc-giay/img_3.jpg",
      "/images/products/dao-roc-giay/img_4.jpg"
    ],
    price: 15000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Thép hợp kim cao cấp / Nhựa cứng"},{"label":"Thương hiệu","value":"Chính hãng"},{"label":"Bảo hành","value":"6 tháng"}],
  },
  {
    id: "bay-tret",
    name: "Bay trét",
    slug: "bay-tret",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "dung-cu-cam-tay",
    image: "/images/products/bay-tret/img_1.jpg",
    images: [
      "/images/products/bay-tret/img_1.jpg",
      "/images/products/bay-tret/img_2.jpg",
      "/images/products/bay-tret/img_3.jpg",
      "/images/products/bay-tret/img_4.jpg"
    ],
    price: 25000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Thép hợp kim cao cấp / Nhựa cứng"},{"label":"Thương hiệu","value":"Chính hãng"},{"label":"Bảo hành","value":"6 tháng"}],
  },
  {
    id: "co-son",
    name: "Cọ sơn",
    slug: "co-son",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "dung-cu-cam-tay",
    image: "/images/products/co-son/img_1.jpg",
    images: [
      "/images/products/co-son/img_1.jpg",
      "/images/products/co-son/img_2.jpg",
      "/images/products/co-son/img_3.jpg",
      "/images/products/co-son/img_4.jpg"
    ],
    price: 12000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Thép hợp kim cao cấp / Nhựa cứng"},{"label":"Thương hiệu","value":"Chính hãng"},{"label":"Bảo hành","value":"6 tháng"}],
  },
  {
    id: "ru-lo-son",
    name: "Ru lô sơn",
    slug: "ru-lo-son",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "dung-cu-cam-tay",
    image: "/images/products/ru-lo-son/img_1.jpg",
    images: [
      "/images/products/ru-lo-son/img_1.jpg",
      "/images/products/ru-lo-son/img_2.jpg",
      "/images/products/ru-lo-son/img_3.jpg",
      "/images/products/ru-lo-son/img_4.jpg"
    ],
    price: 35000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Thép hợp kim cao cấp / Nhựa cứng"},{"label":"Thương hiệu","value":"Chính hãng"},{"label":"Bảo hành","value":"6 tháng"}],
  },
  {
    id: "thuoc-cuon",
    name: "Thước cuộn",
    slug: "thuoc-cuon",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "dung-cu-cam-tay",
    image: "/images/products/thuoc-cuon/img_1.jpg",
    images: [
      "/images/products/thuoc-cuon/img_1.jpg",
      "/images/products/thuoc-cuon/img_2.jpg",
      "/images/products/thuoc-cuon/img_3.jpg",
      "/images/products/thuoc-cuon/img_4.jpg"
    ],
    price: 45000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Thép hợp kim cao cấp / Nhựa cứng"},{"label":"Thương hiệu","value":"Chính hãng"},{"label":"Bảo hành","value":"6 tháng"}],
  },
  {
    id: "bua",
    name: "Búa",
    slug: "bua",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "dung-cu-cam-tay",
    image: "/images/products/bua/img_1.jpg",
    images: [
      "/images/products/bua/img_1.jpg",
      "/images/products/bua/img_2.jpg",
      "/images/products/bua/img_3.jpg",
      "/images/products/bua/img_4.jpg"
    ],
    price: 85000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Thép hợp kim cao cấp / Nhựa cứng"},{"label":"Thương hiệu","value":"Chính hãng"},{"label":"Bảo hành","value":"6 tháng"}],
  },
  {
    id: "kim",
    name: "Kìm",
    slug: "kim",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "dung-cu-cam-tay",
    image: "/images/products/kim/img_1.jpg",
    images: [
      "/images/products/kim/img_1.jpg",
      "/images/products/kim/img_2.jpg",
      "/images/products/kim/img_3.jpg",
      "/images/products/kim/img_4.jpg"
    ],
    price: 65000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Thép hợp kim cao cấp / Nhựa cứng"},{"label":"Thương hiệu","value":"Chính hãng"},{"label":"Bảo hành","value":"6 tháng"}],
  },
  {
    id: "sung-ban-keo-silicon",
    name: "Súng bắn keo silicon",
    slug: "sung-ban-keo-silicon",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "dung-cu-cam-tay",
    image: "/images/products/sung-ban-keo-silicon/img_1.jpg",
    images: [
      "/images/products/sung-ban-keo-silicon/img_1.jpg",
      "/images/products/sung-ban-keo-silicon/img_2.jpg",
      "/images/products/sung-ban-keo-silicon/img_3.jpg",
      "/images/products/sung-ban-keo-silicon/img_4.jpg"
    ],
    price: 45000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Thép hợp kim cao cấp / Nhựa cứng"},{"label":"Thương hiệu","value":"Chính hãng"},{"label":"Bảo hành","value":"6 tháng"}],
  },

  // 9. Thiết bị hỗ trợ sơn & hoàn thiện nội thất
  {
    id: "bang-keo-giay-che-son",
    name: "Băng keo giấy che sơn",
    slug: "bang-keo-giay-che-son",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/bang-keo-giay-che-son/img_1.jpg",
    images: [
      "/images/products/bang-keo-giay-che-son/img_1.jpg",
      "/images/products/bang-keo-giay-che-son/img_2.jpg",
      "/images/products/bang-keo-giay-che-son/img_3.jpg",
      "/images/products/bang-keo-giay-che-son/img_4.jpg"
    ],
    price: 15000,
    unit: "Cuộn",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "nilon-che-noi-that",
    name: "Nilon che nội thất",
    slug: "nilon-che-noi-that",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/nilon-che-noi-that/img_1.jpg",
    images: [
      "/images/products/nilon-che-noi-that/img_1.jpg",
      "/images/products/nilon-che-noi-that/img_2.jpg",
      "/images/products/nilon-che-noi-that/img_3.jpg",
      "/images/products/nilon-che-noi-that/img_4.jpg"
    ],
    isBestSeller: true,
    price: 25000,
    unit: "Cuộn",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "khay-son",
    name: "Khay sơn",
    slug: "khay-son",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/khay-son/img_1.jpg",
    images: [
      "/images/products/khay-son/img_1.jpg",
      "/images/products/khay-son/img_2.jpg",
      "/images/products/khay-son/img_3.jpg",
      "/images/products/khay-son/img_4.jpg"
    ],
    price: 15000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "thang-nhom",
    name: "Thang nhôm",
    slug: "thang-nhom",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/thang-nhom/img_1.jpg",
    images: [
      "/images/products/thang-nhom/img_1.jpg",
      "/images/products/thang-nhom/img_2.jpg",
      "/images/products/thang-nhom/img_3.jpg",
      "/images/products/thang-nhom/img_4.jpg"
    ],
    price: 1200000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "may-phun-son",
    name: "Máy phun sơn",
    slug: "may-phun-son",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/may-phun-son/img_1.jpg",
    images: [
      "/images/products/may-phun-son/img_1.jpg",
      "/images/products/may-phun-son/img_2.jpg",
      "/images/products/may-phun-son/img_3.jpg",
      "/images/products/may-phun-son/img_4.jpg"
    ],
    price: 3500000,
    unit: "Bộ",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "giay-nham",
    name: "Giấy nhám",
    slug: "giay-nham",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/giay-nham/img_1.jpg",
    images: [
      "/images/products/giay-nham/img_1.jpg",
      "/images/products/giay-nham/img_2.jpg",
      "/images/products/giay-nham/img_3.jpg",
      "/images/products/giay-nham/img_4.jpg"
    ],
    price: 5000,
    unit: "Tờ",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "keo-silicone",
    name: "Keo silicone",
    slug: "keo-silicone",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/keo-silicone/img_1.jpg",
    images: [
      "/images/products/keo-silicone/img_1.jpg",
      "/images/products/keo-silicone/img_2.jpg",
      "/images/products/keo-silicone/img_3.jpg",
      "/images/products/keo-silicone/img_4.jpg"
    ],
    price: 45000,
    unit: "Chai",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "keo-dan-xay-dung",
    name: "Keo dán xây dựng",
    slug: "keo-dan-xay-dung",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/keo-dan-xay-dung/img_1.jpg",
    images: [
      "/images/products/keo-dan-xay-dung/img_1.jpg",
      "/images/products/keo-dan-xay-dung/img_2.jpg",
      "/images/products/keo-dan-xay-dung/img_3.jpg",
      "/images/products/keo-dan-xay-dung/img_4.jpg"
    ],
    price: 65000,
    unit: "Tuýp",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "khan-lau-cong-nghiep",
    name: "Khăn lau công nghiệp",
    slug: "khan-lau-cong-nghiep",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/khan-lau-cong-nghiep/img_1.jpg",
    images: [
      "/images/products/khan-lau-cong-nghiep/img_1.jpg",
      "/images/products/khan-lau-cong-nghiep/img_2.jpg",
      "/images/products/khan-lau-cong-nghiep/img_3.jpg",
      "/images/products/khan-lau-cong-nghiep/img_4.jpg"
    ],
    price: 25000,
    unit: "kg",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "xe-day-hang",
    name: "Xe đẩy hàng",
    slug: "xe-day-hang",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/xe-day-hang/img_1.jpg",
    images: [
      "/images/products/xe-day-hang/img_1.jpg",
      "/images/products/xe-day-hang/img_2.jpg",
      "/images/products/xe-day-hang/img_3.jpg",
      "/images/products/xe-day-hang/img_4.jpg"
    ],
    price: 1500000,
    unit: "Cái",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
  {
    id: "gian-giao-tre",
    name: "Giàn giáo tre",
    slug: "gian-giao-tre",
    category: "bao-ho-lao-dong",
    categorySlug: "bao-ho-lao-dong",
    subCategory: "ho-tro-son-noi-that",
    image: "/images/products/gian-giao-tre/img_1.jpg",
    images: [
      "/images/products/gian-giao-tre/img_1.jpg",
      "/images/products/gian-giao-tre/img_2.jpg",
      "/images/products/gian-giao-tre/img_3.jpg",
      "/images/products/gian-giao-tre/img_4.jpg"
    ],
    price: 50000,
    unit: "Cây",
    specs: [{"label":"Chất liệu","value":"Nhựa, Nhôm, Giấy chuyên dụng"},{"label":"Đặc tính","value":"Tiện lợi, dễ sử dụng, bảo vệ bề mặt"},{"label":"Xuất xứ","value":"Việt Nam"}],
  },
];

export const products = PRODUCTS;
