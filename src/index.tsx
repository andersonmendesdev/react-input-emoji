// @ts-check
// vendors
import { useEffect, useRef, forwardRef, useCallback } from "react";

// css
import "./styles.css";

// utils
import { replaceAllTextEmojis } from "./utils/emoji-utils";
import {
  handleCopy,
  handlePaste,
  totalCharacters
} from "./utils/input-event-utils";

// hooks
import { useExpose } from "./hooks/use-expose";
import { useEmit } from "./hooks/use-emit";

// components
import TextInput, { TextInputRef } from "./text-input";
import EmojiPickerWrapper from "./components/emoji-picker-wrapper";
import MentionWrapper from "./components/mention-wrapper";
import { useEventListeners } from "./hooks/use-event-listeners";
import { useSanitize } from "./hooks/use-sanitize";
import { usePollute } from "./hooks/user-pollute";
import { MentionUser } from "./types/types";

/**
 * @typedef {import('./types/types').MentionUser} MetionUser
 */

/**
 * @typedef {import('./types/types').ListenerObj<any>} ListenerObj
 */

/**
 * @typedef {object} Props
 * @property {string} value
 * @property {(value: string) => void} onChange
 * @property {"light" | "dark" | "auto"=} theme
 * @property {boolean=} cleanOnEnter
 * @property {(text: string) => void=} onEnter
 * @property {string=} placeholder
 * @property {string=} placeholderColor
 * @property {string=} color
 * @property {(size: {width: number, height: number}) => void=} onResize
 * @property {() => void=} onClick
 * @property {() => void=} onFocus
 * @property {() => void=} onBlur
 * @property {boolean} shouldReturn
 * @property {number=} maxLength
 * @property {boolean=} keepOpened
 * @property {(event: KeyboardEvent) => void=} onKeyDown
 * @property {string=} inputClass
 * @property {boolean=} disableRecent
 * @property {number=} tabIndex
 * @property {number=} height
 * @property {number=} borderRadius
 * @property {string=} borderColor
 * @property {number=} fontSize
 * @property {string=} fontFamily
 * @property {string=} background
 * @property {{id: string; name: string; emojis: {id: string; name: string; keywords: string[], skins: {src: string}[]}}[]=} customEmojis
 * @property {import('./types/types').Languages=} language
 * @property {(text: string) => Promise<MentionUser[]>=} searchMention
 * @property {HTMLDivElement=} buttonElement
 * @property {React.MutableRefObject=} buttonRef
 * @property {boolean} shouldConvertEmojiToImage
 */

/**
 * Input Emoji Component
 * @param {Props} props
 * @param {React.Ref<any>} ref
 * @return {JSX.Element}
 */

interface InputEmojiProps {
  value: string;
  onChange: (value: string) => void;
  theme?: "light" | "dark" | "auto";
  cleanOnEnter?: boolean;
  onEnter?: (text: string) => void;
  placeholder?: string;
  placeholderColor?: string;
  color?: string;
  onResize?: (size: { width: number; height: number }) => void;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  shouldReturn: boolean;
  maxLength?: number;
  keepOpened?: boolean;
  onKeyDown?: (event: KeyboardEvent) => void;
  inputClass?: string;
  disableRecent?: boolean;
  tabIndex?: number;
  height?: number;
  borderRadius?: number;
  borderColor?: string;
  fontSize?: number;
  fontFamily?: string;
  background?: string;
  customEmojis?: {
    id: string;
    name: string;
    emojis: {
      id: string;
      name: string;
      keywords: string[];
      skins: { src: string }[];
    }[];
  }[];
  language?: import("./types/types").Languages;
  searchMention?: (text: string) => Promise<MentionUser[]>;
  buttonElement?: HTMLDivElement;
  buttonRef?: React.MutableRefObject<HTMLButtonElement>;
  shouldConvertEmojiToImage: boolean;
}

const InputEmoji = forwardRef<HTMLDivElement, InputEmojiProps>((props, ref) => {
  const {
    value,
    onChange,
    theme = "auto",
    cleanOnEnter = false,
    onEnter,
    placeholder = "Type a message",
    placeholderColor,
    color = "black",
    onResize,
    onClick,
    onFocus,
    onBlur,
    shouldReturn = false,
    maxLength,
    keepOpened = false,
    onKeyDown,
    inputClass,
    disableRecent = false,
    tabIndex = 0,
    height = 30,
    borderRadius = 21,
    borderColor = "#EAEAEA",
    fontSize = 15,
    fontFamily = "sans-serif",
    background = "white",
    customEmojis = [],
    language,
    searchMention,
    buttonElement,
    buttonRef,
    shouldConvertEmojiToImage = false
  } = props;

  const textInputRef = useRef<TextInputRef>(null);
  const { addEventListener, listeners } = useEventListeners();
  const { addSanitizeFn, sanitize, sanitizedTextRef } = useSanitize(
    shouldReturn,
    shouldConvertEmojiToImage
  );
  const { addPolluteFn, pollute } = usePollute();

  const updateHTML = useCallback(
    (nextValue = "") => {
      if (!textInputRef.current) return;
      textInputRef.current.html = replaceAllTextEmojis(nextValue);
      sanitizedTextRef.current = nextValue;
    },
    [sanitizedTextRef]
  );

  const setValue = useCallback(
    (value: string) => {
      updateHTML(value);
    },
    [updateHTML]
  );

  const emitChange = useEmit(textInputRef, onResize, onChange);

  useExpose({
    ref,
    setValue,
    textInputRef,
    emitChange,
    shouldConvertEmojiToImage
  });

  useEffect(() => {
    if (sanitizedTextRef.current !== value) {
      setValue(value);
    }
  }, [sanitizedTextRef, setValue, value]);

  const handleKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        maxLength !== undefined &&
        event.key !== "Backspace" &&
        textInputRef.current &&
        totalCharacters(textInputRef.current) >= maxLength
      ) {
        event.preventDefault();
      }

      if (event.key === "Enter" && textInputRef.current) {
        event.preventDefault();
        const text = sanitize(textInputRef.current.html);
        emitChange(sanitizedTextRef.current);

        if (onEnter && listeners.enter.currentListerners.length === 0) {
          onEnter(text);
        }

        if (cleanOnEnter && listeners.enter.currentListerners.length === 0) {
          updateHTML("");
        }

        if (onKeyDown) {
          onKeyDown(event.nativeEvent);
        }

        return false;
      }

      if (onKeyDown) {
        onKeyDown(event.nativeEvent);
      }

      return true;
    },
    [
      cleanOnEnter,
      emitChange,
      listeners.enter.currentListerners.length,
      maxLength,
      onEnter,
      onKeyDown,
      sanitize,
      sanitizedTextRef,
      updateHTML
    ]
  );

  useEffect(() => {
    const unsubscribe = addEventListener("keyDown", handleKeydown);
    return () => unsubscribe();
  }, [addEventListener, handleKeydown]);

  return (
    <div className="react-emoji">
      <MentionWrapper
        searchMention={searchMention}
        addEventListener={addEventListener}
        appendContent={(html: string) => {
          if (
            maxLength !== undefined &&
            textInputRef.current &&
            totalCharacters(textInputRef.current) >= maxLength
          ) {
            return;
          }

          textInputRef.current?.appendContent(html);
        }}
        addSanitizeFn={addSanitizeFn}
      />
      <TextInput
        ref={textInputRef}
        onCopy={handleCopy}
        onPaste={handlePaste}
        shouldReturn={shouldReturn}
        placeholder={placeholder}
        style={{
          borderRadius,
          borderColor,
          fontSize,
          fontFamily,
          background,
          placeholderColor,
          color
        }}
        tabIndex={tabIndex}
        className={inputClass}
        onChange={(html: string) => {
          sanitize(html);
          emitChange(sanitizedTextRef.current);
        }}
        onBlur={listeners.blur.publish}
        onFocus={listeners.focus.publish}
        onArrowUp={listeners.arrowUp.publish}
        onArrowDown={listeners.arrowDown.publish}
        onKeyUp={listeners.keyUp.publish}
        onKeyDown={listeners.keyDown.publish}
        onEnter={listeners.enter.publish}
        onClick={onClick}
      />
      <EmojiPickerWrapper
        theme={theme}
        keepOpened={keepOpened}
        disableRecent={disableRecent}
        customEmojis={customEmojis}
        addSanitizeFn={addSanitizeFn}
        addPolluteFn={addPolluteFn}
        appendContent={(html: string) =>
          textInputRef.current?.appendContent(html)
        }
        buttonElement={buttonElement}
        buttonRef={buttonRef}
        language={language}
      />
    </div>
  );
});

export default InputEmoji;
