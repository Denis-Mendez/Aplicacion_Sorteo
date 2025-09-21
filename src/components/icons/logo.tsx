import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 10V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V14C5.10457 14 6 13.1046 6 12C6 10.8954 5.10457 10 4 10Z"
        fill="hsl(var(--primary))"
      />
       <path d="M12 7v10" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
    </svg>
  );
}
