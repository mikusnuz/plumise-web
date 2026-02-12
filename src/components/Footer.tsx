import { motion } from "motion/react";
import {
  Github,
  Twitter,
  MessageCircle,
  Send,
  BookOpen,
  ExternalLink,
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: "Ecosystem",
    links: [
      { label: "PlumSwap", href: "#" },
      { label: "Plumfun", href: "#" },
      { label: "PlumMarket", href: "#" },
      { label: "PlumWallet", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "White Paper", href: "/whitepaper.pdf", external: true },
      { label: "GitHub", href: "https://github.com/mikusnuz/plumise", external: true },
      { label: "Explorer", href: "https://explorer.plumise.com", external: true },
      { label: "Dashboard", href: "https://dashboard.plumise.com", external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Twitter / X", href: "#", external: true },
      { label: "Discord", href: "#", external: true },
      { label: "Telegram", href: "#", external: true },
      { label: "Medium", href: "#", external: true },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "https://github.com/mikusnuz/plumise", label: "GitHub" },
  { icon: MessageCircle, href: "#", label: "Discord" },
  { icon: Send, href: "#", label: "Telegram" },
  { icon: BookOpen, href: "/whitepaper.pdf", label: "White Paper" },
];

const Footer = () => {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Top glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-primary), var(--color-accent), transparent)",
          opacity: 0.4,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="/" className="mb-5 inline-flex items-center no-underline">
              <img
                src="/logo_plumise_white.png"
                alt="Plumise"
                className="h-8 w-8 object-contain"
              />
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: "var(--color-text)", fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Plumise
              </span>
            </a>

            <p
              className="mt-4 max-w-sm text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              A next-generation AI-native blockchain where artificial
              intelligence meets decentralized infrastructure. Built for
              autonomous agents, verified inference, and intelligent dApps.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href !== "#" ? "_blank" : undefined}
                    rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    whileHover={{ y: -2 }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-primary)";
                      e.currentTarget.style.color = "var(--color-primary-light)";
                      e.currentTarget.style.backgroundColor =
                        "rgba(6, 182, 212, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-text-muted)";
                      e.currentTarget.style.backgroundColor =
                        "var(--color-surface)";
                    }}
                  >
                    <Icon size={16} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4
                className="mb-4 text-xs font-semibold tracking-widest uppercase"
                style={{ color: "var(--color-text)" }}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-sm no-underline transition-colors duration-200"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-text)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-text-muted)")
                      }
                    >
                      {link.label}
                      {link.external && <ExternalLink size={11} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="my-8 h-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            &copy; {new Date().getFullYear()} Plumise. All rights reserved.
          </p>

          <div
            className="flex items-center gap-2 rounded-full px-3 py-1"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
              }}
            />
            <span
              className="font-mono text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Chain ID: 41956
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--color-border)" }}
            >
              |
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              10 PLM/block
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
