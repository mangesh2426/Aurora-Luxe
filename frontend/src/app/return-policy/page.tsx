export default function ReturnPolicyPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-32 bg-white text-on-background">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center mb-16">
          <h1 className="font-display text-[44px] md:text-[56px] text-on-background mb-4">Return & Exchange Policy</h1>
          <p className="font-body text-[13px] text-on-surface-variant font-light tracking-[0.1em] uppercase">Last Updated: June 14, 2026</p>
        </div>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">7-Day Easy Exchanges</h2>
          <p>
            We take pride in our premium craftsmanship. If you receive a wrong finish size, or are unhappy with your design, you can request an exchange within 7 days of order receipt. To initiate an exchange, email us at <strong className="text-on-background">care@auroraluxe.com</strong> with your order ID.
          </p>
        </section>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">Exchange Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Items must be unworn, undamaged, and kept in their original luxury packaging box.</li>
            <li>Exchange dispatches are processed only after receiving and verifying the original returned item at our boutique studio.</li>
            <li>Exchanges are limited to one ticket request per order purchase.</li>
          </ul>
        </section>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">Lifetime Color Guarantee</h2>
          <p>
            All Aurora Luxe jewellery pieces are covered under a lifetime anti-tarnish warranty. If your gold plating loses its shine or fades due to regular water exposure under normal wear conditions, we will replace your piece free of charge.
          </p>
        </section>
      </div>
    </main>
  );
}
