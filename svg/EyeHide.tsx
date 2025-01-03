import * as React from "react";
import Svg, { G, Path, Line } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title */
const SVGComponent = (props: any) => (
  <Svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <G
      id="Iconly/Light/Hide"
      stroke="none"
      strokeWidth={1.5}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <G
        id="Hide"
        transform="translate(2.000000, 3.500000)"
        stroke="#4f24d8"
        strokeWidth={1.5}
      >
        <Path
          d="M7.7606,10.8668 C7.1856,10.2928 6.8356,9.5128 6.8356,8.6378 C6.8356,6.8848 8.2476,5.4718 9.9996,5.4718 C10.8666,5.4718 11.6646,5.8228 12.2296,6.3968"
          id="Stroke-1"
        />
        <Path
          d="M13.1048,9.1989 C12.8728,10.4889 11.8568,11.5069 10.5678,11.7409"
          id="Stroke-3"
        />
        <Path
          d="M4.6546,13.9723 C3.0676,12.7263 1.7236,10.9063 0.7496,8.6373 C1.7336,6.3583 3.0866,4.5283 4.6836,3.2723 C6.2706,2.0163 8.1016,1.3343 9.9996,1.3343 C11.9086,1.3343 13.7386,2.0263 15.3356,3.2913"
          id="Stroke-5"
        />
        <Path
          d="M17.4476,5.4908 C18.1356,6.4048 18.7406,7.4598 19.2496,8.6368 C17.2826,13.1938 13.8066,15.9388 9.9996,15.9388 C9.1366,15.9388 8.2856,15.7988 7.4676,15.5258"
          id="Stroke-7"
        />
        <Line x1={17.887} y1={0.7496} x2={2.113} y2={16.5236} id="Stroke-9" />
      </G>
    </G>
  </Svg>
);
export default SVGComponent;
