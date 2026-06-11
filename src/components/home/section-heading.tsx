type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent-deep)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
