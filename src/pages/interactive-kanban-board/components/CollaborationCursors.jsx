import React from 'react';

const CollaborationCursors = ({ activeUsers }) => {
  return (
    <>
      {activeUsers?.map((user) => (
        <div
          key={user?.id}
          className="fixed pointer-events-none z-300 transition-all duration-150"
          style={{
            left: `${user?.cursorX}px`,
            top: `${user?.cursorY}px`
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3L19 12L12 13L9 20L5 3Z"
              fill={user?.color}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          <div
            className="absolute top-6 left-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-lg"
            style={{ backgroundColor: user?.color }}
          >
            {user?.name}
          </div>
        </div>
      ))}
    </>
  );
};

export default CollaborationCursors;