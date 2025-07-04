// Student and Authentication Types
export interface Student {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  student_id: string;
  level: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  filiere: 'INFO' | 'MATH' | 'PHYS' | 'ECON' | 'GESTION' | 'DROIT';
  phone_number?: string;
  birth_date?: string;
  address?: string;
  profile_picture?: string;
  study_preferences: Record<string, any>;
  interests: string[];
  availability: Record<string, any>;
  profile?: StudentProfile;
}

export interface StudentProfile {
  gpa?: number;
  enrollment_year: number;
  expected_graduation: number;
  preferred_group_size: number;
  communication_preference: 'whatsapp' | 'telegram' | 'discord' | 'email';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

// Schedule Types
export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  professor: string;
  level: string;
  filiere: string;
}

export interface Schedule {
  id: string;
  course: Course;
  day_of_week: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  start_time: string;
  end_time: string;
  room: string;
  type: 'COURSE' | 'TD' | 'TP' | 'EXAM';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  course: Course;
  due_date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimated_hours: number;
  completed_at?: string;
}

export interface Exam {
  id: string;
  title: string;
  course: Course;
  exam_date: string;
  duration: string;
  room: string;
  type: 'MIDTERM' | 'FINAL' | 'QUIZ' | 'PRACTICAL';
  instructions?: string;
}

// Budget Types
export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface Budget {
  id: string;
  month: string;
  total_budget: number;
  scholarship: number;
  family_support: number;
  part_time_job: number;
  other_income: number;
  total_income: number;
  total_expenses: number;
  remaining_budget: number;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  payment_method: 'CASH' | 'CARD' | 'TRANSFER' | 'CHECK' | 'MOBILE';
  location?: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  description?: string;
  progress_percentage: number;
  monthly_savings_needed: number;
}

// Transport Types
export interface TransportProvider {
  id: string;
  name: string;
  provider_type: 'BUS' | 'TAXI' | 'SHARED_TAXI' | 'PRIVATE';
  phone_number: string;
  rating: number;
}

export interface Route {
  id: string;
  name: string;
  start_location: string;
  end_location: string;
  distance_km: number;
  estimated_duration: string;
}

export interface TransportSchedule {
  id: string;
  provider: TransportProvider;
  route: Route;
  departure_time: string;
  arrival_time: string;
  price: number;
  capacity: number;
}

export interface SharedRide {
  id: string;
  organizer: Student;
  start_location: string;
  end_location: string;
  departure_time: string;
  available_seats: number;
  price_per_person: number;
  description?: string;
  available_spots: number;
}

// Document Types
export interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  document_type: string;
  file: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'REJECTED' | 'ARCHIVED';
  issue_date?: string;
  expiry_date?: string;
  created_at: string;
  is_expired: boolean;
  expires_soon: boolean;
}

// Matching Types
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  course: Course;
  creator: Student;
  members: Student[];
  max_members: number;
  status: 'FORMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  study_type: 'EXAM_PREP' | 'HOMEWORK' | 'PROJECT' | 'GENERAL';
  meeting_frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  preferred_time: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'FLEXIBLE';
  avg_compatibility_score: number;
  is_full: boolean;
  available_spots: number;
}

export interface MatchingRequest {
  id: string;
  course: Course;
  preferred_group_size: number;
  study_type: string;
  availability: Record<string, any>;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'EXPIRED';
  matched_groups: StudyGroup[];
}

// Collaboration Types
export interface Forum {
  id: string;
  name: string;
  description: string;
  category: string;
  post_count: number;
  topic_count: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  topic_type: 'QUESTION' | 'DISCUSSION' | 'ANNOUNCEMENT' | 'STUDY_GROUP' | 'RESOURCE' | 'EVENT';
  author: Student;
  is_pinned: boolean;
  is_solved: boolean;
  views_count: number;
  likes_count: number;
  post_count: number;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: 'ACADEMIC' | 'SOCIAL' | 'STUDY_SESSION' | 'WORKSHOP' | 'CONFERENCE' | 'CULTURAL' | 'SPORTS' | 'OTHER';
  organizer: {
    id: string;
    name: string;
    avatar: string;
    level: string;
  };
  startDateTime: string;
  endDateTime: string;
  location: string;
  onlineLink?: string;
  maxAttendees?: number;
  currentAttendees: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  isFull: boolean;
  availableSpots?: number;
  tags: string[];
  price?: number;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  attendees: Array<{
    id: string;
    name: string;
    avatar: string;
    level: string;
  }>;
  requirements?: string[];
  created: string;
}

export interface TipShare {
  id: string;
  title: string;
  content: string;
  category: 'FOOD' | 'HOUSING' | 'TRANSPORT' | 'BOOKS' | 'ENTERTAINMENT' | 'SERVICES' | 'ACADEMIC' | 'OTHER';
  author: Student;
  location?: string;
  valid_until?: string;
  upvotes: number;
  downvotes: number;
  score: number;
  views_count: number;
  is_verified: boolean;
}

export interface Poll {
  id: string;
  question: string;
  description?: string;
  creator: Student;
  options: Array<{ text: string; votes: number }>;
  allows_multiple_choices: boolean;
  is_anonymous: boolean;
  expires_at?: string;
  total_votes: number;
  is_expired: boolean;
}

// Dashboard Types
export interface DashboardStats {
  total_courses: number;
  pending_assignments: number;
  upcoming_exams: number;
  budget_remaining: number;
  study_groups: number;
  upcoming_events: number;
  monthly_expenses: number;
  grade_average: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  is_important: boolean;
  created_at: string;
  link_url?: string;
  link_text?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  student_id: string;
  level: string;
  filiere: string;
  phone_number?: string;
  enrollment_year: number;
  expected_graduation: number;
}

export interface ExpenseForm {
  category: string;
  description: string;
  amount: number;
  date: string;
  payment_method: string;
  location?: string;
  notes?: string;
}

export interface StudyGroupForm {
  name: string;
  description: string;
  course: string;
  max_members: number;
  study_type: string;
  meeting_frequency: string;
  preferred_time: string;
}
