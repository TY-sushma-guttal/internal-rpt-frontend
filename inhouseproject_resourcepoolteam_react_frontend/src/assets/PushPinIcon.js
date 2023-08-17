import React from "react";

const PushPinIcon = ({ onClick, className, fill }) => {
  return (
    <svg
      id="Component_14_2"
      data-name="Component 14 – 2"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 28 28"
      onClick={onClick}
      className={className}
      fill={fill}
    >
      <rect
        id="Rectangle_16"
        data-name="Rectangle 16"
        width="25"
        height="25"
        rx="4"
        opacity="0"
      />
      <path
        id="Icon_metro-pin"
        data-name="Icon metro-pin"
        d="M21.482,18.764l-7.958-4.23a2.14,2.14,0,0,0-2.789.687,1.8,1.8,0,0,0,.747,2.568l7.957,4.23a2.139,2.139,0,0,0,2.789-.688,1.8,1.8,0,0,0-.746-2.567Zm-6.563-4.574,6.189,3.29,2.105-5.393L18.94,9.817l-4.021,4.374ZM10.356,28.045l5.921-6.621-2.653-1.41-3.268,8.03ZM25.771,9.105l-5.3-2.82a1.6,1.6,0,0,0-2.092.516,1.35,1.35,0,0,0,.561,1.926l5.305,2.82a1.6,1.6,0,0,0,2.092-.516A1.35,1.35,0,0,0,25.771,9.105Z"
        transform="translate(-4.445 -3.07)"
      />
    </svg>
  );
};

export default PushPinIcon;
