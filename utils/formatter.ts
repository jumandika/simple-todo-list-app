import { ToDoItem } from "@/constant/interface";
import { Days, Months } from "@/constant/StaticData";

const formatDateDDMMMYYYY = (date: any) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = Months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

const formatDateWithTime = (date: any): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = Months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

const formatOnlyDate = (date: any): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = Months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

const formatOnlyTime = (date: any): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
};

const timeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);

    // Get the difference in seconds
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    // If more than 1 hour, return time in HH:mm format
    if (diffInSeconds >= 3600) {
        const timeLabel = past.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);
        const tomorrow = new Date(today + 86400000).setHours(0, 0, 0, 0);
        const pastDay = past.setHours(0, 0, 0, 0);

        let dayLabel = past.toLocaleDateString("en-US", { weekday: "long" });

        if (pastDay === today) {
            dayLabel = "Today";
        } else if (pastDay === yesterday) {
            dayLabel = "Yesterday";
        } else if (pastDay === tomorrow) {
            dayLabel = "Tomorrow";
        }

        return `${dayLabel} at ${timeLabel}`;
    }

    // Time intervals for "x minutes ago"
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

const completeTimeLabel = (dateString: string): string => {
    const past = new Date(dateString);
    const timeLabel = past.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);
    const tomorrow = new Date(today + 86400000).setHours(0, 0, 0, 0);
    const pastDay = past.setHours(0, 0, 0, 0);

    let dayLabel = past.toLocaleDateString("en-US", { weekday: "long" });

    if (pastDay === today) {
        dayLabel = "Today";
    } else if (pastDay === yesterday) {
        dayLabel = "Yesterday";
    } else if (pastDay === tomorrow) {
        dayLabel = "Tomorrow";
    }

    return `${dayLabel} at ${timeLabel}`;

};

const getOverdueLabelStatus = (dueDateString: string): string => {
    const now = new Date();
    const dueDate = new Date(dueDateString);

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const dueDayStart = new Date(dueDate).setHours(0, 0, 0, 0);

    if (dueDayStart < todayStart) {
        return `Overdue since ${dueDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })} at ${dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (dueDayStart === todayStart) {
        if (dueDate.getTime() < now.getTime()) {
            return `Overdue today at ${dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        } else {
            return `Due today at ${dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        }
    } else {
        return `Due on ${dueDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })} at ${dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
};

const isOverdue = (dueDateString: string): boolean => {
    const now = new Date();
    const dueDate = new Date(dueDateString);

    return dueDate.getTime() < now.getTime(); // Returns true if the due date is in the past
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
    startOfWeek.setDate(date.getDate() - 7); // Start from Monday
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
    completeTimeLabel,
    formatDateWithTime,
    formatDateDDMMYYYY,
    formatOnlyDate,
    formatOnlyTime,
    formatDateDD,
    getWeekWithNames,
    sortAndGroupTasks,
    timeAgo,
    getOverdueLabelStatus,
    isOverdue,
}