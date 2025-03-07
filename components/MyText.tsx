import { color } from "@/assets/colors"
import React, { FC, ReactNode, useMemo } from "react"
import { Text, TextStyle } from "react-native"

interface MyTextProps {
    children: ReactNode
    style?: TextStyle
    fontColor?: string
    fontWeight?: 'regular' | 'medium' | 'bold' | 'semiBold' | 'italic'
    size?: 's' | 'm' | 'l' | 'xl' | 'xxl'
    strikeThrough?: boolean
}

export const fontVariant = {
    'regular': 'Inter-Regular',
    'bold': 'Inter-Bold',
    'italic': 'Inter-Italic',
    'semiBold': 'Inter-SemiBold',
    'medium': 'Inter-Medium',
}
export const fontSize = {
    's': 10,
    'm': 14,
    'l': 18,
    'xl': 22,
    'xxl': 36,
}

const MyText: FC<MyTextProps> = ({ children, fontColor, style, size = 'm', fontWeight = 'regular', strikeThrough = false }) => {

    const strikeThroughStyle = useMemo<TextStyle>(
        () => ({
            textDecorationStyle: 'solid',
            textDecorationLine: 'line-through',
        }),
        [strikeThrough]
    );

    return (
        <Text style={
            [{
                color: fontColor || color.text,
                fontFamily: fontVariant[fontWeight],
                fontSize: fontSize[size],
            },
            strikeThrough && strikeThroughStyle,
                style
            ]}
        >{children}</Text>
    )
}

export default MyText