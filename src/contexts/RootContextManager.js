/**
 * this is he manager(actually the Hub) for all aspects of the sn-table
 * this manager will cover:
 *  1. selection
 *  2. scroll
 *  3. focus
 *  4. a11y
 *  5. pagination
 *  6. utils as well
 * @returns contextValueObj
 */
export const RootContextManager = (props) => {
  return {
    nebulaProps: props,
  };
};
