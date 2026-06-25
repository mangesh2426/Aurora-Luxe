import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchProduct(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await fetchProduct(resolvedParams.id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const name = product.name as string;
  const description = (product.description as string) || "";
  const imageUrl =
    product.images?.[0]?.url ||
    "https://aurora-luxe.vercel.app/og-image.jpg";

  return {
    title: name,
    description: description.slice(0, 160),
    openGraph: {
      title: `${name} | Aurora Luxe`,
      description: description.slice(0, 200),
      images: [{ url: imageUrl, width: 800, height: 800, alt: name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Aurora Luxe`,
      description: description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
