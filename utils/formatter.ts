import { ToDoItem } from "@/constant/interface";
import { Days, Months } from "@/constant/StaticData";

const formatDateDDMMMYYYY = (date: any) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = Months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};
const timeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds >= 3600) {
        // If more than 1 hour, return time in HH:mm format
        return past.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const intervals: { label: string; seconds: number }[] = [
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return count === 1 ? `a ${interval.label} ago` : `${count} ${interval.label}s ago`;
        }
    }

    return "just now";
};
const formatDateDD = (date: any) => {
    const day = date.getDate().toString().padStart(2, "0");
    return `${day}`;
};
const formatDateDDMMYYYY = (date: any) => {
    const dayName = Days[date.getDay()]
    const day = date.getDate().toString().padStart(2, "0");
    const month = Months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
};

const getWeekWithNames = (date = new Date()) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    return Array.from({ length: 31 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + (i + 1));
        return {
            fullDate: formatDateDDMMYYYY(day),
            date: formatDateDD(day),
            day: Days[day.getDay()],
            isWeekend: day.getDay() === 0 || day.getDay() === 6, // Sunday (0) or Saturday (6)
        };
    });
}

const sortAndGroupTasks = (tasks: ToDoItem[]) => {
    // Step 1: Sort all tasks by createdAt (desc)
    const sortedTasks = [...tasks].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Step 2: Group tasks by category while maintaining order
    const groupedTasks: Record<string, ToDoItem[]> = {};
    sortedTasks.forEach((task) => {
        if (!groupedTasks[task.category]) {
            groupedTasks[task.category] = [];
        }
        groupedTasks[task.category].push(task);
    });

    // Flatten the grouped tasks back into a single list
    return Object.values(groupedTasks).flat();
};

export {
    formatDateDDMMMYYYY,
    formatDateDDMMYYYY,
    formatDateDD,
    getWeekWithNames,
    sortAndGroupTasks,
    timeAgo,
}