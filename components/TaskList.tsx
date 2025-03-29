import { color } from "@/assets/colors";
import { ToDoItem } from "@/constant/interface";
import { formatDateDDMMYYYY, sortAndGroupTasks } from "@/utils/formatter";
import { deleteTodo, loadTodos, saveTodos } from "@/utils/todoStorage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, LayoutAnimation, ListRenderItem, Platform, StyleSheet, UIManager, View } from "react-native";
import LoadingTaskList from "./LoadingTaskList";
import MyText from "./MyText";
import Spacer from "./Spacer";
import TaskContent from "./TaskContent";

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
    const [activeID, setActiveID] = useState<string | null>(null);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [isLoading]);

    useFocusEffect(useCallback(() => {
        if (activeID) {
            setIsLoading(false)
        }
        if (selectedDay === "All Tasks") {
            getAllList()
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        } else {
            getFilteredList()
        }
    }, [selectedDay, activeID]))

    const getAllList = async () => {
        await loadTodos().then((val) => {
            setTodos(sortAndGroupTasks(val))
            setFilteredTodos(sortAndGroupTasks(val));
            setTimeout(() => {
                setActiveID(null)
            }, 1000);

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
        setActiveID(id)
        await deleteTodo(id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (selectedDay === "All Tasks") {
            await getAllList()
        } else {
            await getFilteredList()
        }
        setActiveID(null)

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
        return (
            <View>
                {showSection &&
                    <>
                        <MyText fontWeight='medium' size='m' fontColor={color.secondary} style={{ paddingLeft: 10 }}>{item.category}</MyText>
                        <Spacer height={10} />
                    </>
                }
                <TaskContent
                    activeID={activeID}
                    handleDelete={handleDelete}
                    item={item}
                    setActiveID={setActiveID}
                    toggleTaskCompletion={toggleTaskCompletion}
                />
            </View>
        )
    }, [isLoading, filteredTodos, activeID])

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