import React from 'react';

// Minimal, Jarvis-like stroked icon set
// Usage: <Icon name="sun" size={20} className="text-yellow-500" />
const paths = {
  brand: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M8.25 15.75h7.5m-7.5 3H12M10.5 2.25H5.625A1.125 1.125 0 0 0 4.5 3.375v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
  ),
  menu: (<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />),
  sun: (
    <>
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
      <path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
    </>
  ),
  moon: (<path d="M17.293 13.293A8 8 0 0 1 6.707 2.707 8.001 8.001 0 1 0 17.293 13.293z" />),
  arrowLeft: (<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />),
  login: (<path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0 4-4m-4 4h14m-5 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v1" />),
  info: (<path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />),
  user: (<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75z" />),
  stats: (<path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16V8m5 8V5m5 11v-6" />),
  mail: (<path strokeLinecap="round" strokeLinejoin="round" d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25Zm.75.75L12 12.75 20.25 6" />),
  shield: (<path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25l7.5 3v6.75c0 5.25-3.75 8.25-7.5 9.75-3.75-1.5-7.5-4.5-7.5-9.75V5.25l7.5-3z" />),
  device: (<path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 18h6" />),
  star: (<path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />),
};

export default function Icon({ name = 'brand', size = 20, className = '', strokeWidth = 1.8, title }) {
  const d = paths[name];
  if (!d) return <span title={title} className={className}>❔</span>;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {d}
    </svg>
  );
}
