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
      d="M16.4709 9.40335V7.25435C16.4399 4.73535 14.3719 2.71935 11.8539 2.75035C9.38685 2.78135 7.39185 4.76735 7.34985 7.23435V9.40335"
      stroke="#A4A4A6"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9102 14.1562V16.3772"
      stroke="#A4A4A6"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.9102 8.82422C6.16524 8.82422 4.25024 10.3922 4.25024 15.0952C4.25024 19.7992 6.16524 21.3672 11.9102 21.3672C17.6552 21.3672 19.5712 19.7992 19.5712 15.0952C19.5712 10.3922 17.6552 8.82422 11.9102 8.82422Z"
      stroke="#A4A4A6"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
