import Image from 'next/image';
import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Digitiful Home">
      <Image
        src="https://digitiful.net/wp-content/uploads/elementor/thumbs/DG-05-1-r9tunke78cyiykbizacfpfcdwqz7outsg8xjrtvb4a.png"
        alt="Digitiful Logo"
        width={36}
        height={36}
        className="h-9 w-auto"
        priority
      />
      <Image
        src="https://digitiful.net/wp-content/uploads/2025/08/DG-04-scaled.png"
        alt="Digitiful Brand Name"
        width={60}
        height={16}
        className="h-4 w-auto"
      />
    </Link>
  );
}

export function FooterLogo() {
    return (
      <Link href="/" className="flex items-center gap-3" aria-label="Digitiful Home">
        <Image
          src="https://digitiful.net/wp-content/uploads/elementor/thumbs/DG-05-1-r9tunke78cyiykbizacfpfcdwqz7outsg8xjrtvb4a.png"
          alt="Digitiful Logo"
          width={44}
          height={44}
          className="h-11 w-auto"
          priority
        />
        <Image
          src="https://digitiful.net/wp-content/uploads/2025/08/DG-04-scaled.png"
          alt="Digitiful Brand Name"
          width={75}
          height={20}
          className="h-5 w-auto"
        />
      </Link>
    );
  }
