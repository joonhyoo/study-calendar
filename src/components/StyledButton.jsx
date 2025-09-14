import React from 'react';

export const StyledButton = ({ onClick, content }) => {
  return (
    <button
      className="hover:cursor-pointer hover:brightness-75 px-[16px]"
      onClick={onClick}
    >
      {content}
    </button>
  );
};
