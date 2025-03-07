import { color } from "@/assets/colors";
import { Pressable, ViewStyle } from "react-native";
import MyText from "./MyText";
import { useMemo } from "react";

interface CardProps {
    onPress?: () => void;
    label?: string;
    style?: ViewStyle;
    children?: React.ReactNode
    fontSize?: number;
}

const Card = ({ onPress, label, style, children, fontSize }: CardProps) => {
    const cardStyle = useMemo<ViewStyle>(
        () => ({
            backgroundColor: color.gray,
            minHeight: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            paddingHorizontal: 12
        }),
        []
    );

    return (
        <Pressable onPress={onPress} style={[cardStyle, style]}>
            {label &&
                <MyText fontWeight="medium" size="m" style={{ fontSize }} >
                    {label}
                </MyText>
            }
            {
                children
            }
        </Pressable>
    );
};

export default Card;