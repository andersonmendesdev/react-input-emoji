import EmojiPicker from "./emoji-picker";

/**
 * @typedef {object} Props
 * @property {boolean} showPicker
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {(emoji: import("../types/types").EmojiMartItem) => void} handleSelectEmoji
 * @property {boolean} disableRecent
 * @property {any[]=} customEmojis
 * @property {('above' | 'below')=} position
 * @property {import('../types/types').Languages=} language
 */

/**
 * Emoji Picker Button Component
 * @param {Props} props
 * @return {TSX.Element}
 */
interface EmojiPickerContainerProps {
  showPicker: boolean;
  theme: "light" | "dark" | "auto";
  handleSelectEmoji: (emoji: import("../types/types").EmojiMartItem) => void;
  disableRecent: boolean;
  customEmojis?: any[];
  position?: "above" | "below";
  language?: import("../types/types").Languages;
}

function EmojiPickerContainer({
  showPicker,
  theme,
  handleSelectEmoji,
  disableRecent,
  customEmojis,
  position,
  language
}: EmojiPickerContainerProps) {
  return (
    <div className="react-emoji-picker--container">
      {showPicker && (
        <div
          className="react-emoji-picker--wrapper"
          onClick={evt => evt.stopPropagation()}
          style={position === "below" ? { top: "40px" } : {}}
        >
          <div className="react-emoji-picker">
            <EmojiPicker
              theme={theme}
              onSelectEmoji={handleSelectEmoji}
              disableRecent={disableRecent}
              customEmojis={customEmojis}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPickerContainer;
