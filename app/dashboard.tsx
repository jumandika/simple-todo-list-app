import { color } from '@/assets/colors';
import BottomAction from '@/components/BottomAction';
import Card from '@/components/Card';
import CheckBox from '@/components/CheckBox';
import DateCard from '@/components/DateCard';
import MyButton from '@/components/MyButton';
import MyText from '@/components/MyText';
import MyTextInput from '@/components/MyTextInput';
import Spacer from '@/components/Spacer';
import { ToDoItem } from '@/constant/interface';
import { formatDateDDMMYYYY, getWeekWithNames, sortAndGroupTasks, timeAgo } from '@/utils/formatter';
import { deleteTodo, loadTodos, saveTodos } from '@/utils/todoStorage';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, ListRenderItem, Pressable, StatusBar, StyleSheet, View } from 'react-native';

export default function DashboardScreen() {
    const [weekList, setWeekList] = useState<any>(null)
    const [selectedDay, setSelectedDay] = useState<string>('All Tasks')
    const [selectedDayTitle, setSelectedDayTitle] = useState<string>('')
    const [todos, setTodos] = useState<ToDoItem[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<ToDoItem[]>([]);

    useFocusEffect(useCallback(() => {
        if (selectedDay === "All Tasks") {
            getAllList()
        } else {
            getFilteredList()
        }
    }, [selectedDay]))


    const getAllList = async () => {
        await loadTodos().then((val) => {
            setTodos(sortAndGroupTasks(val))
            setFilteredTodos(sortAndGroupTasks(val));
        });
    }
    const getFilteredList = async () => {
        const val = await loadTodos();
        const filtered = val.filter((item) => formatDateDDMMYYYY(new Date(item.dueDate)) === selectedDay)
        setFilteredTodos(sortAndGroupTasks(filtered));
    }

    const handleDelete = async (id: string) => {
        await deleteTodo(id);
        if (selectedDay === "All Tasks") {
            getAllList()
        } else {
            getFilteredList()
        }
    };

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
        setSelectedDayTitle('Today')
    }, [selectedDay])


    const toggleTaskCompletion = async (taskId: string) => {
        setTodos((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            )
        );
        setFilteredTodos((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            )
        );
        const updatedTask: ToDoItem[] = todos.map((task: any) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        )
        await saveTodos(updatedTask)
    };

    const renderItem: ListRenderItem<ToDoItem> = ({ item, index }) => {
        const showSection = item?.category.toLowerCase() === filteredTodos?.[index - 1]?.category.toLowerCase() ? false : true;
        const dateInformation = timeAgo(item.createdAt);
        return (
            <View>
                {showSection &&
                    <>
                        <MyText fontWeight='medium' size='m' fontColor={color.secondary} style={{ paddingLeft: 10 }}>{item.category}</MyText>
                        <Spacer height={10} />
                    </>
                }
                <Card
                    onPress={() => {
                        router.navigate({
                            pathname: '/details',
                            params: { itemDetails: JSON.stringify(item) }
                        })
                    }}
                    style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 16, paddingLeft: 16 }} >
                    <CheckBox checked={item.isCompleted} onPress={() => toggleTaskCompletion(item.id)} />
                    <Spacer width={10} />
                    <View style={{ flex: 1 }}>

                        <MyText strikeThrough={item.isCompleted} fontWeight='medium' >{item.title}</MyText>
                        <MyText size='s'  >{dateInformation}</MyText>
                    </View>
                    <Pressable onPress={() => handleDelete(item.id)} >
                        <MyText fontColor={color.border} fontWeight='italic' size='s'>{'remove'}</MyText>
                    </Pressable>
                </Card>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView behavior='height' style={styles.container}>
            {/* <StatusBar hidden={true} /> */}
            <Spacer height={10} />
            <View style={{ paddingHorizontal: 20 }}>
                <MyText fontWeight='semiBold' size='xxl'>{selectedDayTitle}</MyText>
            </View>
            <Spacer height={10} />
            <View style={{ flex: 1 }}>
                <View>
                    <FlatList
                        horizontal
                        removeClippedSubviews
                        initialNumToRender={2}
                        maxToRenderPerBatch={2}
                        windowSize={2}
                        updateCellsBatchingPeriod={100}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, }}
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
                </View>
                <FlatList
                    data={filteredTodos}
                    removeClippedSubviews
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    windowSize={2}
                    updateCellsBatchingPeriod={100}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <Spacer height={15} />}
                    renderItem={renderItem}
                    ListEmptyComponent={() => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                        <MyText fontWeight='semiBold' size='xxl'>{'Nothing to do'}</MyText>
                        <MyText>{`Create a task by clicking on 'Add' below!`}</MyText>
                    </View>}
                />
            </View>

            <BottomAction>
                <Link href="/createToDo" asChild>
                    <Pressable style={{ flex: 1 }}>
                        <MyTextInput editable={false} placeholder="Write a task..." value={''} />
                    </Pressable>
                </Link>
                <Spacer width={10} />
                <Link href="/createToDo" asChild>
                    <MyButton style={{ paddingHorizontal: 20 }} label='Add' />
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
});

