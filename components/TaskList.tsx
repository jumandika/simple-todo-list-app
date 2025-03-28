import { color } from "@/assets/colors";
import { ToDoItem } from "@/constant/interface";
import { timeAgo, completeTimeLabel, isOverdue, getOverdueLabelStatus, formatDateDDMMYYYY, sortAndGroupTasks } from "@/utils/formatter";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { FlatList, ListRenderItem, Pressable, View, StyleSheet, LayoutAnimation, UIManager, Platform } from "react-native";
import Card from "./Card";
import CheckBox from "./CheckBox";
import MyText from "./MyText";
import Spacer from "./Spacer";
import { loadTodos, deleteTodo, saveTodos } from "@/utils/todoStorage";
import LoadingTaskList from "./LoadingTaskList";
import LoadingContent from "./LoadingContent";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TaskListProps {
    selectedDay: any;
}

const TaskList = ({ selectedDay }: TaskListProps) => {
    const [todos, setTodos] = useState<ToDoItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filteredTodos, setFilteredTodos] = useState<ToDoItem[]>([]);
    const [deletedID, setDeletedID] = useState<string | null>(null);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [isLoading]);

    useFocusEffect(useCallback(() => {
        if (selectedDay === "All Tasks") {
            setIsLoading(true)
            getAllList()
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
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
        setIsLoading(true)
        const val = await loadTodos();
        const filtered = val.filter((item) => formatDateDDMMYYYY(new Date(item.dueDate)) === selectedDay)
        setFilteredTodos(sortAndGroupTasks(filtered));
        setIsLoading(false)
    }

    const handleDelete = async (id: string) => {
        setDeletedID(id)
        await deleteTodo(id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (selectedDay === "All Tasks") {
            await getAllList()
        } else {
            await getFilteredList()
        }
        setDeletedID(null)

    };

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


    const renderItem: ListRenderItem<ToDoItem> = useCallback(({ item, index }) => {
        const showSection = item?.category.toLowerCase() === filteredTodos?.[index - 1]?.category.toLowerCase() ? false : true;
        const createdDateInformation = timeAgo(item.createdAt);
        let dueDateInformation = completeTimeLabel(item.dueDate);
        const overdueStatus = isOverdue(item.dueDate) && item.isCompleted === false;
        if (overdueStatus) {
            dueDateInformation = getOverdueLabelStatus(item.dueDate)
        }
        const backgroundColor = item.isCompleted ? color.primaryLight : color.gray
        const borderColor = item.isCompleted ? color.primary : overdueStatus ? color.secondary : color.gray
        return (
            <View>
                {showSection &&
                    <>
                        <MyText fontWeight='medium' size='m' fontColor={color.secondary} style={{ paddingLeft: 10 }}>{item.category}</MyText>
                        <Spacer height={10} />
                    </>
                }
                {deletedID == item.id ?
                    <LoadingContent />
                    :
                    <>
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
                                backgroundColor,
                                borderColor,
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
                                <Spacer height={4} />
                                <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                    <MaterialCommunityIcons name="alarm" color={overdueStatus ? color.secondary : color.border} size={16} />
                                    <Spacer width={2} />
                                    <MyText size='s'>{dueDateInformation}</MyText>
                                </View>
                            </View>
                        </Card>
                    </>
                }
            </View>
        )
    }, [isLoading, filteredTodos, deletedID])

    return (
        isLoading ? <LoadingTaskList /> :
            <FlatList
                data={filteredTodos}
                removeClippedSubviews
                initialNumToRender={8}
                maxToRenderPerBatch={2}
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
    );
};


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


export default TaskList;