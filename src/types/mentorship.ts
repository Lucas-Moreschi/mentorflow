export type MentorshipStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export type UserRole = "STUDENT" | "MENTOR";

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface StudentProfileData {
  id: string;
  userId: string;
  bio: string | null;
  goals: string;
  currentRole: string | null;
  desiredRole: string | null;
  skills: string[];
  areasOfInterest: string[];
  linkedinUrl: string | null;
  githubUrl: string | null;
}

export interface MentorProfileData {
  id: string;
  userId: string;
  bio: string | null;
  expertise: string;
  skills: string[];
  areasOfExpertise: string[];
  yearsExperience: number;
  currentRole: string | null;
  company: string | null;
  maxStudents: number;
  linkedinUrl: string | null;
  githubUrl: string | null;
  averageRating: number;
  totalReviews: number;
}

export interface MentorWithProfile extends UserPublic {
  mentorProfile: MentorProfileData | null;
}

export interface StudentWithProfile extends UserPublic {
  studentProfile: StudentProfileData | null;
}

export interface MentorMatch {
  mentor: MentorWithProfile;
  matchScore: number;
  explanation: string;
}

export interface MentorshipData {
  id: string;
  studentId: string;
  mentorId: string;
  status: MentorshipStatus;
  message: string | null;
  topic: string | null;
  rejectionReason: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  student: UserPublic;
  mentor: UserPublic;
}

export interface MessageData {
  id: string;
  mentorshipId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface FeedbackData {
  id: string;
  mentorshipId: string;
  reviewerId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}
