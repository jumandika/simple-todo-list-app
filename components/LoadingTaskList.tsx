import { DummyTodos } from "@/constant/StaticData";
import { FlatList, ListRenderItem, Pressable, View, StyleSheet } from "react-native";
import Spacer from "./Spacer";
import { color } from "@/assets/colors";
import { ToDoItem } from "@/constant/interface";
import { timeAgo, completeTimeLabel } from "@/utils/formatter";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "./Card";
import CheckBox from "./CheckBox";
import MyText from "./MyText";
import Skeleton from "./Skeleton";

const LoadingTaskList = ({ }: {}) => {
    const renderItemLoading: ListRenderItem<ToDoItem | any> = ({ item, index }) => {
        const showSection = item?.category.toLowerCase() === DummyTodos?.[index - 1]?.category.toLowerCase() ? false : true;
        const createdDateInformation = timeAgo(item.createdAt);
        const dueDateInformation = completeTimeLabel(item.dueDate);
        const backgroundColor = color.white
        const borderColor = color.gray
        return (
            <View>
                {showSection &&
                    <>
                        <Skeleton isLoading={true} widthPercentage={'20%'} borderRadius={8}>
                            <MyText fontWeight='medium' size='m' fontColor={color.secondary} style={{ paddingLeft: 10 }}>{item.category}</MyText>
                        </Skeleton>
                        <Spacer height={10} />
                    </>
                }
                <View style={styles.createdDateContainer}>
                    <Skeleton isLoading={true} widthPercentage={'100%'} borderRadius={4}>
                        <MyText fontColor={color.border} style={{ fontSize: 8, }} size='s'>{createdDateInformation}</MyText>
                    </Skeleton>
                </View>
                <Pressable style={[styles.deleteButton, { backgroundColor: color.gray }]}  >
                    <AntDesign name='close' color={color.white} size={10} />
                </Pressable>
                <Card
                    style={[styles.cardContainer, {
                        backgroundColor,
                        borderColor,
                    }]} >
                    <Skeleton isLoading={true} widthPercentage={'100%'} borderRadius={8}>
                        <CheckBox checked={item.isCompleted} />
                    </Skeleton>
                    <Spacer width={10} />
                    <View style={{ flex: 1 }}>
                        <Skeleton isLoading={true} widthPercentage={'60%'} borderRadius={8}>
                            <MyText strikeThrough={item.isCompleted} fontWeight='medium' >{item.title}</MyText>
                        </Skeleton>
                        <Spacer height={4} />
                        <Skeleton isLoading={true} widthPercentage={'30%'} borderRadius={8}>
                            <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                <MaterialCommunityIcons name="alarm" color={color.border} size={16} />
                                <Spacer width={2} />
                                <MyText size='s'>{dueDateInformation}</MyText>
                            </View>
                        </Skeleton>
                    </View>
                </Card>
            </View>
        )
    }

    return (
        <FlatList
            data={DummyTodos}
            removeClippedSubviews
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={2}
            updateCellsBatchingPeriod={100}
            contentContainerStyle={styles.listContainer}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <Spacer height={15} />}
            renderItem={renderItemLoading}
        />
    );
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
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    }
});

export default LoadingTaskList;