export enum UserRole {
  Client = 'CLIENT',
  Employee = 'EMPLOYEE',
  Corporate = 'CORPORATE',
  Admin = 'ADMIN',
}

export enum JobCategory {
  Maid = 'Maid',
  Cook = 'Cook',
  Chef = 'Chef',
  Cleaner = 'Cleaner',
  Driver = 'Driver',
  NurseAide = 'Nurse Aide',
  Gardener = 'Gardener',
  SecurityGuard = 'Security Guard',
  BabyMinder = 'Baby Minder',
}

export enum ApplicationStatus {
  NotApplied = 'Not Applied',
  Applied = 'Applied',
  Viewed = 'Viewed by Client',
  Interviewing = 'Interviewing',
  Offered = 'Offer Made',
  Rejected = 'Rejected',
  Completed = 'Completed',
}

export enum AvailabilityStatus {
  FullTime = 'Full-time',
  PartTime = 'Part-time',
  Contract = 'Contract',
  AvailableImmediately = 'Available Immediately',
  NotAvailable = 'Not Available',
}

export enum ReferralStatus {
  Pending = 'Pending',
  Completed = 'Completed',
}

export enum Language {
  English = 'English',
  Shona = 'Shona',
  Ndebele = 'Ndebele',
}

export enum Currency {
  USD = 'USD',
  ZAR = 'ZAR',
  RTGS = 'RTGS',
}

export enum BadgeType {
  TopRated = 'Top Rated',
  FivePlusJobsCompleted = '5+ Jobs Completed',
  ReferralStar = 'Referral Star',
  EliteWorker = 'Elite Worker',
  PoliceClearanceVerified = 'Police Clearance Verified',
  ReferenceChecked = 'Reference Checked',
  MedicalClearance = 'Medical Clearance',
  PremiumEmployee = 'Premium Employee',
}

export enum SubscriptionPlan {
  Basic = 'Basic',
  Premium = 'Premium',
}

export enum TimesheetStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Paid = 'Paid',
    Rejected = 'Rejected',
}

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Closed = 'Closed',
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}

export enum TicketCategory {
  Complaint = 'Complaint',
  TechnicalIssue = 'Technical Issue',
  PaymentQuery = 'Payment Query',
  FeatureRequest = 'Feature Request',
  Other = 'Other',
}

export enum DisputeStatus {
  Open = 'Open',
  UnderReview = 'Under Review',
  Resolved = 'Resolved',
}

export interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface EmployerReview {
  employeeId: number;
  jobId: number;
  rating: number;
  comment: string;
}

export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
}

export interface ClientProfile {
  id: number;
  name: string;
  profilePictureUrl: string;
  location: string;
  bio: string;
  householdDetails: {
    adults: number;
    children: number;
    pets: string;
  };
  preferredLanguage: Language;
  subscription: SubscriptionPlan;
  memberSince: string;
  hiredEmployeeIds: number[];
  hasPaidForAccess: boolean;
  viewedProfileCount: number;
  accessStartDate: string | null;
}

export interface CorporateProfile {
  id: number;
  companyName: string;
  industry: string;
  locations: string[];
}

export interface Document {
    type: 'ID' | 'Police Clearance' | 'Medical Certificate' | 'Reference Letter';
    url: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface EmployeeProfile {
  id: number;
  name: string;
  role: JobCategory;
  age: number;
  religion: string;
  location: string;
  experience: number; // in years
  rating: number;
  reviews: Review[];
  bio: string;
  skills: string[];
  certifications: string[];
  availability: AvailabilityStatus;
  languages: string[];
  verified: boolean;
  backgroundChecked: boolean;
  policeClearanceVerified: boolean;
  referenceChecked: boolean;
  medicalClearance: boolean;
  hasDriversLicense: boolean;
  hasDegreeOrDiploma: boolean;
  desiredSalary: number;
  desiredOffDays: number;
  referralCode: string;
  profilePictureUrl: string;
  videoIntroductionUrl?: string;
  emergencyContacts: EmergencyContact[];
  preferredLanguage: Language;
  completedJobs: number;
  badges: BadgeType[];
  documents: Document[];
}

export interface Job {
  id: number;
  clientId: number;
  title: string;
  category: JobCategory;
  clientName: string;
  location: string;
  salary: number; // per month
  hourlyRate?: number;
  duration: 'One-time' | 'Short-term' | 'Long-term';
  description: string;
  postedDate: string;
  currency: Currency;
  numberOfKids?: number;
  agesOfKids?: string;
  duties?: string[];
  numberOfRooms?: number;
}

export interface Notification {
  id: number;
  text: string;
  date: string;
  read: boolean;
}

export interface Referral {
  id: number;
  refereeName: string;
  status: ReferralStatus;
  reward: number; // in USD
  date: string;
}

export interface Timesheet {
  id: number;
  jobId: number;
  employeeId: number;
  employeeName: string;
  hoursWorked: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: Currency;
  status: TimesheetStatus;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  currency: Currency;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'Hire' | 'Timesheet' | 'Access';
  refundStatus?: 'Requested' | 'Approved' | 'Rejected';
  paymentConfirmationCode?: string;
}

export interface Message {
  id: number;
  senderId: number; // employee.id or client.id
  text: string;
  timestamp: string;
  language: Language;
}

export interface Conversation {
  id: number;
  clientId: number;
  employeeId: number;
  messages: Message[];
}

export interface TicketMessage {
  id: number;
  author: 'User' | 'Admin';
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: number;
  userId: number; // ID of the user who created it
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  assignedAdminId?: number;
  createdAt: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

export interface Dispute {
  id: number;
  clientId: number;
  employeeId: number;
  jobId: number;
  reason: string;
  clientStatement: string;
  employeeStatement: string;
  status: DisputeStatus;
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminUser {
    id: number;
    name: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  adminName: string;
  action: string;
  details: string;
}