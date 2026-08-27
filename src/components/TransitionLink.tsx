'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const TransitionLink = ({
  children,
  className,
  href,
  onClick,
  ...props
}: TransitionLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    }

    // Parse target path and hash
    const [targetPath] = href.split('#');
    const normalizedTarget = targetPath || '/';

    // Same-page anchor or hash link: let browser/Lenis handle smooth scrolling without overlay
    if (href.startsWith('#') || normalizedTarget === pathname) {
      return;
    }

    e.preventDefault();

    const overlay = document.getElementById('page-transition-overlay');

    if (overlay) {
      const tl = gsap.timeline();

      // Wipe up to cover
      tl.to(overlay, {
        y: '0%',
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: () => {
          // Navigate once covered
          router.push(href);
        },
      });
    } else {
      router.push(href);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
};
