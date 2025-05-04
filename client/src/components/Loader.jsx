import React from 'react';

const Loader = ({ width = 'w-10', height = 'h-10', color = '#db810b' }) => (
  <svg
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`animate-spin ${width} ${height} fill-current shrink-0`}
  >
    <path
      d="M14.5 2.41699V7.25033"
      stroke={color}
      strokeWidth="2.55882"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 21.749V26.5824"
      stroke={color}
      strokeWidth="2.55882"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.95703 5.95703L9.37662 9.37662"
      stroke={color}
      strokeWidth="1.58955"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.623 19.6211L23.0426 23.0407"
      stroke={color}
      strokeWidth="1.58955"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.41699 14.5H7.25033"
      stroke={color}
      strokeWidth="1.58955"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.749 14.5H26.5824"
      stroke={color}
      strokeWidth="1.58955"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.95703 23.0407L9.37662 19.6211"
      stroke={color}
      strokeWidth="1.58955"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.623 9.37662L23.0426 5.95703"
      stroke={color}
      strokeWidth="1.58955"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Loader;
