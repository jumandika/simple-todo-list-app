
import { color } from "@/assets/colors";
import { ToDoItem } from "@/constant/interface";
import { completeTimeLabel, getOverdueLabelStatus, isOverdue, timeAgo } from "@/utils/formatter";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from "react-native";
import Card from "./Card";
import CheckBox from "./CheckBox";
import LoadingContent from "./LoadingContent";
import MyText from "./MyText";
import Spacer from "./Spacer";
import { useEffect } from "react";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TaskContentProps {
    activeID: string | null;
    handleDelete: (id: string) => Promise<void>;
    item: ToDoItem;
    setActiveID: (val: string) => void;
    toggleTaskCompletion: (taskId: string) => Promise<void>;
}

const TaskContent: React.FC<TaskContentProps> = ({ activeID, handleDelete, item, setActiveID, toggleTaskCompletion }) => {

    useEffect(() => {
        activeID == null && LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [activeID]);

    const createdDateInformation = timeAgo(item.createdAt);
    let dueDateInformation = completeTimeLabel(item.dueDate);
    const overdueStatus = isOverdue(item.dueDate) && item.isCompleted === false;
    if (overdueStatus) {
        dueDateInformation = getOverdueLabelStatus(item.dueDate)
    }
    const backgroundColor = item.isCompleted ? color.primaryLight : color.gray
    const borderColor = item.isCompleted ? color.primary : overdueStatus ? color.secondary : color.gray

    return (
        activeID == item.id ?
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
                        setActiveID(item.id)
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
    )
};


const styles = StyleSheet.create({
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
});


export default TaskContent