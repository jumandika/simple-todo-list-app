import React, { useMemo, useState } from "react";
import { View, Button, Switch, ViewStyle, Pressable, ScrollView, FlatList } from "react-native";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MyTextInput from "./MyTextInput";
import MyText, { fontSize } from "./MyText";
import { color } from "@/assets/colors";
import Spacer from "./Spacer";
import BottomAction from "./BottomAction";
import MyButton from "./MyButton";
import { ToDoCategory, Priorities, CommonActivities } from "@/constant/StaticData";
import { formatDateDDMMMYYYY } from "@/utils/formatter";
import Card from "./Card";

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string(),
    category: yup.string().required("Select a category"),
    priority: yup.string().required("Select priority"),
    dueDate: yup.date().required("Select a due date"),
    isCompleted: yup.boolean(),
});

const ToDoForm = ({ onSubmit }: any) => {
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            priority: "",
            dueDate: new Date(),
            isCompleted: false,
        },
    });

    const selectedDate = watch("dueDate");
    const cardStyle = useMemo<ViewStyle>(
        () => ({
            flex: 1,
            backgroundColor: color.gray,
            height: 55,
            justifyContent: 'center',
            borderRadius: 12,
        }),
        []
    );
    return (
        <View style={{ flex: 1, }}>
            <ScrollView>
                <View style={{ paddingHorizontal: 20 }}>
                    {/* Title Input */}
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, value }, formState: { errors } }) => (
                            <MyTextInput
                                value={value}
                                placeholder="Write your task title..."
                                onChangeText={onChange}
                                errorMessage={errors.title?.message}
                            />
                        )}
                    />
                    <View style={{ backgroundColor: color.secondaryLight, borderRadius: 12, marginTop: -20, zIndex: -1, }}>
                        <Spacer height={24} />
                        <MyText style={{ paddingLeft: 10 }} size='s' fontColor={color.secondary}>{'Recommendation'}</MyText>
                        <Spacer height={4} />
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                            data={CommonActivities}
                            renderItem={({ item, index }) => (
                                <Card
                                    fontSize={10}
                                    onPress={() => setValue('title', item)}
                                    key={index.toString()}
                                    label={item}
                                    style={{ backgroundColor: color.white, marginRight: 10, marginBottom: 10, minHeight: 30, borderRadius: 6, }}
                                />
                            )}
                        />
                    </View>

                    <Spacer height={20} />
                    {/* Description Input */}
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value }, formState: { errors } }) => (
                            <MyTextInput
                                value={value}
                                placeholder="Write your task description..."
                                onChangeText={onChange}
                                errorMessage={errors.description?.message}
                            />
                        )}
                    />
                    <Spacer height={20} />

                    {/* Category Picker */}
                    <Controller
                        control={control}
                        name="category"
                        render={({ field: { onChange, value }, formState: { errors } }) => (
                            <>
                                <View style={cardStyle}>
                                    <Picker
                                        selectedValue={value} onValueChange={onChange}>
                                        <Picker.Item color={color.text} fontFamily="Inter-Regular" style={{ fontSize: fontSize.m }} label="Select Category" value="" />
                                        {ToDoCategory.map((cat) => (
                                            <Picker.Item color={color.text} fontFamily="Inter-Regular" style={{ fontSize: fontSize.m }} key={cat} label={cat} value={cat} />
                                        ))}
                                    </Picker>
                                </View>
                                {
                                    errors &&
                                    <MyText size='s' fontColor={color.red}>{errors.category?.message || ''}</MyText>
                                }
                            </>
                        )}
                    />
                    <Spacer height={20} />

                    {/* Priority Picker */}
                    <Controller
                        control={control}
                        name="priority"
                        render={({ field: { onChange, value }, formState: { errors } }) => (
                            <>
                                <View style={cardStyle}>
                                    <Picker
                                        style={{ color: color.text }}
                                        selectedValue={value} onValueChange={onChange}>
                                        <Picker.Item color={color.text} fontFamily="Inter-Regular" style={{ fontSize: fontSize.m }} label="Select Priority" value="" />
                                        {Priorities.map((pri) => (
                                            <Picker.Item color={color.text} fontFamily="Inter-Regular" style={{ fontSize: fontSize.m }} key={pri} label={pri} value={pri} />
                                        ))}
                                    </Picker>
                                </View >
                                {
                                    errors &&
                                    <MyText size='s' fontColor={color.red}>{errors.priority?.message || ''}</MyText>
                                }
                            </>
                        )}
                    />
                    <Spacer height={20} />

                    {/* Due Date Picker */}
                    <Pressable
                        onPress={() => setShowDatePicker((val) => !val)}
                        style={[cardStyle, { paddingHorizontal: 12 }]}>
                        <MyText>{formatDateDDMMMYYYY(selectedDate) || `Due Date`}</MyText>
                    </Pressable>
                    {
                        showDatePicker &&
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            accentColor={color.primary}
                            onChange={(_, date) => {
                                if (date) {
                                    setValue("dueDate", date)
                                    setShowDatePicker(false)
                                }
                            }}
                            textColor={color.text}

                        />
                    }
                    <Spacer height={10} />
                    {/* Completion Status Switch */}
                    <Controller
                        control={control}
                        name="isCompleted"
                        render={({ field: { onChange, value }, formState: { errors } }) => (
                            <View style={{ flexDirection: "row", alignItems: "center", }}>
                                <Switch value={value} onValueChange={onChange} />
                                <MyText>Completed?</MyText>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>

            {/* Submit Button */}
            <BottomAction>
                <MyButton onPress={handleSubmit(onSubmit)} style={{ flex: 1, paddingHorizontal: 20 }} label='Create' />
            </BottomAction>
        </View>
    );
};

export default ToDoForm;
