"use client";

export function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 4 7 0-5 2.5-9 6-12 3.5 3 6 7 6 12 2.5-1.5 4-4 4-7 0-5.5-4.5-10-10-10z" />
      <path d="M12 22V8" />
      <path d="M8 14c0-2 2-4 4-6" />
      <path d="M16 14c0-2-2-4-4-6" />
    </svg>
  );
}

export function BotanicalBranch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" className={className}>
      <path d="M60 150 Q55 120 50 100 Q45 80 55 60 Q60 50 60 40" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M55 60 Q40 50 30 40 Q25 35 35 30 Q45 25 55 40" stroke="var(--color-accent)" strokeWidth="1" fill="var(--color-sage)" opacity="0.3" />
      <path d="M60 80 Q75 70 85 60 Q90 55 80 50 Q70 45 60 60" stroke="var(--color-accent)" strokeWidth="1" fill="var(--color-sage)" opacity="0.3" />
      <path d="M58 100 Q43 90 33 80 Q28 75 38 70 Q48 65 58 80" stroke="var(--color-accent)" strokeWidth="1" fill="var(--color-sage)" opacity="0.25" />
      <circle cx="60" cy="38" r="3" fill="var(--color-primary)" opacity="0.2" />
      <circle cx="33" cy="28" r="2" fill="var(--color-primary)" opacity="0.15" />
      <circle cx="83" cy="48" r="2" fill="var(--color-primary)" opacity="0.15" />
    </svg>
  );
}

export function MountainBackground({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 600" fill="none" className={className} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DDEDE4" />
          <stop offset="100%" stopColor="#F3F8F3" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#skyGrad)" />
      <path d="M0 600 L200 300 L350 420 L500 250 L650 380 L800 280 L800 600Z" fill="#C8DCC9" opacity="0.5" />
      <path d="M0 600 L150 350 L300 480 L450 320 L600 440 L800 340 L800 600Z" fill="#B5CEBA" opacity="0.6" />
      <path d="M0 600 L100 420 L250 520 L400 380 L550 500 L700 400 L800 460 L800 600Z" fill="#A2C0A8" opacity="0.5" />
      <circle cx="650" cy="100" r="40" fill="#C4D7C7" opacity="0.4" />
      <path d="M120 600 L140 480 L135 500 L155 440 L150 460 L170 400 L165 420 L185 360" stroke="#6B8C7A" strokeWidth="2" fill="none" opacity="0.3" />
      <path d="M160 600 L175 520 L172 535 L185 480 L182 495 L195 440" stroke="#8A9C93" strokeWidth="1.5" fill="none" opacity="0.25" />
    </svg>
  );
}
