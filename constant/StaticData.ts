const CommonActivities = [
    'Exercise',
    'Read books',
    'Prayer',
    'Lunch',
    'Meditate',
    'Water plants',
    'Morning coffee',
    'Grocery shopping',
    'Cleaning the house',
    'Commuting to work',
    'Picking up kids from school',
    'Watching news',
    'Evening walk',
    'Cooking dinner',
    'Social media browsing',
    'Family time',
    'Attending online meetings',
    'Studying or learning new skills',
    'Journaling',
    'Checking emails',
    'Playing with pets',
    'Visiting friends or relatives',
    'Weekend market shopping',
    'Late-night snacking',
    'Scrolling through e-commerce apps',
    'Planning daily schedule'
];

const ToDoCategory = [
    "Work",
    "Study",
    "Household",
    "Fitness",
    "Religious",
    "Social",
    "Entertainment",
    "Finance",
    "Family Time",
    "Personal Development",
    "Miscellaneous"
];

const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Priorities = ["Low", "Medium", "High"];

const ConvertedDays: any = {
    "SUN": "Sunday",
    "MON": "Monday",
    "TUE": "Tuesday",
    "WED": "Wednesday",
    "THU": "Thursday",
    "FRI": "Friday",
    "SAT": "Saturday"
};

const DummyTodos = [{
    "category": "Work",
    "createdAt": "2025-03-24T22:48:03.427Z", "description": "",
    "dueDate": "2025-03-25T04:52:00.000Z", "id": "1", "isCompleted": false, "priority": "Low",
    "title": "Exercise"
},
{
    "category": "Work",
    "createdAt": "2025-03-24T22:48:03.427Z", "description": "",
    "dueDate": "2025-03-25T04:52:00.000Z", "id": "2", "isCompleted": false, "priority": "Low",
    "title": "Exercise"
},
{
    "category": "Work",
    "createdAt": "2025-03-24T22:48:03.427Z", "description": "",
    "dueDate": "2025-03-25T04:52:00.000Z", "id": "3", "isCompleted": false, "priority": "Low",
    "title": "Exercise"
},
{
    "category": "Work",
    "createdAt": "2025-03-24T22:48:03.427Z", "description": "",
    "dueDate": "2025-03-25T04:52:00.000Z", "id": "4", "isCompleted": false, "priority": "Low",
    "title": "Exercise"
},
{
    "category": "Fitness",
    "createdAt": "2025-03-24T22:48:03.427Z", "description": "",
    "dueDate": "2025-03-25T04:52:00.000Z", "id": "5", "isCompleted": false, "priority": "Low",
    "title": "Exercise"
},
{
    "category": "Fitness",
    "createdAt": "2025-03-24T22:48:03.427Z", "description": "",
    "dueDate": "2025-03-25T04:52:00.000Z", "id": "6", "isCompleted": false, "priority": "Low",
    "title": "Exercise"
},
{
    "category": "Fitness",
    "createdAt": "2025-03-24T22:48:03.427Z", "description": "",
    "dueDate": "2025-03-25T04:52:00.000Z", "id": "7", "isCompleted": false, "priority": "Low",
    "title": "Exercise"
}]


export {
    ToDoCategory,
    CommonActivities,
    Days,
    Months,
    ConvertedDays,
    Priorities,
    DummyTodos,
}