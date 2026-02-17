import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ArrowRightLeft,
  Rocket,
  TrendingUp,
  Wallet,
  ExternalLink,
  Search,
  LayoutDashboard,
} from "lucide-react";

interface DApp {
  name: string;
  description: string;
  icon: React.ElementType;
  url: string;
  comingSoon?: boolean;
  accentColor: string;
}

const dapps: DApp[] = [
  {
    name: "PlumSwap",
    description:
      "Decentralized exchange for seamless token trading with automated market making on Plumise.",
    icon: ArrowRightLeft,
    url: "https://plumswap.com",
    accentColor: "var(--color-primary)",
  },
  {
    name: "Plumfun",
    description:
      "Token launchpad with bonding curve mechanics. Create and discover new tokens with fair launch dynamics.",
    icon: Rocket,
    url: "https://plumfun.com",
    accentColor: "var(--color-accent)",
  },
  {
    name: "PlumMarket",
    description:
      "Prediction market platform. Trade on the outcome of real-world events with on-chain settlement.",
    icon: TrendingUp,
    url: "https://plummarket.com",
    accentColor: "var(--color-primary)",
  },
  {
    name: "Pexus",
    description:
      "Browser extension wallet designed for the Plumise ecosystem with native AI agent support.",
    icon: Wallet,
    url: "#",
    comingSoon: true,
    accentColor: "var(--color-accent)",
  },
];

interface QuickLink {
  name: string;
  description: string;
  icon: React.ElementType;
  url: string;
}

const quickLinks: QuickLink[] = [
  {
    name: "Block Explorer",
    description: "Browse transactions, blocks, and accounts on Plumscan",
    icon: Search,
    url: "https://explorer.plumise.com",
  },
  {
    name: "Dashboard",
    description: "Network stats, validator info, and chain analytics",
    icon: LayoutDashboard,
    url: "https://dashboard.plumise.com",
  },
];

const DAppCard = ({ dapp, index }: { dapp: DApp; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = dapp.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      className="group relative"
    >
      <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:border-[var(--color-primary)] sm:p-8">
        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 60px ${dapp.accentColor}15, 0 0 40px ${dapp.accentColor}20`,
          }}
        />

        <div className="flex items-start justify-between">
          {/* Icon */}
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: `${dapp.accentColor}20` }}
          >
            <Icon size={24} style={{ color: dapp.accentColor }} />
          </div>

          {/* Coming soon badge */}
          {dapp.comingSoon && (
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: "rgba(139, 92, 246, 0.15)",
                color: "var(--color-accent-light)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              Coming Soon
            </span>
          )}
        </div>

        {/* Content */}
        <h3
          className="mb-2 text-lg font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {dapp.name}
        </h3>
        <p
          className="mb-6 flex-1 text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {dapp.description}
        </p>

        {/* Launch button */}
        {!dapp.comingSoon ? (
          <a
            href={dapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:gap-3"
            style={{
              background: `${dapp.accentColor}18`,
              color: dapp.accentColor,
              border: `1px solid ${dapp.accentColor}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${dapp.accentColor}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${dapp.accentColor}18`;
            }}
          >
            Launch
            <ExternalLink size={14} />
          </a>
        ) : (
          <div
            className="inline-flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm"
            style={{
              background: "rgba(136, 136, 170, 0.1)",
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-border)",
            }}
          >
            Coming Soon
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const Ecosystem = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const linksRef = useRef<HTMLDivElement>(null);
  const linksInView = useInView(linksRef, { once: true, margin: "-60px" });

  return (
    <section id="ecosystem" className="relative px-6 py-24 sm:py-32">
      {/* Background gradient accent */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[1px] w-2/3 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-border), transparent)",
        }}
      />

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
            Ecosystem
          </h2>
          <p
            className="mx-auto max-w-2xl text-base sm:text-lg"
            style={{ color: "var(--color-text-muted)" }}
          >
            A growing suite of decentralized applications powered by the Plumise
            network. Trade, launch, predict, and more.
          </p>
        </motion.div>

        {/* DApp Grid */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dapps.map((dapp, index) => (
            <DAppCard key={dapp.name} dapp={dapp} index={index} />
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          ref={linksRef}
          initial={{ opacity: 0, y: 30 }}
          animate={
            linksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:border-[var(--color-primary)]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "rgba(6, 182, 212, 0.12)" }}
                >
                  <Icon
                    size={20}
                    style={{ color: "var(--color-primary-light)" }}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {link.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {link.description}
                  </div>
                </div>
                <ExternalLink
                  size={16}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: "var(--color-text-muted)" }}
                />
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Ecosystem;
