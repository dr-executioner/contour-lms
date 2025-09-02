export interface  UserInterface {
  name: string;
  email: string;
  avatar: string;
  level: string;
  gpa: number;
}

export interface  Course {
  id: number;
  title: string;
  progress: number;
  instructor: string;
  nextClass: string;
  color: string;
}

export interface  Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface  Stats {
  coursesCompleted: number;
  totalHours: number;
  achievements: number;
  currentStreak: number;
}

export interface  Activity {
  type: string;
  text: string;
  time: string;
  icon: any;
  color: string;
}

export interface  CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
}

export interface  ProgressBarProps {
  progress: number;
  color?: string;
  height?: string;
}

export interface  BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}


