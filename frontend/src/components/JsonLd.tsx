/**
 * JSON-LD Structured Data for Aurora Luxe
 * Renders Organization + WebSite schema — placed in <head> via Server Component
 */
export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aurora-luxe.vercel.app/#organization",
        name: "Aurora Luxe",
        url: "https://aurora-luxe.vercel.app",
        logo: "https://aurora-luxe.vercel.app/og-image.jpg",
        description:
          "Premium anti-tarnish, waterproof, PVD-plated gold jewellery crafted for the modern muse.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "hello@auroraluxe.in",
        },
        sameAs: ["https://instagram.com/auroraluxe"],
      },
      {
        "@type": "WebSite",
        "@id": "https://aurora-luxe.vercel.app/#website",
        url: "https://aurora-luxe.vercel.app",
        name: "Aurora Luxe",
        publisher: { "@id": "https://aurora-luxe.vercel.app/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://aurora-luxe.vercel.app/shop?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
