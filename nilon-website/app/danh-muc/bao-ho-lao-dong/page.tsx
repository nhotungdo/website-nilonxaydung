import { Metadata } from "next";
import CategoryPageContent from "@/components/CategoryPageContent";

export const metadata: Metadata = {
  title: "Bảo hộ lao động & Vật tư công trình | Giải pháp bảo vệ toàn diện",
  description: "Chuyên cung cấp mũ bảo hộ, găng tay, giày bảo hộ, quần áo phản quang và vật tư che chắn công trình. Sản phẩm chất lượng cao, giá tốt cho nhà thầu.",
  openGraph: {
    title: "Bảo hộ lao động & Vật tư công trình chuyên nghiệp",
    description: "Cung cấp đầy đủ trang thiết bị bảo hộ và vật tư thi công xây dựng.",
    images: ["https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1200"],
  },
};

import { prisma } from "@/lib/prisma";

export default async function BaoHoLaoDongPage() {
  // Fetch from DB instead of static file
  const dbProducts = await prisma.product.findMany({
    where: {
      OR: [
        { category: "Bảo hộ lao động" },
        { categorySlug: "bao-ho-lao-dong" }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return <CategoryPageContent initialProducts={dbProducts as any} />;
}
