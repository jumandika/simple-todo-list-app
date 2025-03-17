import { color } from "@/assets/colors"
import { FC, useMemo } from "react"
import { TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native"
import MyText from "./MyText"

interface MyTextInputProps extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> {
    value: string | any
    onChangeText?: (value: string) => void
    placeholder?: string
    style?: ViewStyle
    textStyle?: TextStyle
    fontWeight?: 'regular' | 'medium' | 'bold' | 'semiBold' | 'italic'
    size?: 's' | 'm' | 'l' | 'xl' | 'xxl'
    errorMessage?: string
}

const MyTextInput: FC<MyTextInputProps> = ({ value, onChangeText, placeholder, style, textStyle, size = 'm', fontWeight = 'medium', errorMessage = '', ...rest }) => {
    const fontVariant = {
        'regular': 'Inter-Regular',
        'bold': 'Inter-Bold',
        'italic': 'Inter-Italic',
        'semiBold': 'Inter-SemiBold',
        'medium': 'Inter-Medium',
    }
    
    const fontSize = {
        's': 10,
        'm': 14,
        'l': 18,
        'xl': 22,
        'xxl': 36,
    }

    const cardStyle = useMemo<ViewStyle>(
        () => ({
            flex: 1,
            backgroundColor: color.gray,
            height: 55,
            justifyContent: 'center',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: color.gray,
            paddingHorizontal: 12
        }),
        []
    );
    const validStyle = useMemo<ViewStyle>(
        () => ({
            borderColor: color.primary,
            backgroundColor: color.primaryLight,
        }),
        [value]
    );
    const inValidStyle = useMemo<ViewStyle>(
        () => ({
            borderColor: color.red,
            backgroundColor: color.secondaryLight,
        }),
        [value]
    );
    return (
        <View>
            <View style={[cardStyle, value && validStyle, errorMessage && inValidStyle, style]}>
                <TextInput
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    style={{
                        color: color.text,
                        fontFamily: fontVariant[fontWeight],
                        fontSize: fontSize[size],
                        paddingVertical: 0,
                        ...textStyle
                    }}

                    {...rest}
                />
            </View>
            {
                errorMessage &&
                <MyText size='s' fontColor={color.red}>{errorMessage.toString() || ''}</MyText>
            }
        </View>
    )
}

export default MyTextInput