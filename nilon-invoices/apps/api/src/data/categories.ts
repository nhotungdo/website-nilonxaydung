export interface CategoryData {
  name: string;
  slug: string;
  description: string;
  featured: boolean;
}

export const CATEGORIES: CategoryData[] = [
  {
    name: 'Bảo hộ đầu',
    slug: 'bao-ho-dau',
    description:
      'Dùng để bảo vệ vùng đầu khỏi va đập, vật rơi trong công trình và nhà xưởng.',
    featured: true,
  },
  {
    name: 'Bảo hộ tay',
    slug: 'bao-ho-tay',
    description: 'Giúp chống cắt, chống nóng, chống hóa chất và chống điện.',
    featured: true,
  },
  {
    name: 'Bảo hộ chân',
    slug: 'bao-ho-chan',
    description:
      'Dùng trong môi trường công trường, nhà xưởng, chống đinh và chống trơn trượt.',
    featured: true,
  },
  {
    name: 'Quần áo bảo hộ',
    slug: 'quan-ao-bao-ho',
    description: 'Giúp bảo vệ cơ thể khỏi bụi bẩn, nhiệt và hóa chất.',
    featured: true,
  },
  {
    name: 'Thiết bị chống rơi và làm việc trên cao',
    slug: 'thiet-bi-chong-roi',
    description: 'Dành cho công trình xây dựng, điện lực và vệ sinh kính.',
    featured: true,
  },
  {
    name: 'Thiết bị an toàn khác',
    slug: 'thiet-bi-an-toan-khac',
    description: 'Các thiết bị hỗ trợ an toàn và cảnh báo trong công trình.',
    featured: true,
  },
  {
    name: 'Vật tư che chắn & bảo vệ công trình',
    slug: 'vat-tu-che-chan',
    description:
      'Nhóm sản phẩm liên quan trực tiếp đến thi công và bảo vệ sàn, phù hợp bán cùng nilon lót sàn.',
    featured: true,
  },
  {
    name: 'Dụng cụ thi công cầm tay',
    slug: 'dung-cu-cam-tay',
    description: 'Các dụng cụ sử dụng hằng ngày trong thi công.',
    featured: true,
  },
  {
    name: 'Thiết bị hỗ trợ sơn & hoàn thiện nội thất',
    slug: 'ho-tro-son-noi-that',
    description: 'Thiết bị hỗ trợ thi công sơn và bảo vệ nội thất.',
    featured: true,
  },
];
