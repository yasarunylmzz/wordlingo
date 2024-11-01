import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const SVGComponent = (props: any) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G id="Iconly/Two-tone/Notification">
      <G id="Notification">
        <Path
          id="Stroke 1"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 14.873C14.6994 14.873 16.8734 14.2702 17.0834 11.8504C17.0834 9.43234 15.5676 9.58783 15.5676 6.62093C15.5676 4.30346 13.371 1.66667 10 1.66667C6.629 1.66667 4.43239 4.30346 4.43239 6.62093C4.43239 9.58783 2.91669 9.43234 2.91669 11.8504C3.12748 14.2793 5.3015 14.873 10 14.873Z"
          stroke="#0601B4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          id="Stroke 3"
          opacity={0.4}
          d="M11.9907 17.381C10.8539 18.6432 9.08058 18.6582 7.93292 17.381"
          stroke="#0601B4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </G>
  </Svg>
);
export default SVGComponent;
