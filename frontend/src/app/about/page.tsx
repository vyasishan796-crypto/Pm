"use client";
import { ShieldCheck, Brain, Globe, BookOpen, Heart, Target, Eye, Lightbulb, Users, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import FeatureCard from "@/components/ui/FeatureCard";
import { MountainBackground, BotanicalBranch } from "@/components/ui/Botanical";

const values = [
  { icon: <Target className="w-5 h-5" />, title: "Our Mission", description: "To democratize access to intellectual property knowledge and empower innovators worldwide through AI-driven guidance." },
  { icon: <Eye className="w-5 h-5" />, title: "Our Vision", description: "A world where traditional knowledge is protected, innovation is accessible, and IP guidance is available to everyone." },
  { icon: <Heart className="w-5 h-5" />, title: "Our Values", description: "Transparency, integrity, inclusivity, and respect for traditional knowledge systems guide everything we do." },
  { icon: <Lightbulb className="w-5 h-5" />, title: "Innovation", description: "We leverage cutting-edge AI to make complex IP processes simple, accessible, and efficient." },
];

export default function AboutPage() {
  return (
    <div className="h-full overflow-y-auto p-5 lg:p-8 max-w-5xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[26px] lg:text-[30px] font-bold mb-1" style={{ color: "var(--color-text)" }}>About Prakriti</h1>
        <p className="text-[13px] mb-8" style={{ color: "var(--color-text-secondary)" }}>Empowering knowledge protection through AI</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {values.map((v, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
            <FeatureCard icon={v.icon} title={v.title} description={v.description} />
          </motion.div>
        ))}
      </div>

      <Card padding="lg" className="mb-10 relative overflow-hidden">
        <BotanicalBranch className="absolute -right-4 -top-6 w-32 h-40 opacity-20" />
        <div className="relative z-10">
          <h3 className="text-[18px] font-bold mb-3" style={{ color: "var(--color-text)" }}>What We Do</h3>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
            Prakriti is an AI-powered platform designed to help individuals, researchers, and organizations navigate the complex world of intellectual property protection. We combine advanced language models with verified knowledge bases to provide accurate, source-cited guidance.
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Whether you are filing a patent, protecting traditional knowledge, registering a geographical indication, or seeking copyright guidance, our platform provides personalized, multilingual support to help you every step of the way.
          </p>
        </div>
      </Card>

      <div className="relative rounded-[20px] overflow-hidden mb-10" style={{ backgroundColor: "var(--color-sage)" }}>
        <MountainBackground className="w-full h-48 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Leaf className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
            <p className="text-[15px] font-semibold" style={{ color: "var(--color-primary-dark)" }}>Built with care for traditional knowledge</p>
          </div>
        </div>
      </div>
    </div>
  );
}
