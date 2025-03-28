import { color } from '@/assets/colors';
import BottomAction from '@/components/BottomAction';
import DateList from '@/components/DateList';
import MyButton from '@/components/MyButton';
import MyText from '@/components/MyText';
import MyTextInput from '@/components/MyTextInput';
import Spacer from '@/components/Spacer';
import TaskList from '@/components/TaskList';
import { formatDateDDMMYYYY, getWeekWithNames } from '@/utils/formatter';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
    const [weekList, setWeekList] = useState<any>(null)
    const [selectedDay, setSelectedDay] = useState<string>('All Tasks')
    const [selectedDayTitle, setSelectedDayTitle] = useState<string>('')

    const { top } = useSafeAreaInsets()

    useEffect(() => {
        const alltasks = {
            fullDate: 'All Tasks',
            date: '',
            day: '',
            isWeekend: false,
        };
        setWeekList([alltasks, ...getWeekWithNames()])
    }, [])

    useEffect(() => {
        if (selectedDay) {
            const today = new Date();
            if (selectedDay == formatDateDDMMYYYY(today)) setSelectedDayTitle('Today')
            else {
                setSelectedDayTitle(selectedDay)
            }
            return;
        }
        setSelectedDayTitle('All Task')
    }, [selectedDay])


    return (
        <KeyboardAvoidingView
            behavior='height' style={[styles.container, { paddingTop: top }]}
        >
            <StatusBar hidden={false} barStyle={'dark-content'} />
            <View style={{ paddingHorizontal: 20 }}>
                <MyText fontWeight='semiBold' size='xxl'>{selectedDayTitle}</MyText>
            </View>
            <Spacer height={10} />
            <View style={{ flex: 1 }}>
                <DateList
                    weekList={weekList}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                />
                <Spacer height={20} />
                <TaskList selectedDay={selectedDay} />
            </View>
            <BottomAction>
                <Link href="/createToDo" asChild>
                    <Pressable style={{ flex: 1 }}>
                        <MyTextInput editable={false} placeholder="Write a task..." value={''} />
                    </Pressable>
                </Link>
                <Spacer width={10} />
                <Link href="/createToDo" asChild>
                    <MyButton style={styles.addButton} label='Add' />
                </Link>
            </BottomAction>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: color.white,
    },
    categoryText: {
        paddingLeft: 10,
    },
    createdDateContainer: {
        borderBottomLeftRadius: 10,
        marginBottom: -16,
        zIndex: 10,
        backgroundColor: color.white,
        alignSelf: 'flex-end',
        padding: 2,
        paddingHorizontal: 8,
        paddingRight: 20,
    },
    createdDateText: {
        fontSize: 8,
    },
    deleteButton: {
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginBottom: -20,
        marginRight: -6,
        zIndex: 10,
        backgroundColor: color.secondary,
        alignSelf: 'flex-end',
    },
    cardContainer: {
        borderWidth: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
        paddingLeft: 12,
    },
    overdueIndicator: {
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        top: -30,
        left: -30,
    },
    dateCardContainer: {
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    bottomInputContainer: {
        flex: 1,
    },
    addButton: {
        paddingHorizontal: 20,
    },
});
