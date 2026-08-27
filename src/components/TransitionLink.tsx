"use client";

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export const TransitionLink = ({ children, className, href, ...props }: TransitionLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    // If navigating to the same path, just return
    if (pathname === href) {
      return;
    }

    const overlay = document.getElementById('page-transition-overlay');
    
    if (overlay) {
      const tl = gsap.timeline();
      
      // Wipe up to cover
      tl.to(overlay, {
        y: "0%",
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          // Navigate once covered
          router.push(href);
        }
      });
    } else {
      router.push(href);
    }
  };

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleTransition}
      {...props}
    >
      {children}
    </Link>
  );
};
