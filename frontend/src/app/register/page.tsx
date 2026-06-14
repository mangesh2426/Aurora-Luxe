"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFields } from "@/lib/validation";
import { useStore } from "@/store/useStore";

export default function RegisterPage() {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema)
  });

  const handleRegisterSubmit = (data: RegisterFields) => {
    setLoading(true);
    setTimeout(() => {
      const name = `${data.firstName} ${data.lastName}`;
      const role = "customer";
      setSuccessMsg("Account created successfully! Logging you in...");
      login(data.email, name, role);
      localStorage.setItem("aurora_user_session", JSON.stringify({ email: data.email, name, role }));
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 1000);
  };

  return (
    <main className="min-h-screen flex bg-background text-on-background">
      {/* Left Decorative panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5KgRcn3_-N2N6zecFWxG6cl3CcNVGhTtck81DLxcKwUKhKd82pnOHtR_2ukP5KFae5KDSn4LNlhr__EvK1hu6Tyr-SfPczDjOUn4XL7FXiGR5XbKsG3vqK9f8opu8SYV9EFAjgzh_3r_N0xMoPfooCOHTLqNKgC46dRf6M8v0LHvPmaSrZvX1Dt9t5A7pq8mSbABsg-7RRKFCZCFtaatSc2JX1fUeS0o7jEXtipaPycnQduhqERj-TAu_H63kAspo-iHAzo7jiHQ')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-16 pb-24">
          <div className="font-display text-[56px] text-primary tracking-[0.1em] mb-4">AURORA</div>
          <p className="font-body text-[13px] text-white/70 tracking-[0.2em] uppercase">Join the world of lasting elegance</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-24 pt-[120px]">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-12">
            <div className="font-display text-[32px] text-primary tracking-[0.1em] mb-6 lg:hidden">AURORA</div>
            <h1 className="font-display text-[40px] text-on-background mb-4">Create Account</h1>
            <p className="font-body text-[13px] text-on-surface-variant font-light tracking-[0.05em]">Join us to track orders and save your favorite pieces.</p>
          </div>

          <form onSubmit={handleSubmit(handleRegisterSubmit)} className="flex flex-col gap-6">
            <div className="flex gap-6">
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="firstName" className="block font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName")}
                  className="w-full h-11 bg-transparent border-b border-outline focus:border-primary transition-colors font-body text-[14px] text-on-background placeholder-on-surface-variant outline-none"
                  placeholder="First"
                />
                {errors.firstName && <span className="text-[11px] text-error font-medium">{errors.firstName.message}</span>}
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="lastName" className="block font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName")}
                  className="w-full h-11 bg-transparent border-b border-outline focus:border-primary transition-colors font-body text-[14px] text-on-background placeholder-on-surface-variant outline-none"
                  placeholder="Last"
                />
                {errors.lastName && <span className="text-[11px] text-error font-medium">{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="block font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Email Address</label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full h-11 bg-transparent border-b border-outline focus:border-primary transition-colors font-body text-[14px] text-on-background placeholder-on-surface-variant outline-none"
                placeholder="your@email.com"
              />
              {errors.email && <span className="text-[11px] text-error font-medium">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="block font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Password</label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="w-full h-11 bg-transparent border-b border-outline focus:border-primary transition-colors font-body text-[14px] text-on-background placeholder-on-surface-variant outline-none"
                placeholder="Min. 8 characters"
              />
              {errors.password && <span className="text-[11px] text-error font-medium">{errors.password.message}</span>}
            </div>

            {successMsg && <p className="text-[12px] text-success font-medium text-center">{successMsg}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 mt-4 bg-primary text-on-primary font-label-caps text-[12px] tracking-[0.25em] uppercase hover:bg-primary-container transition-all flex items-center justify-center relative overflow-hidden group disabled:opacity-50"
            >
              <span className="relative z-10">{loading ? "Creating Account..." : "Create Account"}</span>
              <div className="absolute inset-0 bg-white/15 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
          </form>

          <div className="mt-12 text-center border-t border-outline pt-8">
            <p className="font-body text-[13px] text-on-surface-variant font-light">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary-container transition-colors font-semibold">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
