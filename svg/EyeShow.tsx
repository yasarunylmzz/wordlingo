import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props: any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.1642 12.0521C15.1642 13.7981 13.7482 15.2141 12.0022 15.2141C10.2562 15.2141 8.84021 13.7981 8.84021 12.0521C8.84021 10.3051 10.2562 8.89014 12.0022 8.89014C13.7482 8.89014 15.1642 10.3051 15.1642 12.0521Z"
      stroke="#4f24d8"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.75024 12.0521C2.75024 15.3321 6.89224 19.3541 12.0022 19.3541C17.1112 19.3541 21.2542 15.3351 21.2542 12.0521C21.2542 8.76912 17.1112 4.75012 12.0022 4.75012C6.89224 4.75012 2.75024 8.77212 2.75024 12.0521Z"
      stroke="#4f24d8"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
