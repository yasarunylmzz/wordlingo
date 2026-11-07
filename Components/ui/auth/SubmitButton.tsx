import React, { ReactNode } from "react";
import PrimaryButton from "../PrimaryButton";

type Props = {
  loading: boolean;
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
};

export default function SubmitButton({
  loading,
  children,
  onPress,
  disabled,
}: Props) {
  return (
    <PrimaryButton
      label={typeof children === "string" ? children : String(children)}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
    />
  );
}
