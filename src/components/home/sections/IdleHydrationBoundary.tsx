"use client";

import {
  createElement,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

type IdleRequestCallback = () => void;

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type IdleHydrationBoundaryProps<TProps> = {
  children: ReactNode;
  componentProps: TProps;
  loader: () => Promise<ComponentType<TProps>>;
  timeoutMs?: number;
};

export function IdleHydrationBoundary<TProps extends object>({
  children,
  componentProps,
  loader,
  timeoutMs = 1200,
}: IdleHydrationBoundaryProps<TProps>) {
  const [HydratedComponent, setHydratedComponent] =
    useState<ComponentType<TProps> | null>(null);

  useEffect(() => {
    if (HydratedComponent) {
      return;
    }

    let isCancelled = false;

    const hydrate = () => {
      void loader().then((Component) => {
        if (!isCancelled) {
          setHydratedComponent(() => Component);
        }
      });
    };

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleHandle = idleWindow.requestIdleCallback(hydrate, {
        timeout: timeoutMs,
      });

      return () => {
        isCancelled = true;
        idleWindow.cancelIdleCallback?.(idleHandle);
      };
    }

    const fallbackTimer = window.setTimeout(hydrate, 1);

    return () => {
      isCancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [HydratedComponent, loader, timeoutMs]);

  function hydrateNow() {
    if (HydratedComponent) {
      return;
    }

    void loader().then((Component) => {
      setHydratedComponent(() => Component);
    });
  }

  const ResolvedComponent = HydratedComponent as ComponentType<TProps> | null;

  return (
    <div
      onFocusCapture={hydrateNow}
      onPointerDownCapture={hydrateNow}
      onPointerEnter={hydrateNow}
      onTouchStartCapture={hydrateNow}
    >
      {ResolvedComponent ? (
        createElement(ResolvedComponent, componentProps)
      ) : (
        children
      )}
    </div>
  );
}
