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
      d="M2.3932 9.66527C1.49903 6.8736 2.54403 3.68277 5.47487 2.7386C7.01653 2.2411 8.7182 2.53443 9.99987 3.4986C11.2124 2.5611 12.9765 2.24443 14.5165 2.7386C17.4474 3.68277 18.499 6.8736 17.6057 9.66527C16.214 14.0903 9.99987 17.4986 9.99987 17.4986C9.99987 17.4986 3.83153 14.1419 2.3932 9.66527Z"
      stroke="#4f24d8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      opacity={0.4}
      d="M13.3333 5.58331C14.225 5.87165 14.855 6.66748 14.9308 7.60165"
      stroke="#4f24d8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
