import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function generateSEO({
  title = 'Nilon Lót Sàn Bê Tông & Bảo Hộ Lao Động - Chất Lượng Cao',
  description = 'Chuyên cung cấp nilon lót sàn bê tông, màng PE, và các thiết bị bảo hộ lao động an toàn, giá sỉ cho công trình xây dựng.',
  image = '/images/og-image.jpg',
  url = 'https://nilonxaydung.vn',
}: SEOProps): Metadata {
  return {
    title: `${title} | Nilon Xây Dựng`,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
