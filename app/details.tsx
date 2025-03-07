import { color } from '@/assets/colors';
import MyText from '@/components/MyText';
import Spacer from '@/components/Spacer';
import ToDoForm from '@/components/ToDoForm';
import { ToDoItem } from '@/constant/interface';
import { updateTodo } from '@/utils/todoStorage';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, StatusBar, StyleSheet, View } from 'react-native';

export default function DetailsScreen() {
  const { itemDetails } = useLocalSearchParams()
  console.log('item :>> ', itemDetails);
  const handleFormSubmit = async (data: ToDoItem) => {
    const newTodo = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    await updateTodo(newTodo);
    router.back()
  };
  return (
    <KeyboardAvoidingView behavior='height' style={styles.container}>
      <StatusBar hidden={false} />
      <Spacer height={20} />
      <View style={{ paddingHorizontal: 20 }}>
        <MyText fontWeight='semiBold' size='xxl'>{'Task Details'}</MyText>
        <MyText fontColor={color.border} size='m'>{'You can edit this task and re-schedule to keep your productivity on track!'}</MyText>
      </View>
      <Spacer height={40} />
      <ToDoForm itemDetails={itemDetails} onSubmit={handleFormSubmit} />
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
