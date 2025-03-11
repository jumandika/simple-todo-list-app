import { color } from "@/assets/colors";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import DateCard from "./DateCard";
import Spacer from "./Spacer";

interface DateListProps {
    weekList: any;
    selectedDay: string;
    setSelectedDay: (val: string) => void;
}

const DateList = ({ weekList, selectedDay, setSelectedDay }: DateListProps) => {
    const [closeToEnd, setCloseToEnd] = useState<boolean>(false)
    const [gradientColors, setGradientColors] = useState<any>(["#FFFFFF30", "#FFFFFF"])

    useEffect(() => {
        setGradientColors(closeToEnd ? ["#FFFFFF30", "#FFFFFF"] : ["#FFFFFF", "#FFFFFF30"])
    }, [closeToEnd]);

    const isCloseToEnd = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
        const paddingRight = 20;
        return layoutMeasurement.width + contentOffset.x >=
            contentSize.width - paddingRight;
    };

    const isCloseToStart = ({ contentOffset }: NativeScrollEvent) => {
        const paddingLeft = 20;
        return contentOffset.x <= paddingLeft

    };

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isCloseToEnd(event.nativeEvent)) {
            setCloseToEnd(true)
            return
        }
        if (isCloseToStart(event.nativeEvent)) {
            setCloseToEnd(false)
            return
        }
    }, [])

    return (
        <View>
            <FlatList
                horizontal
                onScroll={onScroll}
                removeClippedSubviews
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                windowSize={2}
                updateCellsBatchingPeriod={100}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateCardContainer}
                data={weekList}
                ItemSeparatorComponent={() => <Spacer width={10} />}
                renderItem={({ item, index }) =>
                    <DateCard
                        onPress={() => {
                            setSelectedDay(item.fullDate)
                        }}
                        selected={selectedDay}
                        item={item}
                        index={index}
                    />
                }
            />
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0.8, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={{ position: 'absolute', justifyContent: 'center', height: '100%', width: 60, alignItems: closeToEnd ? 'flex-start' : 'flex-end', right: closeToEnd ? null : 0, left: closeToEnd ? 0 : null, }}>
                <Feather name={closeToEnd ? "chevron-left" : "chevron-right"} size={30} color={color.border} />
            </LinearGradient>
        </View>
    );
};


const styles = StyleSheet.create({
    dateCardContainer: {
        paddingHorizontal: 20,
    },

});


export default DateList;