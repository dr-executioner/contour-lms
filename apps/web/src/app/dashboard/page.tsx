"use client"

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Trophy, 
  Clock, 
  Users, 
  FileText, 
  Play, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Download
} from 'lucide-react';
import { colors } from '../../constants/colors';
import { CardProps, ProgressBarProps, Stats, Assignment, Course, UserInterface, Activity, BadgeProps } from '../../types';
import { mockData } from '../../constants/mockData';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

const Card: React.FC<CardProps> = ({ children, className = "", style = {}, hover = true }) => (
  <div 
    className={`backdrop-blur-xl rounded-2xl border transition-all duration-300 ${hover ? 'hover:scale-[1.02] hover:shadow-2xl' : ''} ${className}`}
    style={{ 
      backgroundColor: `${colors.dark.surface}cc`,
      borderColor: colors.dark.border,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      ...style
    }}
  >
    {children}
  </div>
);

// Reusable Progress Bar Component
const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = colors.primary[500], height = "h-2" }) => (
  <div className={`w-full bg-gray-800 rounded-full ${height} overflow-hidden`}>
    <div 
      className={`${height} rounded-full transition-all duration-500 ease-out`}
      style={{ 
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${color}, ${color}dd)`
      }}
    />
  </div>
);

// Reusable Badge Component
const Badge: React.FC<BadgeProps> = ({ children, variant = "default", size = "sm" }) => {
  const variants = {
    default: { bg: colors.dark.border, text: colors.dark.textMuted },
    success: { bg: `${colors.success}20`, text: colors.success },
    warning: { bg: `${colors.warning}20`, text: colors.warning },
    error: { bg: `${colors.error}20`, text: colors.error },
    primary: { bg: `${colors.primary[500]}20`, text: colors.primary[400] }
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${sizes[size]}`}
      style={{ backgroundColor: variants[variant].bg, color: variants[variant].text }}
    >
      {children}
    </span>
  );
};

// Settings Dropdown Component
const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

	const router = useRouter()
	const {supabase, dispatch} = useAuth()

	async function handleLogout() {
		try{
		const response = await supabase.auth.signOut()
			console.log("LOG OUT",response)
			if(response.error === null){
				router.replace("/login")
				dispatch({ type: "LOGOUT" });
			}
		}catch(error){
			console.log("Error occured while logging out :",error)
		}
  }
  const menuItems = [
    { label: 'Log Out', icon: LogOut, action:  handleLogout , variant: 'danger' as const }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 ${isOpen ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className="w-5 h-5" style={{ color: colors.dark.textMuted }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 top-12 w-56 backdrop-blur-xl rounded-2xl border shadow-2xl z-[1000] overflow-hidden"
          style={{ 
            backgroundColor: `${colors.dark.surface}f5`,
            borderColor: colors.dark.border,
            animation: 'dropdownSlideIn 0.2s ease-out'
          }}
        >
          <div className="py-2">
            {menuItems.map((item, index) => {
              if (item.type === 'divider') {
                return (
                  <div 
                    key={index} 
                    className="my-2 mx-2 h-px" 
                    style={{ backgroundColor: colors.dark.border }}
                  />
                );
              }

              const Icon = item.icon;
              const isDanger = item.variant === 'danger';

              return (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left flex items-center space-x-3 transition-all duration-150 hover:bg-white hover:bg-opacity-10"
                  style={{ 
                    color: isDanger ? colors.error : colors.dark.text 
                  }}
                >
                  <Icon 
                    className="w-4 h-4" 
                    style={{ color: isDanger ? colors.error : colors.dark.textMuted }} 
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


const Header: React.FC = () => {
  const { state, supabase } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!state.user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", state.user?.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
      } else {
        setFullName(data?.full_name ?? null);
      }
    };

    loadProfile();
  }, [state.user, supabase]);

  return (
    <Card className="p-6 mb-8" hover={false}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar circle with initials */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.accent.purple})`,
            }}
          >
            {fullName ? fullName.charAt(0).toUpperCase() : "?"}
          </div>

          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.dark.text }}
            >
              Welcome back, {fullName ?? "User"}
            </h1>
            <p style={{ color: colors.dark.textMuted }}>
              {state.user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-10 relative">
            <Bell className="w-5 h-5" style={{ color: colors.dark.textMuted }} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-10">
            <Search
              className="w-5 h-5"
              style={{ color: colors.dark.textMuted }}
            />
          </button>
          <SettingsDropdown />
        </div>
      </div>
    </Card>
  );
};
const StatsGrid: React.FC<{ stats: Stats }> = ({ stats }) => {
  const statItems = [
    { label: "Courses Completed", value: stats.coursesCompleted, icon: Trophy, color: colors.accent.emerald },
    { label: "Study Hours", value: stats.totalHours, icon: Clock, color: colors.primary[500] },
    { label: "Achievements", value: stats.achievements, icon: Star, color: colors.accent.orange },
    { label: "Learning Streak", value: `${stats.currentStreak} days`, icon: TrendingUp, color: colors.accent.purple }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: colors.dark.textMuted }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: colors.dark.text }}>
                {stat.value}
              </p>
            </div>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Course Card Component
const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: colors.dark.text }}>
          {course.title}
        </h3>
        <p className="text-sm" style={{ color: colors.dark.textMuted }}>
          {course.instructor}
        </p>
      </div>
      <Badge variant="primary">{course.progress}%</Badge>
    </div>
    
    <div className="mb-4">
      <ProgressBar progress={course.progress} color={course.color} />
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center text-sm" style={{ color: colors.dark.textSubtle }}>
        <Clock className="w-4 h-4 mr-1" />
        {course.nextClass}
      </div>
      <button 
        className="flex items-center text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: course.color }}
      >
        Continue
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  </Card>
);

// Assignment Card Component
const AssignmentCard: React.FC<{ assignment: Assignment }> = ({ assignment }) => {
  const priorityColors = {
    high: colors.error,
    medium: colors.warning,
    low: colors.success
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${priorityColors[assignment.priority]}20` }}
          >
            <FileText className="w-5 h-5" style={{ color: priorityColors[assignment.priority] }} />
          </div>
          <div>
            <h4 className="font-medium" style={{ color: colors.dark.text }}>
              {assignment.title}
            </h4>
            <p className="text-sm" style={{ color: colors.dark.textSubtle }}>
              {assignment.course}
            </p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={assignment.priority === 'high' ? 'error' : assignment.priority === 'medium' ? 'warning' : 'success'}>
            Due in {assignment.dueDate}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

// Quick Actions Component
const QuickActions: React.FC = () => {
  const actions = [
    { icon: BookOpen, label: "Browse Courses", color: colors.primary[500] },
    { icon: Calendar, label: "View Schedule", color: colors.accent.purple },
    { icon: Users, label: "Study Groups", color: colors.accent.pink },
    { icon: Download, label: "Resources", color: colors.accent.emerald }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.dark.text }}>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="p-4 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-lg text-left"
            style={{ 
              backgroundColor: colors.dark.bg,
              borderColor: colors.dark.border,
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = action.color;
              e.target.style.backgroundColor = `${action.color}10`;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = colors.dark.border;
              e.target.style.backgroundColor = colors.dark.bg;
            }}
          >
            <action.icon className="w-6 h-6 mb-2" style={{ color: action.color }} />
            <p className="text-sm font-medium" style={{ color: colors.dark.text }}>
              {action.label}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
};

// Recent Activity Component
const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    { type: "completed", text: "Completed React Hooks Quiz", time: "2 hours ago", icon: CheckCircle, color: colors.success },
    { type: "started", text: "Started Database Design Module", time: "1 day ago", icon: Play, color: colors.primary[500] },
    { type: "achievement", text: "Earned 'Quick Learner' badge", time: "2 days ago", icon: Trophy, color: colors.accent.orange },
    { type: "submitted", text: "Submitted UI Design Assignment", time: "3 days ago", icon: FileText, color: colors.accent.purple }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.dark.text }}>
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${activity.color}20` }}
            >
              <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: colors.dark.text }}>
                {activity.text}
              </p>
              <p className="text-xs" style={{ color: colors.dark.textSubtle }}>
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Main Dashboard Component
const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div 
      className="min-h-screen p-6"
      style={{ 
        background: `linear-gradient(135deg, ${colors.dark.bg} 0%, #0f0f23 50%, ${colors.dark.surface} 100%)`,
      }}
    >
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: `linear-gradient(45deg, ${colors.primary[500]}, ${colors.accent.purple})` }}
        />
        <div 
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: `linear-gradient(45deg, ${colors.accent.pink}, ${colors.accent.emerald})` }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <Header user={mockData.user} />

        {/* Stats Grid */}
        <StatsGrid stats={mockData.stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: colors.dark.text }}>
                My Courses
              </h2>
              <button 
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: colors.primary[400] }}
              >
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockData.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Upcoming Assignments */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.dark.text }}>
                Upcoming Assignments
              </h2>
              <div className="space-y-4">
                {mockData.assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Activity */}
            <RecentActivity />

            {/* Today's Schedule */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.dark.text }}>
                Today's Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.dark.bg }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: colors.dark.text }}>Advanced React</p>
                    <p className="text-xs" style={{ color: colors.dark.textSubtle }}>Dr. Smith</p>
                  </div>
                  <Badge variant="primary">2:00 PM</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.dark.bg }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: colors.dark.text }}>Study Group</p>
                    <p className="text-xs" style={{ color: colors.dark.textSubtle }}>Database Systems</p>
                  </div>
                  <Badge variant="default">4:30 PM</Badge>
                </div>
              </div>
            </Card>

            {/* Achievement Showcase */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.dark.text }}>
                Latest Achievement
              </h3>
              <div className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${colors.accent.orange}, ${colors.warning})` }}
                >
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold" style={{ color: colors.dark.text }}>
                  Quick Learner
                </h4>
                <p className="text-sm mt-1" style={{ color: colors.dark.textMuted }}>
                  Completed 3 modules in a week
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.accent.purple})`,
          boxShadow: `0 10px 25px -5px ${colors.primary[500]}60`
        }}
      >
        <Plus className="w-6 h-6 text-white mx-auto" />
      </button>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        @keyframes dropdownSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${colors.dark.bg};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${colors.dark.border};
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${colors.dark.borderFocus};
        }
      `}</style>
    </div>
  );
};

// Plus Icon Component
const Plus: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default StudentDashboard;
