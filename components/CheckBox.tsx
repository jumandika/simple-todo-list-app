import { color } from "@/assets/colors";
import { useMemo, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Ionicons from '@expo/vector-icons/Entypo';


interface CheckBoxProps {
    onPress?: () => void;
    style?: ViewStyle;
    checked?: boolean
}

const CheckBox = ({ onPress, checked = false, style }: CheckBoxProps) => {
    const [pressIn, setPressIn] = useState<boolean>(false)

    const checkBoxStyle = useMemo<ViewStyle>(
        () => ({
            backgroundColor: color.white,
            height: 25,
            width: 25,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 6,
            borderWidth: 1.6,
            borderColor: color.border
        }),
        []
    );

    const checkBoxCheckStyle = useMemo<ViewStyle>(
        () => ({
            backgroundColor: color.secondary,
            height: 25,
            width: 25,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 6,
            borderWidth: 1.6,
            borderColor: color.secondary
        }),
        []
    );

    const checkBoxHighlightStyle = useMemo<ViewStyle>(
        () => ({
            backgroundColor: color.secondary,
            top: -12.5,
            height: 50,
            width: 50,
            opacity: 0.2,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            position: 'absolute',
            alignSelf: 'center'
        }),
        []
    );

    const onPressIn = () => {
        setPressIn(true)
    }
    const onPressOut = () => {
        setPressIn(false)
    }

    return (
        <View >
            {
                pressIn &&
                <View style={[checkBoxHighlightStyle]} />
            }
            <Pressable
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={[checkBoxStyle, checked && checkBoxCheckStyle, style]}>
                {checked && <Ionicons name='check' size={18} color={color.white} />}
            </Pressable>
        </View>
    );
};

export default CheckBox;