/**
 * Aurora Luxe – Central Animation Variants
 * All Framer Motion easing / variants in one place.
 * Import what you need; keep animations subtle and performant.
 */

// ─── Easing Presets ─────────────────────────────────────────────────────────
export const ease = {
  /** Apple / Linear spring – used for premium reveals */
  luxury: [0.25, 0.1, 0.25, 1.0] as const,
  /** Entrance: fast in, gradual deceleration */
  out: [0.0, 0.0, 0.2, 1.0] as const,
  /** Subtle bounce feel */
  spring: { type: "spring", stiffness: 260, damping: 28 } as const,
  /** Snappy spring for micro-interactions */
  snap: { type: "spring", stiffness: 400, damping: 30 } as const,
};

// ─── Fade / Slide Variants (section reveals) ────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: ease.out },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: ease.luxury },
  },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: ease.out },
  },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: ease.out },
  },
};

// ─── Stagger container ───────────────────────────────────────────────────────
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

/** Each child in a stagger grid */
export const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: ease.out },
  },
};

// ─── Hero text word-by-word reveal ──────────────────────────────────────────
export const heroTitle = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

export const heroWord = {
  hidden: { opacity: 0, y: 32, rotateX: -8 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: ease.out },
  },
};

// ─── Scale-in (badge / icon) ─────────────────────────────────────────────────
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: ease.out },
  },
};

// ─── Image zoom on hover (used inside motion.div wrapping <Image>) ───────────
export const imageZoom = {
  rest: { scale: 1, transition: { duration: 0.8, ease: ease.luxury } },
  hover: { scale: 1.06, transition: { duration: 0.8, ease: ease.luxury } },
};

// ─── Button hover / tap ──────────────────────────────────────────────────────
export const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.025, transition: ease.snap },
  tap: { scale: 0.975, transition: ease.snap },
};

// ─── Viewport defaults (used on all whileInView) ─────────────────────────────
export const viewport = { once: true, margin: "-80px" };
