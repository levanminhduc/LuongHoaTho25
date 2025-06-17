"use client";

import { useEffect, useLayoutEffect } from "react";

// Use useLayoutEffect for client, useEffect for SSR
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
