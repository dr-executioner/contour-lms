import { Assignment, Course, Stats, User } from "../types";
import { colors } from "./colors";

export const mockData: {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  stats: Stats;
} = {
  user: {
    name: "Sarah Chen",
    email: "sarah.chen@university.edu",
    avatar: "SC",
    level: "Junior",
    gpa: 3.8
  },
  courses: [
    { id: 1, title: "Advanced React Development", progress: 75, instructor: "Dr. Smith", nextClass: "Today 2:00 PM", color: colors.primary[500] },
    { id: 2, title: "Database Systems", progress: 60, instructor: "Prof. Johnson", nextClass: "Tomorrow 10:00 AM", color: colors.accent.purple },
    { id: 3, title: "UI/UX Design Principles", progress: 90, instructor: "Ms. Davis", nextClass: "Thu 1:30 PM", color: colors.accent.pink },
    { id: 4, title: "Data Structures & Algorithms", progress: 45, instructor: "Dr. Wilson", nextClass: "Fri 9:00 AM", color: colors.accent.emerald }
  ],
  assignments: [
    { id: 1, title: "React Component Library", course: "Advanced React", dueDate: "2 days", priority: "high" },
    { id: 2, title: "Database Design Project", course: "Database Systems", dueDate: "1 week", priority: "medium" },
    { id: 3, title: "User Research Report", course: "UI/UX Design", dueDate: "3 days", priority: "high" }
  ],
  stats: {
    coursesCompleted: 12,
    totalHours: 240,
    achievements: 8,
    currentStreak: 15
}
	}
