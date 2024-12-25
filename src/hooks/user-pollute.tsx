// @ts-check

import { useCallback, useRef } from "react";
import { PolluteFn } from "../types/types";

/**
 * @typedef {import('../types/types').PolluteFn} PolluteFn
 */

// eslint-disable-next-line valid-jsdoc
/** */
export function usePollute() {
  /** @type {React.MutableRefObject<PolluteFn[]>} */
  const polluteFnsRef = useRef<PolluteFn[]>([]);

  /** @type {(fn: PolluteFn) => void} */
  const addPolluteFn = useCallback((fn: PolluteFn) => {
    polluteFnsRef.current.push(fn);
  }, []);

  /** @type {(html: string) => string} */
  const pollute = useCallback((text: string) => {
    const result = polluteFnsRef.current.reduce((acc, fn) => {
      return fn(acc);
    }, text);

    return result;
  }, []);

  return { addPolluteFn, pollute };
}
