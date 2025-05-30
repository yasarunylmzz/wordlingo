import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props: any) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M3 4.5H13C14.1046 4.5 15 5.39543 15 6.5V9.5C15 10.6046 14.1046 11.5 13 11.5H3C1.89543 11.5 1 10.6046 1 9.5V6.5C1 5.39543 1.89543 4.5 3 4.5ZM3 5.5C2.44772 5.5 2 5.94772 2 6.5V9.5C2 10.0523 2.44772 10.5 3 10.5H13C13.5523 10.5 14 10.0523 14 9.5V6.5C14 5.94772 13.5523 5.5 13 5.5H3Z"
      fill="white"
    />
    <Path
      d="M1 2C1 1.72386 1.22386 1.5 1.5 1.5H14.5C14.7761 1.5 15 1.72386 15 2C15 2.27614 14.7761 2.5 14.5 2.5H1.5C1.22386 2.5 1 2.27614 1 2Z"
      fill="white"
    />
    <Path
      d="M1 14C1 13.7239 1.22386 13.5 1.5 13.5H14.5C14.7761 13.5 15 13.7239 15 14C15 14.2761 14.7761 14.5 14.5 14.5H1.5C1.22386 14.5 1 14.2761 1 14Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
