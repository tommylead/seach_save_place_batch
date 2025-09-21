import React from 'react';

export const Spinner: React.FC = () => {
  // FIX: Using a more robust spinner implementation that inherits color from its parent.
  // The border color is set to the current text color, and the top border is made transparent
  // to create the classic spinning ring effect.
  return (
    <div 
        className="animate-spin rounded-full h-5 w-5 border-2" 
        style={{borderColor: 'currentColor', borderTopColor: 'transparent'}}
    ></div>
  );
};
