import { color } from "@/assets/colors";
import { Pressable, ViewStyle } from "react-native";
import MyText from "./MyText";
import { useMemo } from "react";

interface MyButtonProps {
  onPress?: () => void;
  label: string;
  style?: ViewStyle;
}

const MyButton = ({ onPress, label, style }: MyButtonProps) => {
  const buttonStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: color.primary,
      height: 55,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
    }),
    []
  );

  return (
    <Pressable onPress={onPress} style={[buttonStyle, style]}>
      <MyText fontWeight="medium" size="l" style={{ color: color.white }}>
        {label}
      </MyText>
    </Pressable>
  );
};

export default MyButton;