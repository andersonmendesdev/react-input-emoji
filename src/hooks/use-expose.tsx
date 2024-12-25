// @ts-check

import { useImperativeHandle } from "react";
import { useSanitize } from "./use-sanitize";
import { TextInputRef } from "../text-input";

/**
 * @typedef {Object} Props
 * @property {React.Ref<any>} ref
 * @property {React.MutableRefObject<import('../text-input').Ref | null>} textInputRef
 * @property {(value: string) => void} setValue
 * @property {() => void} emitChange
 * @property {boolean=} shouldConvertEmojiToImage
 */

/**
 *
 * @param {Props} props
 */

interface ExposeProps {
  ref: React.Ref<any>;
  textInputRef: React.MutableRefObject<TextInputRef | null>;
  setValue: (value: string) => void;
  emitChange: (sanitizedText: string) => void;
  shouldConvertEmojiToImage?: boolean;
}

export function useExpose({
  ref,
  textInputRef,
  setValue,
  emitChange,
  shouldConvertEmojiToImage
}: ExposeProps) {
  const { sanitize, sanitizedTextRef } = useSanitize(
    false,
    shouldConvertEmojiToImage
  );

  useImperativeHandle(ref, () => ({
    get value() {
      return sanitizedTextRef.current;
    },
    set value(value) {
      setValue(value);
    },
    focus: () => {
      if (textInputRef.current === null) return;
      textInputRef.current.focus();
    },
    blur: () => {
      if (textInputRef.current !== null) {
        emitChange(sanitize(textInputRef.current.html));
      }
    }
  }));
}
