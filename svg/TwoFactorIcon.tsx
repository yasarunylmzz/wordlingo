import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props: any) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.7209 4.26988C16.085 4.39738 16.3284 4.74071 16.3284 5.12655V10.7707C16.3284 12.3482 15.755 13.854 14.7425 15.0207C14.2334 15.6082 13.5892 16.0657 12.905 16.4357L9.94002 18.0374L6.97002 16.4349C6.28502 16.0649 5.64002 15.6082 5.13002 15.0199C4.11669 13.8532 3.54169 12.3465 3.54169 10.7674V5.12655C3.54169 4.74071 3.78502 4.39738 4.14919 4.26988L9.63419 2.34238C9.82919 2.27405 10.0417 2.27405 10.2359 2.34238L15.7209 4.26988Z"
      stroke="#4f24d8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      opacity={0.4}
      d="M7.7688 9.93152L9.34547 11.509L12.5938 8.26068"
      stroke="#4f24d8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
