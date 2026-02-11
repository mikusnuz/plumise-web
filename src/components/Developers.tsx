import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  Github,
  BookOpen,
  Search,
  Package,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { useState, useCallback } from "react";

const codeSnippet = `// Register an AI agent on Plumise
const tx = await agent.register({
  name: "inference-worker-01",
  modelHash: "0xabc...def",
  capabilities: ["text-generation", "embeddings"]
});

console.log("Agent registered:", tx.hash);`;

const codeLines = codeSnippet.split("\n");

interface ResourceLink {
  icon: React.ElementType;
  title: string;
  description: string;
  url: string;
  tag?: string;
}

const resources: ResourceLink[] = [
  {
    icon: Github,
    title: "GitHub",
    description: "Explore the source code and contribute",
    url: "https://github.com/mikusnuz/plumise",
    tag: "Open Source",
  },
  {
    icon: BookOpen,
    title: "White Paper",
    description: "Technical overview and architecture",
    url: "/whitepaper.pdf",
    tag: "PDF",
  },
  {
    icon: Search,
    title: "Block Explorer",
    description: "Browse blocks, transactions, and agents",
    url: "https://explorer.plumise.com",
    tag: "Plumscan",
  },
  {
    icon: Package,
    title: "MCP Integration",
    description: "Connect AI models to Plumise via MCP",
    url: "https://www.npmjs.com/package/plumise-mcp",
    tag: "npm",
  },
];

const CodeBlock = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass relative overflow-hidden rounded-2xl"
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
          <span
            className="ml-3 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            agent-register.ts
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-all duration-200 hover:bg-white/5"
          style={{ color: "var(--color-text-muted)" }}
          type="button"
        >
          {copied ? (
            <>
              <Check size={12} style={{ color: "var(--color-accent)" }} />
              <span style={{ color: "var(--color-accent)" }}>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto p-5">
        <pre
          className="text-sm leading-7"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {codeLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={
                isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
              }
              transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
              className="flex"
            >
              <span
                className="mr-6 inline-block w-5 shrink-0 select-none text-right text-sm"
                style={{ color: "var(--color-text-muted)", opacity: 0.4, lineHeight: "inherit" }}
              >
                {i + 1}
              </span>
              <span>{colorize(line)}</span>
            </motion.div>
          ))}
        </pre>
      </div>
    </motion.div>
  );
};

const colorize = (line: string): JSX.Element => {
  if (line.startsWith("//")) {
    return <span style={{ color: "var(--color-text-muted)" }}>{line}</span>;
  }

  const parts: JSX.Element[] = [];
  let remaining = line;
  let key = 0;

  const keywords = ["const", "await", "console"];
  const stringRegex = /(["'`])(.*?)\1/g;
  const commentRegex = /\/\/.*/;

  const inlineComment = commentRegex.exec(remaining);
  let commentPart = "";
  if (inlineComment) {
    commentPart = inlineComment[0];
    remaining = remaining.slice(0, inlineComment.index);
  }

  let match;
  let lastIndex = 0;
  const stringMatches: { start: number; end: number; text: string }[] = [];

  while ((match = stringRegex.exec(remaining)) !== null) {
    stringMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
  }

  if (stringMatches.length === 0 && !commentPart) {
    let processed = remaining;
    for (const kw of keywords) {
      const re = new RegExp(`\\b${kw}\\b`, "g");
      const segments: (string | JSX.Element)[] = [];
      let last = 0;
      let m;
      while ((m = re.exec(processed)) !== null) {
        if (m.index > last) {
          segments.push(processed.slice(last, m.index));
        }
        segments.push(
          <span key={`kw-${key++}`} style={{ color: "var(--color-primary-light)" }}>
            {kw}
          </span>
        );
        last = m.index + kw.length;
      }
      if (segments.length > 0) {
        if (last < processed.length) segments.push(processed.slice(last));
        return <>{segments}</>;
      }
    }
    return <span style={{ color: "var(--color-text)" }}>{remaining}</span>;
  }

  for (const sm of stringMatches) {
    if (sm.start > lastIndex) {
      const before = remaining.slice(lastIndex, sm.start);
      let hasKw = false;
      for (const kw of keywords) {
        if (before.includes(kw)) {
          const re = new RegExp(`\\b${kw}\\b`);
          const split = before.split(re);
          for (let si = 0; si < split.length; si++) {
            parts.push(
              <span key={key++} style={{ color: "var(--color-text)" }}>
                {split[si]}
              </span>
            );
            if (si < split.length - 1) {
              parts.push(
                <span key={key++} style={{ color: "var(--color-primary-light)" }}>
                  {kw}
                </span>
              );
            }
          }
          hasKw = true;
          break;
        }
      }
      if (!hasKw) {
        parts.push(
          <span key={key++} style={{ color: "var(--color-text)" }}>
            {before}
          </span>
        );
      }
    }
    parts.push(
      <span key={key++} style={{ color: "var(--color-accent-light)" }}>
        {sm.text}
      </span>
    );
    lastIndex = sm.end;
  }

  if (lastIndex < remaining.length) {
    parts.push(
      <span key={key++} style={{ color: "var(--color-text)" }}>
        {remaining.slice(lastIndex)}
      </span>
    );
  }

  if (commentPart) {
    parts.push(
      <span key={key++} style={{ color: "var(--color-text-muted)" }}>
        {commentPart}
      </span>
    );
  }

  return <>{parts}</>;
};

export const Developers = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const resourcesRef = useRef<HTMLDivElement>(null);
  const resourcesInView = useInView(resourcesRef, {
    once: true,
    margin: "-60px",
  });
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  return (
    <section id="developers" className="relative px-6 py-24 sm:py-32">
      {/* Top border */}
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
            Build on Plumise
          </h2>
          <p
            className="mx-auto max-w-2xl text-base sm:text-lg"
            style={{ color: "var(--color-text-muted)" }}
          >
            Everything you need to build AI-powered decentralized applications.
            Register agents, verify inference, and interact via MCP.
          </p>
        </motion.div>

        {/* Code + Resources Grid */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {/* Code Block */}
          <CodeBlock />

          {/* Resource Links */}
          <motion.div
            ref={resourcesRef}
            initial={{ opacity: 0, y: 30 }}
            animate={
              resourcesInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.a
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    resourcesInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + index * 0.1,
                  }}
                  className="glass group flex flex-col justify-between rounded-xl p-5 transition-all duration-300 hover:border-[var(--color-primary)]"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{
                          background: "rgba(6, 182, 212, 0.12)",
                        }}
                      >
                        <Icon
                          size={18}
                          style={{
                            color: "var(--color-primary-light)",
                          }}
                        />
                      </div>
                      {resource.tag && (
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                          style={{
                            background: "rgba(6, 182, 212, 0.1)",
                            color: "var(--color-primary-light)",
                            border: "1px solid rgba(6, 182, 212, 0.2)",
                          }}
                        >
                          {resource.tag}
                        </span>
                      )}
                    </div>
                    <h4
                      className="mb-1 text-sm font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {resource.title}
                    </h4>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {resource.description}
                    </p>
                  </div>
                  <div
                    className="mt-3 flex items-center gap-1 text-xs font-medium transition-all duration-300 group-hover:gap-2"
                    style={{ color: "var(--color-primary-light)" }}
                  >
                    Explore
                    <ArrowRight
                      size={12}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-2xl px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:gap-3.5"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              boxShadow:
                "0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(139, 92, 246, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(139, 92, 246, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(139, 92, 246, 0.15)";
            }}
          >
            Start Building
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <p
            className="mt-4 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Free to use. Open source. Community driven.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Developers;
