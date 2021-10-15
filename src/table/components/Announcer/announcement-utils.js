import { SN_TABLE_EVENT_TYPES, ASSERTIVE_PRESSURE } from './constants';

export const emitAnnouncement = ({
  type = 'some section',
  announceType = ASSERTIVE_PRESSURE.ASSERTIVE,
  shouldBeAtomic = false,
  shouldBubble = true,
}) => {
  // TODO:
  //  - this function would create an announcment evt
  //  - dispatches this event
  const announcementEvent = new CustomEvent(SN_TABLE_EVENT_TYPES.EMIT_ANNOUNCEMENT, {
    bubbles: shouldBubble,
    detail: {
      affectedSection: type,
      // notation,  NOTATION SHOULD BE HANDLED IN handle announcement
      //  - this should only emit the event and it's type
      //  - announcer should handle that part
      announceType,
      shouldBeAtomic,
    },
  });

  document.dispatchEvent(announcementEvent);
};

// const getNotationBase = () => {
//   let hasJunkChar = 0;

//   return (notation) => {
//     if (hasJunkChar % 2) notation += ` ­`;
//     hasJunkChar++;

//     return notation;
//   };
// };
// const getNotation = getNotationBase();
