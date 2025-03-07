import { LinearGradient } from "expo-linear-gradient";
import { View, ViewStyle } from "react-native";

interface BottomActionProps {
    style?: ViewStyle;
    children?: React.ReactNode;
}

const BottomAction = ({ style, children }: BottomActionProps) => {
    return (
        <View style={[styles.container, style]}>
            <LinearGradient style={styles.gradient} colors={["#FFFFFF00", "#FFFFFF"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.2 }} />
            {children}
        </View>
    );
};

const styles = {
    container: {
        flexDirection: "row",
        position: "absolute",
        bottom: 0,
        padding: 20,
    } as ViewStyle,
    gradient: {
        flex: 1,
        height: "200%",
        width: "200%",
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
    } as ViewStyle,
};

export default BottomAction;