import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Bot, ShieldCheck, Coins, Network, Blocks, Plug } from "lucide-react";

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  description: string;
  glowColor: "purple" | "cyan";
}

const features: FeatureCard[] = [
  {
    icon: Bot,
    title: "Agent Accounts",
    description:
      "First-class AI agent identity on-chain. Register, authenticate, and track AI agents natively in the protocol.",
    glowColor: "purple",
  },
  {
    icon: ShieldCheck,
    title: "Inference Verification",
    description:
      "On-chain cryptographic verification of AI inference results. Ensure AI outputs are trustworthy and tamper-proof.",
    glowColor: "cyan",
  },
  {
    icon: Coins,
    title: "10 PLM Block Rewards",
    description:
      "Consistent block rewards distributed to validators and AI agents contributing inference power.",
    glowColor: "purple",
  },
  {
    icon: Network,
    title: "AI-Optimized Consensus",
    description:
      "Modified Clique PoA consensus with AI header fields and agent heartbeat tracking.",
    glowColor: "cyan",
  },
  {
    icon: Blocks,
    title: "Stateful Precompiles",
    description:
      "Custom EVM precompiles (0x20-0x23) for gas-efficient agent registration, heartbeat, and inference verification.",
    glowColor: "purple",
  },
  {
    icon: Plug,
    title: "MCP Integration",
    description:
      "Built-in Model Context Protocol server for seamless AI model interaction with the blockchain.",
    glowColor: "cyan",
  },
];

const FeatureCardItem = ({
  feature,
  index,
}: {
  feature: FeatureCard;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative"
    >
      <div
        className="glass relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:border-[var(--color-primary)] sm:p-8"
        style={{
          borderColor: "var(--color-border)",
        }}
      >
        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow:
              feature.glowColor === "purple"
                ? "inset 0 0 60px rgba(139, 92, 246, 0.08), 0 0 40px rgba(139, 92, 246, 0.12)"
                : "inset 0 0 60px rgba(6, 182, 212, 0.08), 0 0 40px rgba(6, 182, 212, 0.12)",
          }}
        />

        {/* Icon */}
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            background:
              feature.glowColor === "purple"
                ? "rgba(139, 92, 246, 0.15)"
                : "rgba(6, 182, 212, 0.15)",
          }}
        >
          <Icon
            size={24}
            style={{
              color:
                feature.glowColor === "purple"
                  ? "var(--color-accent-light)"
                  : "var(--color-primary-light)",
            }}
          />
        </div>

        {/* Content */}
        <h3
          className="mb-3 text-lg font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {feature.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {feature.description}
        </p>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
          style={{
            background:
              feature.glowColor === "purple"
                ? "linear-gradient(90deg, var(--color-accent), transparent)"
                : "linear-gradient(90deg, var(--color-primary), transparent)",
          }}
        />
      </div>
    </motion.div>
  );
};

export const Features = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section id="features" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="gradient-text mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Built for AI
          </h2>
          <p
            className="mx-auto max-w-2xl text-base sm:text-lg"
            style={{ color: "var(--color-text-muted)" }}
          >
            Plumise is purpose-built for AI agents with native protocol-level
            support for registration, inference verification, and
            machine-to-machine interaction.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCardItem
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
