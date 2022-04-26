import React from 'react'

const Spinner = () => {
  return (
    <div>
       <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      className="lds-flickr"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
    >
      <circle cx="59.6" cy="50" r="18" fill="#ff7c81">
        <animate
          attributeName="cx"
          begin="-0.5s"
          calcMode="linear"
          dur="1"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          values="32;68;32"
        ></animate>
      </circle>
      <circle cx="40.4" cy="50" r="18" fill="#ffbd7f">
        <animate
          attributeName="cx"
          begin="0s"
          calcMode="linear"
          dur="1"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          values="32;68;32"
        ></animate>
      </circle>
      <circle cx="59.6" cy="50" r="18" fill="#ff7c81">
        <animate
          attributeName="cx"
          begin="-0.5s"
          calcMode="linear"
          dur="1"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          values="32;68;32"
        ></animate>
        <animate
          attributeName="fill-opacity"
          calcMode="discrete"
          dur="1s"
          keyTimes="0;0.499;0.5;1"
          repeatCount="indefinite"
          values="0;0;1;1"
        ></animate>
      </circle>
    </svg>
    </div>
  )
}

export default Spinner