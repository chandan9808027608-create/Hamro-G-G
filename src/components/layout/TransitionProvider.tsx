"use client"

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

/**
 * TransitionProvider component handles premium page transition animations.
 * It uses the pathname as a key to trigger the re-render and a refined
 * CSS animation whenever the user navigates.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Ensure the new children are set when the route changes
    setDisplayChildren(children);
    // Scroll to top on every navigation for a clean start
    window.scrollTo(0, 0);
  }, [children, pathname]);

  return (
    <div 
      key={pathname} 
      className="page-transition-premium min-h-screen flex flex-col"
    >
      {displayChildren}
    </div>
  );
}
