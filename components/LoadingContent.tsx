import { color } from "@/assets/colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import Card from "./Card";
import CheckBox from "./CheckBox";
import MyText from "./MyText";
import Skeleton from "./Skeleton";
import Spacer from "./Spacer";

const LoadingContent = () => {
    const backgroundColor = color.white
    const borderColor = color.gray
    return (
        <>
            <View style={styles.createdDateContainer}>
                <Skeleton isLoading={true} widthPercentage={'100%'} borderRadius={4}>
                    <MyText fontColor={color.border} style={{ fontSize: 8, }} size='s'>{`dateInformation`}</MyText>
                </Skeleton>
            </View>
            <View style={[styles.deleteButton, { backgroundColor: color.gray }]}  >
                <AntDesign name='close' color={color.white} size={10} />
            </View>
            <Card
                style={[styles.cardContainer, {
                    backgroundColor,
                    borderColor,
                }]} >
                <Skeleton isLoading={true} widthPercentage={'100%'} borderRadius={8}>
                    <CheckBox checked={false} />
                </Skeleton>
                <Spacer width={10} />
                <View style={{ flex: 1 }}>
                    <Skeleton isLoading={true} widthPercentage={'60%'} borderRadius={8}>
                        <MyText strikeThrough={false} fontWeight='medium' >{`loading text`}</MyText>
                    </Skeleton>
                    <Spacer height={4} />
                    <Skeleton isLoading={true} widthPercentage={'30%'} borderRadius={8}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                            <MaterialCommunityIcons name="alarm" color={color.border} size={16} />
                            <Spacer width={2} />
                            <MyText size='s'>{'due date information'}</MyText>
                        </View>
                    </Skeleton>
                </View>
            </Card>
        </>
    )
}


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
});

export default LoadingContent;