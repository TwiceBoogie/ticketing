import React, { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  height?: number;
  width?: number;
  stokeWidth?: number;
}

export const CartIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      height={size || height || 24}
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.25 22.5C17.2165 22.5 18 21.7165 18 20.75C18 19.7835 17.2165 19 16.25 19C15.2835 19 14.5 19.7835 14.5 20.75C14.5 21.7165 15.2835 22.5 16.25 22.5Z"
        fill="currentColor"
      />
      <path
        d="M8.25 22.5C9.2165 22.5 10 21.7165 10 20.75C10 19.7835 9.2165 19 8.25 19C7.2835 19 6.5 19.7835 6.5 20.75C6.5 21.7165 7.2835 22.5 8.25 22.5Z"
        fill="currentColor"
      />
      <path
        d="M4.84 3.94L4.64 6.39C4.6 6.86 4.97 7.25 5.44 7.25H20.75C21.17 7.25 21.52 6.93 21.55 6.51C21.68 4.74 20.33 3.3 18.56 3.3H6.27C6.17 2.86 5.97 2.44 5.66 2.09C5.16 1.56 4.46 1.25 3.74 1.25H2C1.59 1.25 1.25 1.59 1.25 2C1.25 2.41 1.59 2.75 2 2.75H3.74C4.05 2.75 4.34 2.88 4.55 3.1C4.76 3.33 4.86 3.63 4.84 3.94Z"
        fill="currentColor"
      />
      <path
        d="M20.5101 8.75H5.17005C4.75005 8.75 4.41005 9.07 4.37005 9.48L4.01005 13.83C3.87005 15.54 5.21005 17 6.92005 17H18.0401C19.5401 17 20.8601 15.77 20.9701 14.27L21.3001 9.6C21.3401 9.14 20.9801 8.75 20.5101 8.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({
  size,
  height,
  width,
  strokeWidth = 1.5,
  ...props
}: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height}
      role="presentation"
      viewBox="0 0 24 24"
      width={width}
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const FunnelIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      height={size || height || 24}
      width={size || width || 24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3z"
      />
    </svg>
  );
};

export const MinusIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      height={size || height || 24}
      width={size || width || 24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
  );
};

export const PlusIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      height={size || height || 24}
      width={size || width || 24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

export const Squares2X2Icon = ({
  size,
  height,
  width,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      height={size || height || 24}
      width={size || width || 24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25z"
      />
    </svg>
  );
};

export const NotificationIcon = ({
  size,
  height,
  width,
  ...props
}: IconProps) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const SearchIcon = ({
  strokeWidth = 1.5,
  width = 1,
  height = 1,
  ...props
}: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const XMarkIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};

export const Bars3Icon = ({ size, height, width, ...props }: IconProps) => {
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
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
};

export const MagnifyingGlassIcon = ({
  size,
  height,
  width,
  ...props
}: IconProps) => {
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
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
      />
    </svg>
  );
};

export const SpinnerIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
      height={height || 26}
      width={width || 26}
      className="text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      {...props}
    >
      <path
        fill="currentColor"
        d="M100 50.59c0 27.615-22.386 50.001-50 50.001s-50-22.386-50-50 22.386-50 50-50 50 22.386 50 50Zm-90.919 0c0 22.6 18.32 40.92 40.919 40.92 22.599 0 40.919-18.32 40.919-40.92 0-22.598-18.32-40.918-40.919-40.918-22.599 0-40.919 18.32-40.919 40.919Z"
      />
      <path
        fill="currentFill"
        d="M93.968 39.04c2.425-.636 3.894-3.128 3.04-5.486A50 50 0 0 0 41.735 1.279c-2.474.414-3.922 2.919-3.285 5.344.637 2.426 3.12 3.849 5.6 3.484a40.916 40.916 0 0 1 44.131 25.769c.902 2.34 3.361 3.802 5.787 3.165Z"
      />
    </svg>
  );
};

export const ChevronLeftIcon = ({
  size,
  height,
  width,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={width || 26}
      height={height || 26}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
};

export const ChevronRightIcon = ({
  size,
  height,
  width,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={width || 26}
      height={height || 26}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};

export const SunIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={size || height || 26}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width || 26}
      {...props}
    >
      <g fill="currentColor">
        <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
        <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
      </g>
    </svg>
  );
};

export const MoonIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={size || height || 26}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width || 26}
      {...props}
    >
      <path
        d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
        fill="currentColor"
      />
    </svg>
  );
};

export const BlurryBallIcon = ({
  size,
  height,
  width,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      {...props}
    >
      <defs>
        <radialGradient id="a">
          <stop offset="0%" stopColor="hsl(315, 100%, 72%)" />
          <stop offset="100%" stopColor="hsl(227, 100%, 50%)" />
        </radialGradient>
        <filter
          id="b"
          width="140%"
          height="140%"
          x="-20%"
          y="-20%"
          colorInterpolationFilters="sRGB"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feTurbulence
            width="100%"
            height="100%"
            x="0%"
            y="0%"
            baseFrequency="0.005 0.003"
            result="turbulence"
            seed={2}
            stitchTiles="stitch"
            type="fractalNoise"
          />
          <feGaussianBlur
            width="100%"
            height="100%"
            x="0%"
            y="0%"
            in="turbulence"
            result="blur"
            stdDeviation="20 0"
          />
          <feBlend
            width="100%"
            height="100%"
            x="0%"
            y="0%"
            in="SourceGraphic"
            in2="blur"
            mode="color-burn"
            result="blend"
          />
        </filter>
      </defs>
      <path fill="url(#a)" d="M0 0h700v700H0z" filter="url(#b)" />
    </svg>
  );
};
export const BlurryBallIcon2 = ({
  size,
  height,
  width,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 700 700"
      width="100%" // Use percentage width and height to cover the screen
      height="100%"
      opacity="1"
    >
      <defs>
        <linearGradient
          gradientTransform="rotate(150, 0.5, 0.5)"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          id="ffflux-gradient"
        >
          <stop
            stop-color="hsl(272, 99%, 54%)"
            stop-opacity="1"
            offset="0%"
          ></stop>
          <stop
            stop-color="hsl(259, 72%, 59%)"
            stop-opacity="1"
            offset="100%"
          ></stop>
        </linearGradient>
        <filter
          id="ffflux-filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.005"
            numOctaves="2"
            seed="2"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          ></feTurbulence>
          <feGaussianBlur
            stdDeviation="59 21"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="turbulence"
            edgeMode="duplicate"
            result="blur"
          ></feGaussianBlur>
          <feBlend
            mode="color-burn"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            in2="blur"
            result="blend"
          ></feBlend>
        </filter>
      </defs>
      <rect
        width="700"
        height="700"
        fill="url(#ffflux-gradient)"
        filter="url(#ffflux-filter)"
      ></rect>
    </svg>
  );
};
export const TriangleIcon = ({ size, height, width, ...props }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" {...props}>
      <defs>
        <filter
          id="a"
          width={width || 26}
          height={height || 26}
          x="-100%"
          y="-100%"
          colorInterpolationFilters="sRGB"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feGaussianBlur
            width={width || 26}
            height={height || 26}
            x="0%"
            y="0%"
            in="SourceGraphic"
            result="blur"
            stdDeviation="17 8"
          />
        </filter>
        <filter
          id="b"
          width={width || 26}
          height={height || 26}
          x="-100%"
          y="-100%"
          colorInterpolationFilters="sRGB"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feGaussianBlur
            width={width || 26}
            height={height || 26}
            x="0%"
            y="0%"
            in="SourceGraphic"
            result="blur"
            stdDeviation="10 17"
          />
        </filter>
      </defs>
      <g fill="none" stroke="hsl(305, 77%, 40%)" strokeWidth={16}>
        <path d="M400 250 250 550h300z" filter="url(#a)" />
        <path d="M412 250 262 550h300z" filter="url(#b)" opacity={0.25} />
        <path d="M388 250 238 550h300z" filter="url(#b)" opacity={0.25} />
        <path d="M400 250 250 550h300z" />
      </g>
    </svg>
  );
};
