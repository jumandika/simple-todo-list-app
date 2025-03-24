import { ToDoItem } from "@/constant/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TODO_STORAGE_KEY = "todos";

// Save To-Do List
export const saveTodos = async (todos: ToDoItem[]) => {
    try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem(TODO_STORAGE_KEY, jsonValue);
    } catch (error) {
        console.error("Error saving todos:", error);
    }
};

// Load To-Do List
export const loadTodos = async (): Promise<ToDoItem[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(TODO_STORAGE_KEY);
        return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error("Error loading todos:", error);
        return [];
    }
};

// Add New To-Do
export const addTodo = async (newTodo: ToDoItem) => {
    const todos = await loadTodos();
    todos.push(newTodo);
    await saveTodos(todos);
};

// Update To-Do
export const updateTodo = async (updatedTodo: ToDoItem) => {
    let todos = await loadTodos();
    todos = todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
    await saveTodos(todos);
};

// Delete To-Do
export const deleteTodo = async (todoId: string) => {
    let todos = await loadTodos();
    todos = todos.filter(todo => todo.id !== todoId);
    await saveTodos(todos);
};