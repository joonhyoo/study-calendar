import React from 'react';

export const StyledButton = ({ onClick, content }) => {
  return (
    <button
      className="hover:cursor-pointer hover:brightness-75"
      onClick={onClick}
    >
      {content}
    </button>
  );
};
