import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props: any) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17.8188 9.58521C17.8188 9.58521 14.6088 13.4382 12.2608 13.4382C9.91385 13.4382 6.66785 9.58521 6.66785 9.58521"
      stroke="#4f24d8"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.25 21.6517C5.10695 21.6517 2.72595 19.3717 2.72595 12.5347C2.72595 5.69672 5.10695 3.41772 12.25 3.41772C19.393 3.41772 21.774 5.69672 21.774 12.5347C21.774 17.9127 20.301 20.4707 16.197 21.3177"
      stroke="#4f24d8"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
