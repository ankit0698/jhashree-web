import HeritageRule from "@/components/ui/heritage-rule";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "paper" | "dark";
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "paper",
  align = "left",
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <p
        className={`text-[0.68rem] font-extrabold uppercase tracking-[0.34em] ${
          isDark ? "text-[var(--accent-soft)]" : "text-[var(--rust)]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 font-serif text-[clamp(2.35rem,4.5vw,4rem)] leading-[0.96] tracking-[-0.02em] ${
          isDark ? "text-[var(--hero-foreground)]" : "text-[var(--ink)]"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-6 max-w-2xl text-base leading-8 ${
            align === "center" ? "mx-auto" : ""
          } ${isDark ? "text-[var(--hero-muted)]" : "text-[var(--muted)]"}`}
        >
          {description}
        </p>
      ) : null}
      <HeritageRule
        className={`mt-6 max-w-[16rem] ${align === "center" ? "mx-auto" : ""} ${
          isDark ? "text-[var(--accent)]" : "text-[var(--rust)]"
        }`}
      />
    </div>
  );
}
