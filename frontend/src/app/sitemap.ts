import { MetadataRoute } from "next";

const BASE_URL = "https://aurora-luxe.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/shop", "/wishlist", "/tracking", "/login"];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : ("weekly" as const),
    priority: route === "/" ? 1 : 0.8,
  }));
}
