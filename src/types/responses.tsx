import { Employee, School } from "./school";

export interface Role {
  role: string;
  id: string;
}

export interface OfficeReferralCode {
    codeKey: number;
    codeName: string;
}

export interface GuidanceResponse {
  guidanceId: string;
  studentEmail: string;
  schoolName: string;
  timeCreated: null | [];
  teacherEmail: string;
  guidanceEmail: string;
  referralDescription: [string];
  status: string;
  notesArray: null | [];
  linkToPunishment: null | string;
  followUpDate: null | [];
}

export interface StudentResponse {
  studentIdNumber: string;
  address: string;
  schoolName: string;
  adminEmail: string | null;
  firstName: string;
  lastName: string;
  grade: string;
  notesArray: null | [];
  parentPhoneNumber: string;
  studentPhoneNumber: string;
  studentEmail: string;
  points: number;
}

export interface TeacherResponse {
  employeeId: string;
  schoolName: string;
  firstName: string;
  lastName: string;
  roles: null | [Role];
  currency: number;
  email: string;
}

export interface OfficeReferralResponse {
  officeReferralId: string;
  referralCode: OfficeReferralCode;
  studentEmail: string;
  adminEmail: string;
  teacherEmail: string;
  schoolName: string;
  status: string;
  closedExplanation: string;
  timeCreated: null | [];
  referralDescription: [string];
  followUpDate: null | [];
}

export interface TeacherReferral {
  punishmentId: string;
  studentEmail: string;
  schoolName: string;
  infractionName: string;
}

export interface StudentPunishment {
  data: TeacherReferral;
}

export interface TeacherDto {
  studentEmail: string;
  studentFirstName: string;
  studentLastName: string;
  infractionName: string;
  timeCreated: Date;
  infractionDescription: [string];
  teacherEmail: string;
  status: string;
  level: string;
}

export interface TeacherOverviewDto {
  punishmentResponse: TeacherDto;
  writeUpResponse: TeacherDto;
  shoutOutsResponse: TeacherDto;
  teacher: Employee;
  school: School;
}

export interface AdminOverviewDto {
  punishmentResponse: TeacherDto;
  writeUpResponse: TeacherDto;
  shoutOutsResponse: TeacherDto;
  teacher: Employee;
  school: School;
  teachers: Employee;
  officeReferrals: OfficeReferral;
}

export interface OfficeReferral {
  officeReferralId: string;
  referralCode: OfficeReferralCode;
  infractionLevel: string;
  studentEmail: string;
  adminEmail: string;
  schoolName: string;
  status: string;
  closedExplanation: string;
  timeCreated: Date;
  timeClosed: Date;
  classPeriod: string;
  isArchived: boolean;
  isStateFiled: boolean;
  stateIncidentNumber: string;
  archivedBy: string;
  archivedExplanation: string;
  archivedOn: Date;
  mapIndex: number;
  referralDescription: string;
}

export interface IncidentList {
  teacherName: string;
  posRatio: number;
}