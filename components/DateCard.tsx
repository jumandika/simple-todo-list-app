

import { color } from "@/assets/colors";
import { Days } from "@/constant/StaticData";
import { useEffect, useMemo, useState } from "react";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";
import MyText from "./MyText";
import Spacer from "./Spacer";
import { formatDateDDMMYYYY } from "@/utils/formatter";

interface DateCardProps {
    onPress?: () => void;
    item?: any;
    index?: number;
    style?: ViewStyle;
    selected?: string;
}

const DateCard = ({ onPress, item, index, style, selected }: DateCardProps) => {
    const [today, setToday] = useState<string>('')
    const [isSelected, setIsSelected] = useState<string>(selected || '')
    const currentSelected = isSelected === item.fullDate;
    const isToday = today === item.fullDate;

    useEffect(() => {
        const today = new Date();
        setToday(formatDateDDMMYYYY(today))
        setIsSelected(formatDateDDMMYYYY(today))
    }, [])

    useEffect(() => {
        if (selected) setIsSelected(selected)
    }, [selected])

    const dateCardStyle = useMemo<ViewStyle>(
        () => ({
            alignItems: 'center',
            backgroundColor: currentSelected ? color.secondaryLight : color.white,
            borderColor: currentSelected ? color.secondary : '#EEE',
            paddingTop: 6,
            paddingBottom: 6,
            paddingHorizontal: 14,
            borderRadius: 8,
            minWidth: 60,
            borderWidth: 1.6,
        }),
        [currentSelected]
    );

    const dayStyle = useMemo<TextStyle>(
        () => ({
            color: item.isWeekend ? color.red : color.text,
            opacity: currentSelected ? 1 : 0.4,
        }),
        [currentSelected]
    );
    const dateStyle = useMemo<TextStyle>(
        () => ({
            color: item.isWeekend ? color.red : color.darkGray,
            opacity: currentSelected ? 1 : 0.4
        }),
        [currentSelected]
    );

    const signStyle = useMemo<ViewStyle>(
        () => ({
            backgroundColor: currentSelected ? color.secondary : isToday ? color.green : color.gray,
            alignSelf: 'center',
            borderRadius: 6,
            height: 10,
            width: 15
        }),
        [currentSelected, isToday]
    );

    return (
        <Pressable
            key={index?.toString()}
            onPress={onPress}
            style={[dateCardStyle, style]}
        >
            <View style={signStyle} />
            <Spacer height={6} />
            <MyText style={dayStyle} size='s' fontWeight='medium'>{item?.day}</MyText>
            <MyText style={dateStyle} size='xl' fontWeight='semiBold'  >{item?.date}</MyText>
        </Pressable>
    );
};

export default DateCard;
