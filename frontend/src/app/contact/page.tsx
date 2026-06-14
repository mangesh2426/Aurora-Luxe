"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface ContactFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFields>();

  const onSubmit = (data: ContactFields) => {
    console.log("Contact Query", data);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 3000);
  };

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-32 bg-white text-on-background overflow-hidden">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="font-display text-[44px] md:text-[56px] text-on-background mb-4 font-light">Contact Us</h1>
        <p className="font-body text-[13px] text-on-surface-variant font-light tracking-[0.1em] uppercase font-semibold">We are here to assist your styling journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* Left Coordinates details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-5 space-y-10"
        >
          <div>
            <h3 className="font-display text-[22px] mb-4 text-on-background font-semibold">Customer Concierge</h3>
            <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed">
              Our customer care assistants are available to help with size selection questions, shipping details, or exchange requests.
            </p>
          </div>

          <div className="space-y-4 font-body text-[13px] text-on-surface-variant font-light">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-primary stroke-[1.5]" />
              <span>care@auroraluxe.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-primary stroke-[1.5]" />
              <span>+91 22 8973 2415</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-primary stroke-[1.5]" />
              <span>102, Gold Crest Plaza, Bandra West, Mumbai, 400050</span>
            </div>
          </div>

          <div className="border-t border-outline/30 pt-6">
            <h4 className="font-label-caps text-[10px] tracking-widest font-semibold uppercase mb-3 text-on-background">Service Hours</h4>
            <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed">
              Monday – Saturday: 10:00 AM – 7:00 PM IST<br />
              Sunday: Closed
            </p>
          </div>
        </motion.div>

        {/* Right Query form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:col-span-7 bg-surface p-8 md:p-10 border border-outline/30 shadow-sm"
        >
          <h3 className="font-display text-[22px] mb-6 text-on-background font-semibold">Send a Message</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Your Name</label>
                <input type="text" id="name" {...register("name", { required: true })} className="h-11 border border-outline bg-white px-4 text-[13px] font-body focus:border-primary outline-none" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Email Address</label>
                <input type="email" id="email" {...register("email", { required: true })} className="h-11 border border-outline bg-white px-4 text-[13px] font-body focus:border-primary outline-none" required />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Subject</label>
              <input type="text" id="subject" {...register("subject", { required: true })} className="h-11 border border-outline bg-white px-4 text-[13px] font-body focus:border-primary outline-none" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Message Content</label>
              <textarea id="message" {...register("message", { required: true })} className="h-28 border border-outline bg-white p-4 text-[13px] font-body focus:border-primary outline-none resize-none" required />
            </div>

            {submitted && <p className="text-[12px] text-success font-semibold text-center">Your query has been recorded. We will revert within 24 hours.</p>}

            <button type="submit" className="w-full bg-on-background text-white h-12 font-label-caps text-[11px] tracking-widest uppercase hover:bg-primary transition-colors flex items-center justify-center font-bold cursor-pointer">
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
