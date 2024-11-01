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
      d="M13.6862 7.87312V6.08396C13.6862 3.98979 11.9878 2.29146 9.89366 2.29146C7.79949 2.28229 6.09449 3.97229 6.08533 6.06729V6.08396V7.87312"
      stroke="#0601B4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.0693 17.7079H6.70181C4.95681 17.7079 3.54181 16.2938 3.54181 14.5479V10.9738C3.54181 9.22794 4.95681 7.81377 6.70181 7.81377H13.0693C14.8143 7.81377 16.2293 9.22794 16.2293 10.9738V14.5479C16.2293 16.2938 14.8143 17.7079 13.0693 17.7079Z"
      stroke="#0601B4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.88572 11.8355V13.6863"
      stroke="#0601B4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
