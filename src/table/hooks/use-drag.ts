import { useState } from 'react';

const useDrag = () => {
  const [engagedColumn, setEngagedColumn] = useState(undefined);

  return [engagedColumn, setEngagedColumn];
};

export default useDrag;
