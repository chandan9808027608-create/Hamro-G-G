"use client"

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

/**
 * TransitionProvider component handles page transition animations.
 * It uses the pathname as a key to trigger the re-render and CSS animation
 * whenever the user navigates to a new page.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setDisplayChildren(children);
  }, [children]);

  return (
    <div key={pathname} className="page-transition-enter min-h-screen flex flex-col">
      {displayChildren}
    </div>
  );
}
