import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Clock, Zap, RotateCcw } from "lucide-react";

interface TokenAllocation {
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

const blockReward: TokenAllocation = {
  label: "Block Rewards",
  amount: 840_960_000,
  percentage: 84.1,
  color: "var(--color-primary)",
};

const genesisAllocations: TokenAllocation[] = [
  {
    label: "Ecosystem Fund",
    amount: 55_700_000,
    percentage: 5.57,
    color: "#22D3EE",
  },
  {
    label: "Foundation",
    amount: 47_700_000,
    percentage: 4.77,
    color: "#818CF8",
  },
  {
    label: "Liquidity",
    amount: 31_800_000,
    percentage: 3.18,
    color: "#34D399",
  },
  {
    label: "Team",
    amount: 23_900_000,
    percentage: 2.39,
    color: "#F59E0B",
  },
];

const allAllocations = [blockReward, ...genesisAllocations];

const formatNumber = (n: number): string => {
  return n.toLocaleString("en-US");
};

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

const stats: StatCardProps[] = [
  { icon: Zap, value: "10 PLM", label: "Per Block" },
  { icon: Clock, value: "3s", label: "Block Time" },
  { icon: RotateCcw, value: "~4 Years", label: "Halving Cycle" },
];

const AnimatedBar = ({
  allocation,
  index,
  isInView,
}: {
  allocation: TokenAllocation;
  index: number;
  isInView: boolean;
}) => {
  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: allocation.color }}
          />
          <span style={{ color: "var(--color-text)" }}>{allocation.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {formatNumber(allocation.amount)} PLM
          </span>
          <span
            className="min-w-[3.5rem] text-right font-mono text-sm font-medium"
            style={{ color: allocation.color }}
          >
            {allocation.percentage}%
          </span>
        </div>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full"
        style={{ background: "var(--color-surface)" }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${allocation.percentage}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.3 + index * 0.15,
            ease: "easeOut",
          }}
          style={{
            background: `linear-gradient(90deg, ${allocation.color}, ${allocation.color}88)`,
            boxShadow: `0 0 12px ${allocation.color}40`,
          }}
        />
      </div>
    </div>
  );
};

const AnimatedCounter = ({
  target,
  isInView,
}: {
  target: number;
  isInView: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * end);
      setCount(start);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return <>{formatNumber(count)}</>;
};

export const Tokenomics = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, margin: "-80px" });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const totalSupply = 1_000_000_000;

  return (
    <section id="tokenomics" className="relative px-6 py-24 sm:py-32">
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
            Tokenomics
          </h2>
          <p
            className="mx-auto max-w-2xl text-base sm:text-lg"
            style={{ color: "var(--color-text-muted)" }}
          >
            A sustainable token model designed for long-term network security and
            ecosystem growth.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Total supply + Chart */}
          <div ref={chartRef} className="lg:col-span-3">
            {/* Total Supply */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5 }}
              className="glass mb-8 rounded-2xl p-6"
            >
              <div
                className="mb-1 text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}
              >
                Total Supply
              </div>
              <div
                className="font-mono text-3xl font-bold sm:text-4xl"
                style={{ color: "var(--color-text)" }}
              >
                <AnimatedCounter
                  target={totalSupply}
                  isInView={chartInView}
                />{" "}
                <span
                  className="text-lg font-medium"
                  style={{ color: "var(--color-primary-light)" }}
                >
                  PLM
                </span>
              </div>
            </motion.div>

            {/* Composite bar visualization */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={
                chartInView
                  ? { opacity: 1, scaleX: 1 }
                  : { opacity: 0, scaleX: 0 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
              className="mb-10"
            >
              <div className="flex h-6 overflow-hidden rounded-full">
                {allAllocations.map((a) => (
                  <div
                    key={a.label}
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${a.percentage}%`,
                      background: a.color,
                      opacity: 0.85,
                    }}
                    title={`${a.label}: ${a.percentage}%`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Individual bars */}
            <div className="space-y-5">
              {allAllocations.map((allocation, index) => (
                <AnimatedBar
                  key={allocation.label}
                  allocation={allocation}
                  index={index}
                  isInView={chartInView}
                />
              ))}
            </div>
          </div>

          {/* Right: Stats + Legend */}
          <div className="lg:col-span-2">
            {/* Key Stats */}
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={
                statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.5 }}
              className="mb-8 grid grid-cols-3 gap-3 lg:grid-cols-1"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={
                      statsInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: 20 }
                    }
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    className="glass rounded-xl p-4 text-center lg:flex lg:items-center lg:gap-4 lg:text-left"
                  >
                    <div
                      className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg lg:mx-0 lg:mb-0"
                      style={{ background: "rgba(6, 182, 212, 0.12)" }}
                    >
                      <Icon
                        size={18}
                        style={{ color: "var(--color-primary-light)" }}
                      />
                    </div>
                    <div>
                      <div
                        className="font-mono text-lg font-bold"
                        style={{ color: "var(--color-text)" }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Genesis breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-xl p-5"
            >
              <div
                className="mb-4 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}
              >
                Genesis Allocation Breakdown
              </div>
              <div className="space-y-3">
                {genesisAllocations.map((a) => (
                  <div key={a.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: a.color }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text)" }}
                      >
                        {a.label}
                      </span>
                    </div>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {formatNumber(a.amount)}
                    </span>
                  </div>
                ))}
                <div
                  className="mt-3 border-t pt-3"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text)" }}
                    >
                      Genesis Total
                    </span>
                    <span
                      className="font-mono text-sm font-medium"
                      style={{ color: "var(--color-accent-light)" }}
                    >
                      {formatNumber(159_040_000)} PLM
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
