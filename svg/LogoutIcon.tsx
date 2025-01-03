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
      opacity={0.4}
      d="M12.5133 6.15792V5.38042C12.5133 3.68459 11.1383 2.30959 9.4425 2.30959H5.38C3.685 2.30959 2.31 3.68459 2.31 5.38042V14.6554C2.31 16.3513 3.685 17.7263 5.38 17.7263H9.45083C11.1417 17.7263 12.5133 16.3554 12.5133 14.6646V13.8788"
      stroke="#4f24d8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.1746 10.0178H8.14044"
      stroke="#4f24d8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.7343 7.58856L18.1743 10.0177L15.7343 12.4477"
      stroke="#4f24d8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
