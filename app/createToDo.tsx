import { color } from '@/assets/colors';
import MyText from '@/components/MyText';
import Spacer from '@/components/Spacer';
import ToDoForm from '@/components/ToDoForm';
import { ToDoItem } from '@/constant/interface';
import { addTodo } from '@/utils/todoStorage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateToDoScreen() {
    const { top } = useSafeAreaInsets()

    const handleFormSubmit = async (data: ToDoItem) => {
        const newTodo = {
            ...data,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        await addTodo(newTodo);
        router.back()
    };

    return (
        <KeyboardAvoidingView behavior='height' style={[styles.container, { paddingTop: top }]}>
            <StatusBar hidden={false} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={40} />
                </Pressable>
                <Spacer width={6} />
                <View style={{ flex: 1, paddingRight: 20 }}>
                    <MyText fontWeight='semiBold' size='xxl'>{'Create To Do'}</MyText>
                    <MyText fontColor={color.border} size='m'>{'Create a task schedule to keep your productivity on track!'}</MyText>
                </View>
            </View>
            <Spacer height={20} />
            <ToDoForm onSubmit={handleFormSubmit} />

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

