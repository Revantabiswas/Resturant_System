"use client";

import { AnimatePresence } from "framer-motion";

export default function AnimatePresenceWrapper({ children }) {
  return <AnimatePresence>{children}</AnimatePresence>;
}
