import React, { SVGProps } from "react";

interface XMarkIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  height?: number;
  width?: number;
}

const XMarkIcon = ({size, height, width, ...props}: XMarkIconProps) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    width={width || 6}
    height={height || 6}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
  )
}

export default XMarkIcon