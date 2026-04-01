import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Palette, LayoutTemplate, ArrowRight } from "lucide-react";
import SoftBackdrop from "../components/SoftBackdrop";
import SectionTitle from "../components/SectionTitle";

const highlights = [
  {
    icon: Sparkles,
    title: "AI-powered designs",
    text: "Describe your idea and get channel-ready thumbnails tuned for YouTube and social video.",
  },
  {
    icon: Palette,
    title: "Styles & color schemes",
    text: "Pick aspect ratio, visual style, and palettes so every thumbnail fits your brand.",
  },
  {
    icon: LayoutTemplate,
    title: "Built for creators",
    text: "Spend less time in Photoshop and more time publishing content your audience loves.",
  },
];

export default function About() {
  return (
    <>
      <SoftBackdrop />
      <div className="pt-28 pb-24 min-h-screen px-4 md:px-16 lg:px-24 xl:px-32">
        <SectionTitle
          text1="About"
          text2="ThumbCraftor"
          text3="We help creators design eye-catching thumbnails without a design degree."
        />

        <motion.div
          className="max-w-3xl mx-auto mt-14 space-y-6 text-slate-300 leading-relaxed"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 72 }}
        >
          <p>
            ThumbCraftor is an AI thumbnail generator made for YouTubers and video
            creators who want professional-looking covers in minutes—not hours.
            Whether you are launching a new series or refreshing old videos, our
            tools help you stay consistent and on-brand.
          </p>
          <p>
            Tell us your title, optional details, and visual preferences. We combine
            your input with modern image models to produce thumbnails you can
            preview, download, and reuse across your channel.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
          {highlights.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm space-y-3"
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.08 * i,
                type: "spring",
                stiffness: 280,
                damping: 70,
              }}
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-pink-600/20 text-pink-400">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Link
            to="/generate"
            className="inline-flex items-center gap-2 rounded-full bg-pink-600 hover:bg-pink-500 px-8 py-3 text-sm font-medium text-white transition-colors"
          >
            Start generating
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/#contact"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-medium text-zinc-200 transition-colors"
          >
            Contact us
          </Link>
        </motion.div>
      </div>
    </>
  );
}
