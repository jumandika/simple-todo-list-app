export interface ToDoItem {
    id: string; // Unique identifier
    title: string; // Task title
    description?: string; // Optional detailed task description
    category: ToDoCategory; // Enum for task category
    dueDate?: string; // Deadline (format: YYYY-MM-DD)
    priority: "low" | "medium" | "high"; // Task priority level
    isCompleted: boolean; // Task completion status
    createdAt: string; // Task creation timestamp
    updatedAt?: string; // Last update timestamp
    tags?: string[]; // Optional tags for better organization
    subTasks?: SubTask[]; // Optional list of subtasks
}

export interface SubTask {
    id: string;
    title: string;
    isCompleted: boolean;
}

export enum ToDoCategory {
    WORK = "Work",
    STUDY = "Study",
    HOUSEHOLD = "Household",
    FITNESS = "Fitness",
    RELIGIOUS = "Religious",
    SOCIAL = "Social",
    ENTERTAINMENT = "Entertainment",
    FINANCE = "Finance",
    FAMILY_TIME = "Family Time",
    PERSONAL_DEVELOPMENT = "Personal Development",
    MISC = "Miscellaneous"
}