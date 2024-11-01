import * as React from "react";
import Svg, { Polygon } from "react-native-svg";
const SVGComponent = (props: any) => (
  <Svg
    width="36px"
    height="36px"
    viewBox="0 0 512 512"
    data-name="Layer 1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Polygon points="150.46 478 129.86 456.5 339.11 256 129.86 55.49 150.46 34 382.14 256 150.46 478" />
  </Svg>
);
export default SVGComponent;
