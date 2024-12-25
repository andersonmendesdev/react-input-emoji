import { useImperativeHandle, forwardRef, useRef, useMemo } from "react";
import {
  addLineBreak,
  handlePasteHtmlAtCaret
} from "./utils/input-event-utils";
import { replaceAllTextEmojiToString } from "./utils/emoji-utils";

/**
 * @typedef {Object} Props
 * @property {(event: React.KeyboardEvent) => void} onKeyDown
 * @property {(event: React.KeyboardEvent) => void} onKeyUp
 * @property {() => void} onFocus
 * @property {() => void} onBlur
 * @property {(sanitizedText: string) => void=} onChange
 * @property {(event: React.KeyboardEvent) => void} onArrowUp
 * @property {(event: React.KeyboardEvent) => void} onArrowDown
 * @property {(event: React.KeyboardEvent) => void} onEnter
 * @property {boolean} shouldReturn
 * @property {(event: React.ClipboardEvent) => void} onCopy
 * @property {(event: React.ClipboardEvent) => void} onPaste
 * @property {string} placeholder
 * @property {{borderRadius?: number; color?: string; borderColor?: string; fontSize?: number; fontFamily?: string; background: string; placeholderColor?: string;}} style
 * @property {number} tabIndex
 * @property {string} className
 * @property {(html: string) => void} onChange
 */

/**
 * @typedef {{
 *  appendContent: (html: string) => void;
 *  html: string;
 *  text: string;
 *  size: { width: number; height: number;};
 *  focus: () => void;
 * }} Ref
 */

// eslint-disable-next-line valid-jsdoc
/** @type {React.ForwardRefRenderFunction<Ref, Props>} */

interface TextInputProps {
  onKeyDown: (event: React.KeyboardEvent) => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  onFocus: (event: React.MouseEvent<HTMLDivElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => void;
  onChange: (sanitizedText: string) => void;
  onArrowUp: (event: React.KeyboardEvent) => void;
  onArrowDown: (event: React.KeyboardEvent) => void;
  onEnter: (event: React.KeyboardEvent) => void;
  shouldReturn: boolean;
  onCopy: (event: React.ClipboardEvent) => void;
  onPaste: (event: React.ClipboardEvent) => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  placeholder: string;
  style: {
    borderRadius?: number;
    color?: string;
    borderColor?: string;
    fontSize?: number;
    fontFamily?: string;
    background: string;
    placeholderColor?: string;
  };
  tabIndex: number;
  className: string;
}
export interface TextInputRef {
  appendContent: (html: string) => void;
  html: string;
  text: string;
  size: { width: number; height: number };
  focus: () => void;
}

const TextInput = forwardRef<TextInputRef, TextInputProps>(
  (
    {
      placeholder,
      style,
      tabIndex,
      className,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onArrowUp,
      onArrowDown,
      onEnter,
      onCopy,
      onPaste,
      onClick,
      shouldReturn
    },
    ref
  ) => {
    const placeholderRef = useRef<HTMLDivElement | null>(null);
    const textInputRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
      appendContent: (html: string) => {
        if (textInputRef.current) {
          textInputRef.current.focus();
          textInputRef.current.innerHTML = html;

          if (placeholderRef.current) {
            const text = replaceAllTextEmojiToString(html);
            placeholderRef.current.style.visibility =
              text === "" ? "visible" : "hidden";
          }

          if (typeof onChange === "function") {
            onChange(html);
          }
        }
      },
      get html() {
        return textInputRef.current?.innerHTML || "";
      },
      get text() {
        return textInputRef.current?.innerText || "";
      },
      get size() {
        return {
          width: textInputRef.current?.offsetWidth || 0,
          height: textInputRef.current?.offsetHeight || 0
        };
      },
      focus: () => {
        textInputRef.current?.focus();
      }
    }));

    const placeholderStyle = useMemo(() => {
      return style.placeholderColor ? { color: style.placeholderColor } : {};
    }, [style.placeholderColor]);

    const inputStyle = useMemo(() => {
      return style.color ? { color: style.color } : {};
    }, [style.color]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        (event.shiftKey || event.ctrlKey) &&
        shouldReturn
      ) {
        event.preventDefault();
        addLineBreak();
        return;
      }

      switch (event.key) {
        case "Enter":
          onEnter(event);
          break;
        case "ArrowUp":
          onArrowUp(event);
          break;
        case "ArrowDown":
          onArrowDown(event);
          break;
        default:
          placeholderRef.current &&
            (placeholderRef.current.style.visibility = "hidden");
      }

      onKeyDown(event);
    };

    const handleKeyUp = (event: React.KeyboardEvent) => {
      onKeyUp(event);

      const input = textInputRef.current;
      if (input && placeholderRef.current) {
        const text = replaceAllTextEmojiToString(input.innerHTML);
        placeholderRef.current.style.visibility =
          text === "" ? "visible" : "hidden";
      }

      onChange(input?.innerHTML || "");
    };

    return (
      <div className="react-input-emoji--container" style={style}>
        <div className="react-input-emoji--wrapper" onClick={onFocus}>
          <div
            ref={placeholderRef}
            className="react-input-emoji--placeholder"
            style={placeholderStyle}
          >
            {placeholder}
          </div>
          <div
            ref={textInputRef}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            tabIndex={tabIndex}
            contentEditable
            className={`react-input-emoji--input${
              className ? ` ${className}` : ""
            }`}
            onBlur={onBlur}
            onCopy={onCopy}
            onPaste={onPaste}
            onClick={onClick}
            style={inputStyle}
            data-testid="react-input-emoji--input"
          />
        </div>
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
