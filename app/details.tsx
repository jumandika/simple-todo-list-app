import { color } from '@/assets/colors';
import MyText from '@/components/MyText';
import Spacer from '@/components/Spacer';
import ToDoForm from '@/components/ToDoForm';
import { ToDoItem } from '@/constant/interface';
import { loadTodos, updateTodo } from '@/utils/todoStorage';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DetailsScreen() {
  const { itemDetails } = useLocalSearchParams<any>()
  const { top } = useSafeAreaInsets()

  let itemDetailsParsed = JSON.parse(itemDetails);
  const handleFormSubmit = async (data: ToDoItem) => {
    const updatedTodo = {
      ...data,
      id: itemDetailsParsed?.id,
      createdAt: itemDetailsParsed?.createdAt,
      updatedAt: new Date().toISOString(),
    };
    console.log('updatedTodo :>> ', updatedTodo);
    await updateTodo(updatedTodo);
    await loadTodos();
    router.back()
  };
  return (
    <KeyboardAvoidingView behavior='height' style={[styles.container, { paddingTop: top }]}>
      <StatusBar hidden={false} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => router.back()}>
          <Feather name="chevron-left" size={40} color={color.text} />
        </Pressable>
        <Spacer width={6} />
        <View style={{ flex: 1, paddingRight: 20 }}>
          <MyText fontWeight='semiBold' size='xxl'>{'Task Details'}</MyText>
          <MyText fontColor={color.border} size='m'>{'You can edit this task and re-schedule to keep your productivity on track!'}</MyText>
        </View>
      </View>
      <Spacer height={20} />
      <ToDoForm itemDetails={itemDetailsParsed} onSubmit={handleFormSubmit} />
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
