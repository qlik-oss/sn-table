import { SN_TABLE_EVENT_TYPES, ASSERTIVE_PRESSURE, uniqHash } from './constants';

export const emitAnnouncement = ({
  politness = ASSERTIVE_PRESSURE.POLITE,
  shouldBeAtomic = false,
  shouldBubble = true,
  message = '',
} = {}) => {
  const announcementEvent = new CustomEvent(SN_TABLE_EVENT_TYPES.EMIT_ANNOUNCEMENT, {
    bubbles: shouldBubble,
    detail: {
      politness,
      shouldBeAtomic,
      message: addJunkCharIfNeeded(message),
    },
  });

  document.activeElement.dispatchEvent(announcementEvent);
};

const addJunkCharBase = () => {
  let hasJunkChar = 0;

  // Junk char addition
  return (message) => {
    if (hasJunkChar % 2) message += ` ­`;
    hasJunkChar++;

    return message;
  };
};

const addJunkCharIfNeeded = addJunkCharBase();
