export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-32 bg-white text-on-background">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center mb-16">
          <h1 className="font-display text-[44px] md:text-[56px] text-on-background mb-4">Privacy Policy</h1>
          <p className="font-body text-[13px] text-on-surface-variant font-light tracking-[0.1em] uppercase">Last Updated: June 14, 2026</p>
        </div>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">1. Information Collection</h2>
          <p>
            When you visit Aurora Luxe, we collect certain details regarding your web browser device, interaction logs, and coordinates required to fulfill shopping bag orders. Personal coordinates (name, billing address, phone number, email address) are compiled strictly to complete checkout actions.
          </p>
        </section>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">2. Use of Information</h2>
          <p>
            Your information helps us to process checkouts, arrange shipment dispatches, communicate order updates, evaluate store performance metrics, and send marketing newsletters (which you can opt-out of at any time).
          </p>
        </section>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">3. Data Integrity & Security</h2>
          <p>
            We deploy strict technical safeguard controls to protect transaction information. Simulated payment steps (Razorpay Secure checks) utilize end-to-end socket layer encryption algorithms. We never rent or sell customer directories to advertising brokers.
          </p>
        </section>

        <section className="space-y-4 font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
          <h2 className="font-display text-[26px] text-on-background">4. Cookies Policy</h2>
          <p>
            Our store uses cookies to remember items in your shopping bag, track active login sessions, and compile traffic stats to improve website performances.
          </p>
        </section>
      </div>
    </main>
  );
}
