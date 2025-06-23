// js/util/debug.js

// Toggle all debug logging from one place:
export let DEBUG = false

/**
 * For tests (or runtime), force the DEBUG flag.
 */
export function setDebug(value) {
  DEBUG = !!value
}
/**
 * Logs only when DEBUG is truthy.
 * Usage: import { log } from "./debug.js"; log("…");
 */
export function log(...args) {
  if (DEBUG) console.log(...args)
}

/**
 * Warnings can also be gated.
 */
export function warn(...args) {
  if (DEBUG) console.warn(...args)
}

export function error(...args) {
  console.error(...args)
}
