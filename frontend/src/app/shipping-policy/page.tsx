export default function ShippingPolicyPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-32 bg-white text-on-background">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center mb-16">
          <h1 className="font-display text-[44px] md:text-[56px] text-on-background mb-4">Shipping Policy</h1>
          <p className="font-body text-[13px] text-on-surface-variant font-light tracking-[0.1em] uppercase">Last Updated: June 14, 2026</p>
        </div>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">Order Processing</h2>
          <p>
            All jewellery collections are packaged in our signature suede gift box and dispatched within 24 to 48 hours of placing the order (excluding public holidays and Sundays).
          </p>
        </section>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">Shipping Fees & Delivery Timelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Complimentary Shipping:</strong> Automatically applied at checkout for all orders over ₹1,999.</li>
            <li><strong>Standard Shipping:</strong> Flat charge of ₹99 applies to orders under ₹1,999. Delivered within 3-5 business days.</li>
            <li><strong>COD orders:</strong> Subject to an additional handling fee of ₹50, delivered within 4-6 business days.</li>
          </ul>
        </section>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">Package Tracking</h2>
          <p>
            Upon shipment release, a unique tracking code (AL-XXXXX) is emailed to you. You can check package transit locations in real-time on our <a href="/tracking" className="text-primary hover:underline font-semibold">Order Tracking Page</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
