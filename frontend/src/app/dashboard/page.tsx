import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-32 min-h-[calc(100vh-200px)] pt-[120px] bg-white text-on-background">
      <div className="flex flex-col md:flex-row gap-16">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 mb-16 md:mb-0">
          <div className="sticky top-[140px]">
            <h2 className="font-display text-[24px] text-on-background mb-8 pb-4 border-b border-outline">My Account</h2>
            <nav className="flex flex-col gap-2">
              <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 bg-white/5 text-primary border-l-2 border-primary font-label-caps text-[10px] tracking-[0.2em] uppercase lux-transition">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                Profile
              </Link>
              <Link href="/dashboard/orders" className="flex items-center gap-4 px-6 py-4 text-on-surface-variant hover:bg-white/5 hover:text-primary border-l-2 border-transparent hover:border-primary/50 font-label-caps text-[10px] tracking-[0.2em] uppercase lux-transition group">
                <span className="material-symbols-outlined text-[16px] group-hover:text-primary lux-transition">shopping_bag</span>
                My Orders
              </Link>
              <Link href="/dashboard/addresses" className="flex items-center gap-4 px-6 py-4 text-on-surface-variant hover:bg-white/5 hover:text-primary border-l-2 border-transparent hover:border-primary/50 font-label-caps text-[10px] tracking-[0.2em] uppercase lux-transition group">
                <span className="material-symbols-outlined text-[16px] group-hover:text-primary lux-transition">location_on</span>
                Addresses
              </Link>
              <Link href="/wishlist" className="flex items-center gap-4 px-6 py-4 text-on-surface-variant hover:bg-white/5 hover:text-primary border-l-2 border-transparent hover:border-primary/50 font-label-caps text-[10px] tracking-[0.2em] uppercase lux-transition group">
                <span className="material-symbols-outlined text-[16px] group-hover:text-primary lux-transition">favorite</span>
                Wishlist
              </Link>
              <Link href="/dashboard/notifications" className="flex items-center gap-4 px-6 py-4 text-on-surface-variant hover:bg-white/5 hover:text-primary border-l-2 border-transparent hover:border-primary/50 font-label-caps text-[10px] tracking-[0.2em] uppercase lux-transition group">
                <span className="material-symbols-outlined text-[16px] group-hover:text-primary lux-transition">notifications</span>
                Notifications
              </Link>
              <div className="mt-8 pt-8 border-t border-outline">
                <button className="w-full flex items-center gap-4 px-6 py-4 text-error hover:bg-error/10 border-l-2 border-transparent hover:border-error/50 font-label-caps text-[10px] tracking-[0.2em] uppercase lux-transition">
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col gap-16">
          
          {/* Welcome Banner (Frosted Glass Style) */}
          <div className="bg-surface-container-low border border-outline p-12 md:p-16 relative overflow-hidden flex items-center justify-between">
            <div className="z-10 max-w-2xl">
              <p className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary mb-4">Welcome Back</p>
              <h1 className="font-display text-[48px] text-on-background mb-6 drop-shadow-lg">Eleanor Vance</h1>
              <p className="font-body text-[14px] font-light tracking-[0.05em] leading-relaxed text-on-surface-variant mb-10">Manage your orders, update your address details, and review your curated wishlist from your personal boutique space.</p>
              <button className="bg-on-background text-white font-label-caps text-[10px] px-8 py-4 uppercase tracking-[0.2em] hover:bg-on-surface-variant lux-transition">
                Edit Profile
              </button>
            </div>
            {/* Decorative subtle element */}
            <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-radial from-primary/10 to-transparent opacity-50 blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Orders Section */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex justify-between items-end mb-4 border-b border-outline pb-4">
                <h3 className="font-display text-[24px] text-on-background">Recent Orders</h3>
                <Link href="/dashboard/orders" className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-primary hover:text-white lux-transition">View All</Link>
              </div>

              {/* Order Card 1 */}
              <div className="bg-surface-container-low p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center border border-outline hover:border-primary/30 lux-transition group">
                <div className="w-24 h-32 bg-surface-container-low overflow-hidden flex-shrink-0 relative">
                  <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk4qyGdWjNPmd-CWTA8VKuwiegIynz1FyRHj5rOvBVcC0CMU7DBIvFZ4NjN0WYdqekXFNmpJdLOdi3hDAVbvuOTCujhFrPhESIIxYmdUvBxBCrbjPIw8GW65n7KKUmA7YGbDJgVWb3eSN1ryEoLXAaRsS6Cd4VPyIL19VvoXO9M74DPravaPp-TwKEyuJjQLEssboum0ZsFY6nQpdqvF1aSNDRC0FWaNC05Uy-yIhpFDY9pJsAgUe47iNOay3kKm54mjYptinrCNI" alt="Gold necklace with pendant" fill className="w-full h-full object-cover group-hover:scale-110 lux-transition" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-2">Order #AL-9824</p>
                      <h4 className="font-display text-[20px] text-on-background">Lumina Gold Pendant</h4>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 bg-white/5 text-on-background font-label-caps text-[8px] tracking-[0.2em] uppercase border border-outline/50">
                      Delivered
                    </span>
                  </div>
                  <p className="font-body text-[12px] font-light tracking-[0.05em] text-on-surface-variant mt-4">Placed on Oct 12, 2023 • <span className="text-primary">₹450.00</span></p>
                </div>
              </div>

              {/* Order Card 2 */}
              <div className="bg-surface-container-low p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center border border-outline hover:border-primary/30 lux-transition group">
                <div className="w-24 h-32 bg-surface-container-low overflow-hidden flex-shrink-0 relative">
                  <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcS3zsfV_6dEIEUwknQtKvphqDRgehBRGt65eYeI5UISPSWTGaBOgvU_Uhxwb1-OYFk5yNTczTsg8q3vdeW3J_Jl87sS1liJ-KtxItUixRmZw7O1dk-YkWqdIp-zrligT6QtgBnl5r6GBIgytW6x8pRRRjMlUP6l1lsG97ZPRW-kmQ92_gV655ZNiMnMlA1D0iu7iilBctgA-H91UOn_VFqwoAZbYFQ5H2jyne3UOvJyX9XWZN9fytzqgrwj1B_-zmC34wtcyzpqU" alt="Diamond ring" fill className="w-full h-full object-cover group-hover:scale-110 lux-transition" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-2">Order #AL-8751</p>
                      <h4 className="font-display text-[20px] text-on-background">Eternity Diamond Ring</h4>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary font-label-caps text-[8px] tracking-[0.2em] uppercase border border-primary/30">
                      In Transit
                    </span>
                  </div>
                  <p className="font-body text-[12px] font-light tracking-[0.05em] text-on-surface-variant mt-4">Placed on Nov 05, 2023 • <span className="text-primary">₹1,250.00</span></p>
                </div>
              </div>

            </div>

            {/* Addresses Section */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-end mb-4 border-b border-outline pb-4">
                <h3 className="font-display text-[24px] text-on-background">Primary Address</h3>
                <Link href="/dashboard/addresses" className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-primary hover:text-white lux-transition">Manage</Link>
              </div>
              
              {/* Address Card */}
              <div className="bg-surface-container-low p-8 border border-outline hover:border-primary/30 lux-transition h-full flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8 text-primary">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 300" }}>home</span>
                  <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Home</span>
                </div>
                <address className="font-body text-[14px] font-light tracking-[0.05em] text-on-surface-variant not-italic leading-[2] mb-12">
                  Eleanor Vance<br/>
                  1245 Heritage Way, Suite 3B<br/>
                  New York, NY 10012<br/>
                  United States
                </address>
                <div className="mt-auto pt-8 border-t border-outline/50">
                  <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-2">Phone Number</p>
                  <p className="font-body text-[14px] font-light tracking-wider text-on-background">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
