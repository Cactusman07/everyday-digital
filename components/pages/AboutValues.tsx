// The values and process sections on the About page, below the WordPress copy.

import Link from "next/link";
import OutlineIcon from "@/components/shared/OutlineIcon";
import type { ReactNode } from "react";

/** The 20px outline icon used on each value card. */
const ValueIcon = ({ children }: { children: ReactNode }) => (
  <OutlineIcon className="w-5 h-5" strokeWidth={1.5}>
    {children}
  </OutlineIcon>
);

const VALUES = [
  {
    icon: (
      <ValueIcon>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </ValueIcon>
    ),
    title: "People first",
    desc: "We take time to understand your goals, not just your brief. Your success genuinely matters to us.",
  },
  {
    icon: (
      <ValueIcon>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </ValueIcon>
    ),
    title: "Everything in one place",
    desc: "Hosting, design, development, automation, social — one team, one relationship, no hand-offs.",
  },
  {
    icon: (
      <ValueIcon>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </ValueIcon>
    ),
    title: "We teach as we go",
    desc: "We share what we know so you can make confident decisions about your own digital presence.",
  },
  {
    icon: (
      <ValueIcon>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </ValueIcon>
    ),
    title: "Always up to date",
    desc: "Digital moves fast. We keep up so you don't have to — you'll always get current thinking.",
  },
];

const STEPS = [
  {
    title: "Listen",
    desc: "We start by understanding what you actually need — not what we assume you need.",
  },
  {
    title: "Advise",
    desc: "Honest guidance on what will work — based on experience, not a sales pitch.",
  },
  {
    title: "Build",
    desc: "We get to work, keeping you in the loop with clear communication throughout.",
  },
  {
    title: "Support",
    desc: "The work doesn't stop at launch. We're here for ongoing help whenever you need it.",
  },
];

/** Section heading: an h2 in body type, not the script heading style. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="about-values__title text-accent">{children}</h2>;
}

export default function AboutValues() {
  return (
    <div className="mt-10 space-y-10">
      <div className="border-l-4 border-[#4b6ceb] rounded-r-xl bg-white/5 px-6 py-5">
        <SectionTitle>Our Mission</SectionTitle>
        <p className="text-white/70 text-base leading-relaxed m-0">
          We believe the digital world should work for{" "}
          <strong className="text-white font-medium">everyone</strong> — not
          just the big players. Whether you&apos;re a sole trader finding your
          feet online or an established business ready to grow, we&apos;re here
          to make technology feel less like a barrier and more like an
          advantage.
        </p>
      </div>

      <div>
        <SectionTitle>What Sets Us Apart</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5"
            >
              <div className="text-accent mb-3">{v.icon}</div>
              <p className="text-white text-base font-medium mb-2">{v.title}</p>
              <p className="text-white/60 text-sm leading-relaxed m-0">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>How We Work</SectionTitle>
        <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-white/5 rounded-xl p-4">
              <p className="text-accent text-sm font-medium mb-1">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-white text-base font-medium mb-1">{s.title}</p>
              <p className="text-white/60 text-sm leading-relaxed m-0">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap">
        <p className="text-white/70 text-base leading-relaxed m-0">
          <strong className="text-white font-medium">
            Ready to get started?
          </strong>
          <br />
          Coffee, call, or email — we&apos;re easy to reach and happy to chat,
          no commitment needed.
        </p>
        <Link href="/contact" className="btn btn--accent">
          Get in touch
        </Link>
      </div>
    </div>
  );
}
