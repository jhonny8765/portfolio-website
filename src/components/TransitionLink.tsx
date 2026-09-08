'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useRouteTransition } from './RouteTransition';

// Keep native anchor attributes AND refs (Magnetic attaches a ref to these links).
type TransitionLinkProps = Omit<React.ComponentPropsWithRef<typeof Link>, 'href'> & {
  href: string;
};

export function TransitionLink({
  href,
  onNavigate,
  replace,
  scroll,
  transitionTypes,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const transition = useRouteTransition();

  return (
    <Link
      {...props}
      href={href}
      replace={replace}
      scroll={scroll}
      transitionTypes={transitionTypes}
      onNavigate={(event) => {
        let cancelled = false;
        onNavigate?.({
          preventDefault: () => {
            cancelled = true;
            event.preventDefault();
          },
        });
        if (cancelled || !transition) return;

        const destination = new URL(href, window.location.href);
        if (
          destination.pathname === pathname ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          return;
        }

        // Unlike onClick, Next's onNavigate excludes modifier-clicks, downloads,
        // external URLs, and new tabs, preserving the browser's normal behavior.
        event.preventDefault();
        transition(() => {
          const options = { scroll, transitionTypes };
          if (replace) router.replace(href, options);
          else router.push(href, options);
        });
      }}
    />
  );
}
