"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFields } from "@/lib/validation";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login, logout } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "riya.sen@example.com",
      password: "password123"
    }
  });

  const handleLoginSubmit = async (data: LoginFields) => {
    setLoading(true);
    setSuccessMsg("");
    
    try {
      // Dynamic import to avoid SSR issues with axios if necessary, but it's "use client" so fine
      const api = (await import("@/lib/api")).default;
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password
      });

      const { user: userData, access_token: token } = res.data;

      setSuccessMsg("Logged in successfully! Redirecting...");
      
      const role = userData.role.toLowerCase();
      const name = `${userData.firstName} ${userData.lastName}`;
      const redirectUrl = role === "admin" ? "/admin" : "/";

      login(userData.id, userData.email, name, role, token);
      localStorage.setItem("aurora_user_session", JSON.stringify({ 
        id: userData.id, 
        email: userData.email, 
        name, 
        role, 
        token 
      }));
      
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Login failed. Please check your credentials.";
      setSuccessMsg("");
      // Setting error on form or just alert, we don't have an error state for the whole form,
      // so let's just reuse successMsg but maybe make a separate error state if we want.
      // But we can just use an alert for now or add a small error text.
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (mounted && user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-on-background px-8 py-24 pt-[120px]">
        <div className="w-full max-w-[420px] bg-white border border-outline/35 p-10 shadow-sm text-center">
          <h1 className="font-display text-[32px] text-on-background mb-6 leading-tight">Your Profile</h1>
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-[26px] font-bold font-display uppercase">{user.name.charAt(0)}</span>
          </div>
          <p className="font-body text-[16px] font-medium text-on-background">{user.name}</p>
          <p className="font-body text-[13px] text-on-surface-variant font-light mt-1 mb-8">{user.email}</p>
          
          <div className="flex flex-col gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="w-full py-3.5 border border-primary text-primary font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary/5 transition-colors font-bold text-center"
              >
                Go to Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                localStorage.removeItem("aurora_user_session");
                router.push("/");
              }}
              className="w-full py-3.5 bg-on-background text-white font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex bg-background text-on-background">
      {/* Left Decorative Image panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDv922ZqUIqmDzVI3rAzco06vXG2NvWZMZvda7tJm2tVlKgyf4NNkePPMUDxctEmXfodxrBGO1rjKUftXI5FOKNGdkRl_Ofq5Gx2dT45pP26Val7dSaHyFw_R_0GvrqOMKtWtV897u1pjEE11huLrK9cx973_YRMmnzmtD6PqX1F_15QM7vfg3TEpipHOcSPUu04UumIhsfuOW0dh99JBLlsz2e2_bOgkJa1o1ms1o4sdIS9Y3MOTFaIUzPmfds4CCFBXGU5RA2KA4')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-16 pb-24">
          <div className="font-display text-[56px] text-primary tracking-[0.1em] mb-4">AURORA</div>
          <p className="font-body text-[13px] text-white/70 tracking-[0.2em] uppercase">Premium Anti-Tarnish Jewellery</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-24 pt-[120px]">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-16">
            <div className="font-display text-[32px] text-primary tracking-[0.1em] mb-6 lg:hidden">AURORA</div>
            <h1 className="font-display text-[40px] text-on-background mb-4">Welcome Back</h1>
            <p className="font-body text-[13px] text-on-surface-variant font-light tracking-[0.05em]">Sign in to access your curated collections and orders.</p>
          </div>

          <form onSubmit={handleSubmit(handleLoginSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="block font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Email Address</label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full h-12 bg-transparent border-b border-outline focus:border-primary transition-colors font-body text-[14px] text-on-background placeholder-on-surface-variant outline-none"
                placeholder="your@email.com"
              />
              {errors.email && <span className="text-[11px] text-error font-medium">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Password</label>
                <Link href="#" className="font-label-caps text-[10px] tracking-[0.1em] uppercase text-primary hover:text-primary-container transition-colors">Forgot?</Link>
              </div>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="w-full h-12 bg-transparent border-b border-outline focus:border-primary transition-colors font-body text-[14px] text-on-background placeholder-on-surface-variant outline-none"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-[11px] text-error font-medium">{errors.password.message}</span>}
            </div>

            {successMsg && <p className="text-[12px] text-success font-medium text-center">{successMsg}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 mt-4 bg-primary text-on-primary font-label-caps text-[12px] tracking-[0.25em] uppercase hover:bg-primary-container transition-all flex items-center justify-center relative overflow-hidden group disabled:opacity-50"
            >
              <span className="relative z-10">{loading ? "Signing In..." : "Sign In"}</span>
              <div className="absolute inset-0 bg-white/15 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>


          </form>

          <div className="mt-12 text-center border-t border-outline pt-8">
            <p className="font-body text-[13px] text-on-surface-variant font-light">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary-container transition-colors font-semibold">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
