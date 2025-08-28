import React from 'react';

export const ChipIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    color="var(--primary-color)"
  >
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
    <rect x="7" y="7" width="10" height="10" rx="1" ry="1"></rect>
    <line x1="2" y1="12" x2="7" y2="12"></line>
    <line x1="17" y1="12" x2="22" y2="12"></line>
    <line x1="12" y1="2" x2="12" y2="7"></line>
    <line x1="12" y1="17" x2="12" y2="22"></line>
  </svg>
);
