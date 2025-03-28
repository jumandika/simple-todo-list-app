import { color } from "@/assets/colors";
import { Pressable, ViewStyle } from "react-native";
import MyText from "./MyText";
import { useMemo } from "react";
import { TouchableOpacity } from "react-native";

interface CardProps {
    onPress?: () => void;
    label?: string;
    style?: ViewStyle | ViewStyle[];
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
        <TouchableOpacity onPress={onPress} style={[cardStyle, style]}>
            {label &&
                <MyText fontWeight="medium" size="m" style={{ fontSize }} >
                    {label}
                </MyText>
            }
            {
                children
            }
        </TouchableOpacity>
    );
};

export default Card;