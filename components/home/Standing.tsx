import CountUp from "@/components/motion/CountUp";
import Marquee from "@/components/motion/Marquee";
import Reveal from "@/components/motion/Reveal";
import { STATS, CREDENTIALS } from "@/lib/site";

export default function Standing() {
  const held = CREDENTIALS.filter((c) => c.held);
  const strip = [
    ...held.map((c) => c.name),
    "Auckland · NZ-wide",
    "WordPress · Shopify · Custom",
    `${STATS[0].value} sites hosted`,
    "Automation & AI help",
  ];

  return (
    <section
      className="home-section home-section--tight"
      aria-label="Facts and credentials"
    >
      <div className="home-wrap">
        <Reveal className="stats" as="ul">
          {STATS.map((s) => (
            <li key={s.label}>
              <b>
                <CountUp to={s.value} suffix={s.suffix} />
              </b>
              <small>{s.label}</small>
            </li>
          ))}
          <li>
            <b className="stats__text">Same day</b>
            <small>reply on every enquiry</small>
          </li>
        </Reveal>
      </div>
      <Marquee
        items={strip.map((t, i) => (
          <span
            key={i}
            className={held.some((c) => c.name === t) ? "hi" : undefined}
          >
            {t}
          </span>
        ))}
        reverse
        ariaLabel="Credentials"
      />
    </section>
  );
}
