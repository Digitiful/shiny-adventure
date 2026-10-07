
import Image from 'next/image';
import Link from 'next/link';

/**
 * @fileOverview Master Logo Component Node.
 * Identity: Optimized for clean visual signal (Icon only).
 * Asset URL provided by Operator SAM.
 */

const MASTER_LOGO_URL = "https://iili.io/qLWQrJt.md.png";

export function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center" aria-label="Digitiful Home">
      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-primary/20 bg-black/40 p-1 flex items-center justify-center">
        <Image
          src={MASTER_LOGO_URL}
          alt="Digitiful Core"
          fill
          className="object-contain p-1 transition-transform duration-500 hover:scale-110"
          priority
        />
      </div>
    </Link>
  );
}

export function FooterLogo() {
  return (
    <Link href="/" className="flex items-center" aria-label="Digitiful Home">
      <div className="relative h-12 w-12 rounded-full overflow-hidden border border-primary/20 bg-black/40 p-1 flex items-center justify-center">
        <Image
          src={MASTER_LOGO_URL}
          alt="Digitiful Core"
          fill
          className="object-contain p-1.5 transition-transform duration-500 hover:scale-110"
          priority
        />
      </div>
    </Link>
  );
}
