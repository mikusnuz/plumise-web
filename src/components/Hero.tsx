import { useRef, lazy, Suspense } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, BookOpen, Blocks, Bot, Zap } from "lucide-react";

const NeuralNetwork = lazy(() => import("./three/NeuralNetwork"));

const STATS = [
  { icon: Blocks, label: "Block Height", value: "1,284,097" },
  { icon: Bot, label: "Active Agents", value: "2,491" },
  { icon: Zap, label: "TPS", value: "1,200" },
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* 3D Neural Network Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Suspense fallback={null}>
          <NeuralNetwork />
        </Suspense>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-16 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(6, 182, 212, 0.08)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-primary)",
              boxShadow: "0 0 6px var(--color-primary)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
          <span
            className="text-xs font-medium tracking-wider uppercase"
            style={{ color: "var(--color-primary-light)" }}
          >
            AI-Native Blockchain
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-6 text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span style={{ color: "var(--color-text)" }}>Where Intelligence</span>
          <br />
          <span className="gradient-text">Meets Infrastructure</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          Plumise is a next-generation blockchain with native AI agent accounts,
          on-chain inference verification, and decentralized intelligence
          infrastructure.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#ecosystem"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#ecosystem")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-white no-underline transition-all duration-200"
            style={{
              background: "var(--color-primary)",
              boxShadow: "0 4px 20px var(--color-glow-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 28px var(--color-glow-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px var(--color-glow-primary)";
            }}
          >
            Explore Ecosystem
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>

          <a
            href="https://docs.plumise.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold no-underline transition-all duration-200"
            style={{
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-primary)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <BookOpen size={16} />
            Read Docs
          </a>
        </motion.div>

        {/* Live Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="glass mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-xl"
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1.5 px-4 py-5 sm:px-6"
                style={{
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Icon
                    size={14}
                    style={{ color: "var(--color-primary)" }}
                  />
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {stat.label}
                  </span>
                </div>
                <span
                  className="font-mono text-lg font-bold sm:text-xl"
                  style={{ color: "var(--color-text)" }}
                >
                  {stat.value}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-32"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg), transparent)",
        }}
      />
    </section>
  );
};

export default Hero;
