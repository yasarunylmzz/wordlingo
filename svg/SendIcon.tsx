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
      d="M18.07 8.51001L9.51002 4.23001C3.76002 1.35001 1.40002 3.71001 4.28002 9.46001L5.15002 11.2C5.40002 11.71 5.40002 12.3 5.15002 12.81L4.28002 14.54C1.40002 20.29 3.75002 22.65 9.51002 19.77L18.07 15.49C21.91 13.57 21.91 10.43 18.07 8.51001ZM14.84 12.75H9.44002C9.03002 12.75 8.69002 12.41 8.69002 12C8.69002 11.59 9.03002 11.25 9.44002 11.25H14.84C15.25 11.25 15.59 11.59 15.59 12C15.59 12.41 15.25 12.75 14.84 12.75Z"
      fill="#386BF6"
    />
  </Svg>
);
export default SVGComponent;
