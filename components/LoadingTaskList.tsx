import { color } from "@/assets/colors";
import { ToDoItem } from "@/constant/interface";
import { DummyTodos } from "@/constant/StaticData";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import LoadingContent from "./LoadingContent";
import MyText from "./MyText";
import Skeleton from "./Skeleton";
import Spacer from "./Spacer";

const LoadingTaskList = () => {

    const renderItemLoading: ListRenderItem<ToDoItem | any> = ({ item, index }) => {
        const showSection = item?.category.toLowerCase() === DummyTodos?.[index - 1]?.category.toLowerCase() ? false : true;
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
                <LoadingContent />
            </View>
        )
    }

    return (
        <FlatList
            data={DummyTodos}
            removeClippedSubviews
            initialNumToRender={2}
            maxToRenderPerBatch={2}
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
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    }
});

export default LoadingTaskList;