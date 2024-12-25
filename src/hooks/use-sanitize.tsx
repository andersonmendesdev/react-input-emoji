// @ts-check

import { useCallback, useRef } from "react";
import { renderToString } from "react-dom/server";
import emoji from "react-easy-emoji";
import { removeHtmlExceptBr } from "../utils/input-event-utils";
import { SanitizeFn } from "../types/types";

const EMOJI_REGEX = new RegExp(
  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
);

/**
 * @typedef {import('../types/types').SanitizeFn} SanitizeFn
 */

// eslint-disable-next-line valid-jsdoc
/**
 * @param {boolean} shouldReturn
 * @param {boolean} shouldConvertEmojiToImage
 */

export function useSanitize(
  shouldReturn: boolean,
  shouldConvertEmojiToImage: boolean
) {
  /** @type {React.MutableRefObject<SanitizeFn[]>} */
  const sanitizeFnsRef = useRef<SanitizeFn[]>([]);

  const sanitizedTextRef = useRef("");

  /** @type {(fn: SanitizeFn) => void} */
  const addSanitizeFn = useCallback((fn: SanitizeFn) => {
    sanitizeFnsRef.current.push(fn);
  }, []);

  /** @type {(html: string) => string} */

  const sanitize = useCallback(
    (html: string) => {
      let result = sanitizeFnsRef.current.reduce((acc, fn) => {
        return fn(acc);
      }, html);

      result = replaceAllHtmlToString(result, shouldReturn);

      if (shouldConvertEmojiToImage) {
        result = convertEmojiToImage(result);
      }

      sanitizedTextRef.current = result;

      return result;
    },
    [shouldReturn, shouldConvertEmojiToImage]
  );

  return { addSanitizeFn, sanitize, sanitizedTextRef };
}

/**
 *
 * @param {string} html
 * @param {boolean} shouldReturn
 * @return {string}
 */
export function replaceAllHtmlToString(html: string, shouldReturn: boolean) {
  const container = document.createElement("div");
  container.innerHTML = html;
  let text;
  if (shouldReturn) {
    text = removeHtmlExceptBr(container);
  } else {
    text = container.innerText || "";
  }

  // remove all ↵ for safari
  text = text.replace(/\n/gi, "");

  return text;
}

/**
 *
 * @param {string} text
 * @return {string}
 */
function convertEmojiToImage(text: string) {
  text = handleEmoji(text);
  text = renderToString(emoji(text));
  text = text.replace(
    new RegExp("&lt;span class=&quot;message-emoji&quot;&gt;", "g"),
    '<span class="message-emoji">'
  );
  text = text.replace(new RegExp("&lt;/span&gt;", "g"), "</span>");

  return text;
}

/**
 *
 * @param {string} text
 * @return {string}
 */
function handleEmoji(text: string) {
  return text.replace(EMOJI_REGEX, '<span class="message-emoji">$&</span>');
}
