type HeritageRuleProps = {
  className?: string;
};

export default function HeritageRule({ className = "" }: HeritageRuleProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 text-current ${className}`}
    >
      <span className="h-px flex-1 bg-current opacity-30" />
      <svg
        viewBox="0 0 96 22"
        className="h-[1.15rem] w-24 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 11h18c7 0 8-7 14-7 5 0 7 7 12 7s7-7 12-7c6 0 7 7 14 7h18"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M4 11h18c7 0 8 7 14 7 5 0 7-7 12-7s7 7 12 7c6 0 7-7 14-7h18"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path d="m48 5 6 6-6 6-6-6 6-6Z" fill="currentColor" />
        <circle cx="28" cy="11" r="1.8" fill="currentColor" />
        <circle cx="68" cy="11" r="1.8" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-current opacity-30" />
    </div>
  );
}
