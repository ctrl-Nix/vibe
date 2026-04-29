'use client';

import React from 'react';

export const OracleIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2.5" />
    <path d="M12 2V7" stroke="currentColor" strokeWidth="2.5" />
    <path d="M12 17V22" stroke="currentColor" strokeWidth="2.5" />
    <path d="M2 12H7" stroke="currentColor" strokeWidth="2.5" />
    <path d="M17 12H22" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export const PlotlineIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 18L8 12L14 18L22 6" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" />
    <rect x="1" y="17" width="2" height="2" fill="currentColor" />
    <rect x="7" y="11" width="2" height="2" fill="currentColor" />
    <rect x="13" y="17" width="2" height="2" fill="currentColor" />
    <rect x="21" y="5" width="2" height="2" fill="currentColor" />
  </svg>
);

export const JudgeIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2.5" />
    <rect x="8" y="8" width="8" height="8" fill="currentColor" />
    <path d="M2 2L6 6" stroke="currentColor" strokeWidth="2.5" />
    <path d="M18 18L22 22" stroke="currentColor" strokeWidth="2.5" />
    <path d="M22 2L18 6" stroke="currentColor" strokeWidth="2.5" />
    <path d="M6 18L2 22" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export const OptimizerIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L14.5 9.5H22L16 14.5L18.5 22L12 17L5.5 22L8 14.5L2 9.5H9.5L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="miter" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const KeyIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="9" cy="12" r="4" stroke="currentColor" strokeWidth="2.5" />
    <path d="M13 12H21V16H18V12H15V16H13V12Z" fill="currentColor" />
  </svg>
);

export const LockIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="5" y="11" width="14" height="10" stroke="currentColor" strokeWidth="2.5" />
    <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export const LinkIcon = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 17H7C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7H9" stroke="currentColor" strokeWidth="2.5" />
    <path d="M15 7H17C19.7614 7 22 9.23858 22 12C22 14.7614 19.7614 17 17 17H15" stroke="currentColor" strokeWidth="2.5" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);
