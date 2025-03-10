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
import { completeTimeLabel, formatDateDDMMYYYY, getOverdueLabelStatus, getWeekWithNames, isOverdue, sortAndGroupTasks, timeAgo } from '@/utils/formatter';
import { deleteTodo, loadTodos, saveTodos } from '@/utils/todoStorage';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, ListRenderItem, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
    const [weekList, setWeekList] = useState<any>(null)
    const [selectedDay, setSelectedDay] = useState<string>('All Tasks')
    const [selectedDayTitle, setSelectedDayTitle] = useState<string>('')
    const [todos, setTodos] = useState<ToDoItem[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<ToDoItem[]>([]);
    const { top } = useSafeAreaInsets()

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
        const createdDateInformation = timeAgo(item.createdAt);
        let dueDateInformation = completeTimeLabel(item.dueDate);
        const overdueStatus = isOverdue(item.dueDate) && item.isCompleted === false;
        if (overdueStatus) {
            dueDateInformation = getOverdueLabelStatus(item.dueDate)
        }
        return (
            <View>
                {showSection &&
                    <>
                        <MyText fontWeight='medium' size='m' fontColor={color.secondary} style={{ paddingLeft: 10 }}>{item.category}</MyText>
                        <Spacer height={10} />
                    </>
                }
                <View style={styles.createdDateContainer}>
                    <MyText fontColor={color.border} style={{ fontSize: 8, }} size='s'>{createdDateInformation}</MyText>
                </View>
                <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)} >
                    <AntDesign name='close' color={color.white} size={10} />
                </Pressable>
                <Card
                    onPress={() => {
                        router.navigate({
                            pathname: '/details',
                            params: { itemDetails: JSON.stringify(item) }
                        })
                    }}
                    style={[styles.cardContainer, {
                        borderColor: overdueStatus ? color.secondary : color.gray,
                    }]} >
                    {overdueStatus &&
                        <View style={styles.overdueIndicator}>
                            <MaterialCommunityIcons name="bell-alert" color={color.secondaryLight} style={{ transform: [{ rotate: '-45deg' }] }} size={100} />
                        </View>
                    }
                    <CheckBox checked={item.isCompleted} onPress={() => toggleTaskCompletion(item.id)} />
                    <Spacer width={10} />
                    <View style={{ flex: 1 }}>
                        <MyText strikeThrough={item.isCompleted} fontWeight='medium' >{item.title}</MyText>
                        <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                            <MaterialCommunityIcons name="alarm" color={overdueStatus ? color.secondary : color.border} size={16} />
                            <Spacer width={2} />
                            <MyText size='s'>{dueDateInformation}</MyText>
                        </View>
                    </View>
                </Card>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior='height' style={[styles.container, { paddingTop: top }]}
        >
            <StatusBar hidden={false} />
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
                </View>
                <FlatList
                    data={filteredTodos}
                    removeClippedSubviews
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    windowSize={2}
                    updateCellsBatchingPeriod={100}
                    contentContainerStyle={styles.listContainer}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <Spacer height={15} />}
                    renderItem={renderItem}
                    ListEmptyComponent={() => <View style={styles.emptyListContainer}>
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
        paddingBottom: 20,
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
