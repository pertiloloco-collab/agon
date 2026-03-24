"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Brain, Flame, Target, Swords, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Scroll,
    title: "Daily Contracts",
    description: "Sign a blood oath every morning. Your workout, nutrition, and habits — locked in.",
  },
  {
    icon: Brain,
    title: "AI War Mentor",
    description: "Claude-powered mentor that knows your journey, your why, and hits where it hurts.",
  },
  {
    icon: Flame,
    title: "Streak System",
    description: "Build an unbreakable chain. Break it, and face the consequences you chose.",
  },
  {
    icon: Swords,
    title: "Sanction System",
    description: "Pre-set your own punishments. Cold showers, privilege revocation, emotional warfare.",
  },
  {
    icon: Target,
    title: "Greek God Ratios",
    description: "Track shoulder-to-waist, chest, arms. Chase the golden ratio: 1.618.",
  },
  {
    icon: Shield,
    title: "Why Vault",
    description: "Store your deepest motivations. The AI uses them to keep you moving when you want to quit.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      {/* Hero */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,168,76,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#8B7432] flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(201,168,76,0.3)]"
          >
            <span className="font-display text-4xl font-bold text-[#050505]">A</span>
          </motion.div>

          <h1 className="font-display text-6xl md:text-8xl font-bold text-[#C9A84C] tracking-wider mb-4">
            AGON
          </h1>

          <p className="text-lg md:text-xl text-[#A3A3A3] mb-2 font-body">
            365 days. One transformation. No excuses.
          </p>

          <p className="text-sm text-[#525252] mb-12 max-w-lg mx-auto">
            AI-powered accountability system for building a Greek God physique.
            Brutally honest. Emotionally intelligent. Relentless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold text-lg px-8 py-6 hover:from-[#E5D494] hover:to-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] transition-all"
              >
                START YOUR TRANSFORMATION
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-[#1F1F1F] text-[#A3A3A3] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 font-medium text-lg px-8 py-6"
              >
                ENTER THE ARENA
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-center text-[#F5F5F5] mb-4"
          >
            YOUR WAR MACHINE
          </motion.h2>
          <p className="text-center text-[#525252] mb-16 max-w-lg mx-auto">
            Every tool you need to forge an unbreakable body and mind.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-6 rounded-xl bg-[#111111] border border-[#1F1F1F] hover:border-[#C9A84C]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.08)]"
              >
                <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-4 group-hover:bg-[#C9A84C]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <h3 className="font-display text-lg text-[#F5F5F5] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#525252] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl text-[#C9A84C] mb-6">
            THE ARENA AWAITS
          </h2>
          <p className="text-[#A3A3A3] mb-8">
            You chose this. Now honor it. 365 days from now, you won&apos;t recognize the man
            in the mirror.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold text-lg px-12 py-6 hover:from-[#E5D494] hover:to-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.2)]"
            >
              I&apos;M READY
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F1F1F] py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display text-sm text-[#525252]">AGON</span>
          <span className="text-xs text-[#525252]">Forged for warriors.</span>
        </div>
      </footer>
    </div>
  );
}
