'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Compass,
  Route,
  BookOpen,
  Store,
  BarChart3,
  Trophy,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Brain,
  Target,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Menu,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  {
    value: '72%',
    label: "of employees don't know which AI tool to use for a given task",
    icon: AlertTriangle,
  },
  {
    value: '65%',
    label: 'repeat the same mistakes when prompting AI tools',
    icon: Clock,
  },
  {
    value: '$4.2M',
    label: 'average annual waste per enterprise from misused AI tools',
    icon: TrendingUp,
  },
  {
    value: '89%',
    label: 'want structured guidance but have no internal resource',
    icon: Users,
  },
];

const pillars = [
  {
    icon: Brain,
    title: 'AI Literacy',
    description:
      'Build foundational skills across your organisation with structured, gamified learning paths tailored to every role and department.',
  },
  {
    icon: Target,
    title: 'Smart Recommendations',
    description:
      'Stop guessing. Our AI GPS analyses your task, context, and skill level to recommend the perfect tool, prompt, and workflow.',
  },
  {
    icon: Users,
    title: 'Collaborative Knowledge',
    description:
      'Turn isolated expertise into shared advantage. A living knowledge hub where your best AI practices compound across the entire team.',
  },
];

const features = [
  {
    icon: Compass,
    title: 'AI GPS',
    description:
      'Describe your task. Get an instant recommendation for the best AI tool, prompt template, and approach — personalised to your skill level.',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    icon: Route,
    title: 'Learning Paths',
    description:
      'Structured, gamified journeys from beginner to expert. Earn XP, unlock achievements, and level up your AI proficiency with real tasks.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: BookOpen,
    title: 'Knowledge Hub',
    description:
      'A curated, searchable repository of guides, case studies, and best practices — written by your team, for your team.',
    gradient: 'from-purple-500 to-fuchsia-600',
  },
  {
    icon: Store,
    title: 'Prompt Marketplace',
    description:
      'Discover, share, and clone high-performing prompts. Rated by usage, refined by the community, optimised for your workflows.',
    gradient: 'from-fuchsia-500 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Waste Tracker',
    description:
      'Visualise AI usage, time saved, and productivity gains. Identify waste hotspots and prove ROI with hard data.',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    icon: Trophy,
    title: 'AI Champions',
    description:
      'Recognise and celebrate your top contributors. Leaderboards, badges, and achievements that drive adoption across the organisation.',
    gradient: 'from-amber-500 to-orange-600',
  },
];

const steps = [
  {
    number: '01',
    title: 'Describe Your Task',
    description:
      'Tell us what you want to accomplish — in plain language. No jargon, no prior AI knowledge required.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Get a Recommendation',
    description:
      'Receive a tailored suggestion: the right AI tool, a proven prompt template, and step-by-step guidance.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'Track & Improve',
    description:
      "Complete tasks, earn XP, share what works. Watch your team's AI literacy — and productivity — soar.",
    icon: TrendingUp,
  },
];

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Resources: ['Documentation', 'Help Center', 'Community', 'Status'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* ───────── Navbar ───────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden glow-primary transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
              Prompta
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#solution" className="hover:text-foreground transition-colors">
              Solution
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 p-4">
              <a
                href="#features"
                className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a
                href="#solution"
                className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solution
              </a>
              <hr className="border-border my-2" />
              <Link
                href="/login"
                className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold text-center shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ───────── Hero ───────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[128px] animate-pulse [animation-delay:2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-chart-4/10 blur-[128px] animate-pulse [animation-delay:4s]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-24 text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Now in Early Access — Join the Waitlist
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.08] font-[family-name:var(--font-outfit)]"
          >
            Stop wasting{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-chart-4 to-accent bg-clip-text text-transparent">
                AI potential.
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-primary/20 via-chart-4/20 to-accent/20 blur-sm" />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Build skills. Share knowledge. Work smarter.
            <br className="hidden sm:block" />
            <span className="text-foreground/70">
              The enterprise platform that turns AI confusion into competitive advantage.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-base font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-base font-medium hover:bg-card hover:border-primary/30 transition-all"
            >
              Learn More
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-16 flex flex-col items-center gap-3"
          >
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-accent/60"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">2,400+</span> professionals already levelling up
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ───────── Problem / Stats ───────── */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              The Problem
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
              AI adoption is{' '}
              <span className="text-destructive">broken</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Companies are investing in AI tools but failing to equip their people. The result?
              Wasted budgets, frustrated employees, and zero ROI.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.value}
                variants={scaleIn}
                custom={i}
                className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur-md p-8 text-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <stat.icon className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-4xl font-bold font-[family-name:var(--font-outfit)] text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────── Solution ───────── */}
      <section id="solution" className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[128px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
              The Solution
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
              One platform.{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Total AI clarity.
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Prompta unifies learning, tooling, and knowledge sharing into a single experience
              that transforms how your team works with AI.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                variants={fadeUp}
                custom={i}
                className="gradient-border group rounded-2xl p-8 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <pillar.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────── Features Grid ───────── */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
              Everything your team needs to{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                master AI
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                custom={i}
                className="shine group relative rounded-2xl border border-border bg-card/60 backdrop-blur-md p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Icon with gradient */}
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────── How It Works ───────── */}
      <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[128px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
              From confusion to{' '}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                confidence
              </span>{' '}
              in 3 steps
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                custom={i}
                className="relative"
              >
                {/* Connecting line (hidden on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[calc(50%+56px)] right-[calc(-50%+56px)] h-px bg-gradient-to-r from-border to-transparent" />
                )}

                <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-md p-8 text-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  {/* Step number */}
                  <div className="mx-auto mb-6 relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────── CTA Section ───────── */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 animated-gradient opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            <div className="relative z-10 px-8 py-20 sm:px-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-[family-name:var(--font-outfit)]">
                Ready to transform{' '}
                <br className="hidden sm:block" />
                your team?
              </h2>
              <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                Join thousands of forward-thinking companies already using Prompta to turn AI from
                a cost centre into a competitive edge.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary text-base font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/30 text-white text-base font-medium hover:bg-white/10 transition-all"
                >
                  See All Features
                </a>
              </div>

              {/* Trust signals */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Free 14-day trial
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Setup in 5 minutes
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold font-[family-name:var(--font-outfit)]">
                  Prompta
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The enterprise AI learning platform that turns confusion into confidence.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold mb-4">{category}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Prompta. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
