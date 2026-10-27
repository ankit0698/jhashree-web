import { useId } from "react";

type MotifProps = {
  className?: string;
};

export function MithilaBand({ className = "" }: MotifProps) {
  const rawId = useId();
  const patternId = `mithila-band-${rawId.replace(/:/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden ${className || "h-10"}`}
    >
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <pattern id={patternId} width="96" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 4h96M0 36h96" fill="none" stroke="var(--paper-light)" strokeWidth="1.5" />
            <path d="m0 20 16-12 16 12-16 12L0 20Zm32 0L48 8l16 12-16 12-16-12Zm32 0L80 8l16 12-16 12-16-12Z" fill="none" stroke="var(--paper-light)" strokeWidth="1.4" />
            <path d="m8 20 8-6 8 6-8 6-8-6Zm32 0 8-6 8 6-8 6-8-6Zm32 0 8-6 8 6-8 6-8-6Z" fill="var(--paper-light)" />
            <circle cx="16" cy="20" r="2" fill="var(--accent)" />
            <circle cx="48" cy="20" r="2" fill="var(--accent)" />
            <circle cx="80" cy="20" r="2" fill="var(--accent)" />
          </pattern>
        </defs>
        <rect width="1200" height="40" fill="var(--rust)" />
        <rect width="1200" height="40" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

export function MithilaSun({ className = "" }: MotifProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 220" className={className} fill="none">
      <g stroke="currentColor" strokeWidth="3">
        {Array.from({ length: 16 }, (_, index) => (
          <path
            key={index}
            d="M110 13c14 18 14 33 0 48-14-15-14-30 0-48Z"
            transform={`rotate(${index * 22.5} 110 110)`}
          />
        ))}
        <circle cx="110" cy="110" r="51" />
        <circle cx="110" cy="110" r="43" strokeDasharray="3 7" />
        <path d="M76 114c9-24 23-36 34-36s25 12 34 36c-9 20-23 30-34 30s-25-10-34-30Z" />
        <path d="M82 114c18-14 38-14 56 0-18 14-38 14-56 0Z" />
        <circle cx="110" cy="114" r="7" fill="currentColor" />
      </g>
    </svg>
  );
}

export function MithilaFishPair({ className = "" }: MotifProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 520 190" className={className} fill="none">
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M249 93c-50-52-120-63-180-22 27 12 27 34 0 48 61 38 131 26 180-26Z" />
        <path d="m71 71-39-30c-2 34 9 51 38 54-28 7-39 24-36 53l37-29" />
        <circle cx="216" cy="89" r="5" fill="currentColor" />
        <path d="M271 93c50-52 120-63 180-22-27 12-27 34 0 48-61 38-131 26-180-26Z" />
        <path d="m449 71 39-30c2 34-9 51-38 54 28 7 39 24 36 53l-37-29" />
        <circle cx="304" cy="89" r="5" fill="currentColor" />
        <path d="M102 70c18 10 22 40 5 55m25-67c22 18 24 52 3 76m28-78c19 19 20 56 2 76m30-66c14 19 14 40 0 58M418 70c-18 10-22 40-5 55m-25-67c-22 18-24 52-3 76m-28-78c-19 19-20 56-2 76m-30-66c-14 19-14 40 0 58" />
        <path d="M260 92c-32 20-41 44-29 71 14-11 24-23 29-38 5 15 15 27 29 38 12-27 3-51-29-71Z" />
        <path d="M260 92c-6-24-22-40-47-48 1 19 9 35 24 48-15-1-29 4-42 15 19 16 41 11 65-15Zm0 0c6-24 22-40 47-48-1 19-9 35-24 48 15-1 29 4 42 15-19 16-41 11-65-15Z" />
      </g>
    </svg>
  );
}

export function MithilaTree({ className = "" }: MotifProps) {
  const leaves = [
    [92, 143, -44], [126, 116, -34], [162, 90, -24], [205, 66, -15],
    [308, 66, 15], [352, 90, 24], [388, 116, 34], [422, 143, 44],
    [137, 175, -55], [376, 175, 55], [185, 145, -32], [328, 145, 32],
  ];

  return (
    <svg aria-hidden="true" viewBox="0 0 520 520" className={className} fill="none">
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M248 466c13-74 8-139 12-202 4-60 1-111 0-164m15 366c-11-78-6-139-15-202" />
        <path d="M260 287c-22-58-66-102-133-133m137 74c-18-58-50-101-97-132m97 132c18-58 50-101 97-132m-101 191c22-58 66-102 133-133" />
        <path d="M215 466h90M197 480h126" />
        {leaves.map(([x, y, rotation], index) => (
          <g key={index} transform={`translate(${x} ${y}) rotate(${rotation})`}>
            <path d="M0 0c20-30 47-34 69-12C50 14 25 18 0 0Z" />
            <path d="M7-1c19-4 36-7 55-10M25-5l-2-15m18 12 7-16" />
          </g>
        ))}
        <circle cx="260" cy="89" r="27" />
        <circle cx="260" cy="89" r="18" strokeDasharray="3 6" />
        <path d="M226 449c-28-7-45-25-50-53 28 3 46 20 50 53Zm68 0c28-7 45-25 50-53-28 3-46 20-50 53Z" />
      </g>
    </svg>
  );
}

export function MithilaCorner({ className = "" }: MotifProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 180" className={className} fill="none">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 172V8h164M17 163V17h146" />
        <path d="M25 155c31-61 71-101 130-130" />
        <path d="M47 126c-23-3-35-15-37-37 23 1 36 13 37 37Zm30-32c-23-3-35-15-37-37 23 1 36 13 37 37Zm31-30c-23-3-35-15-37-37 23 1 36 13 37 37Zm19 69c3-23 15-35 37-37-1 23-13 36-37 37Zm-32 30c3-23 15-35 37-37-1 23-13 36-37 37" />
        <circle cx="77" cy="96" r="4" fill="currentColor" />
      </g>
    </svg>
  );
}
