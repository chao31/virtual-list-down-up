import React, { StrictMode } from 'react';

import { createRoot } from 'react-dom/client'
import './index.css'

import FixedSizeList from '../../../src/components/FixedSizeList';


const Index = () => {
  const rowHeight = React.useCallback(index => 25 + index * 2, []);
  return (
    <div className="my-list">
      <FixedSizeList
        height={150}
        itemCount={1000}
        itemSize={rowHeight}
        width={300}
      >
        {({ index, style }) => <div style={style}>Row {index}</div>}
      </FixedSizeList>
    </div>
  );
};


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Index />
  // </StrictMode>,
)
