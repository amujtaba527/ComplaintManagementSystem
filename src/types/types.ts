export type UserRole = "admin" | "employee";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; 
  role: UserRole;
  created_at: string;
}

export interface Complaint {
  id: number;
  user_id: number;
  building: string; 
  floor: string; 
  area_name: string; 
  complaint_type_name: string; 
  details: string;
  status: "In-Progress" | "Resolved";
  created_at: string;
  resolution_date: string | null; 
}

export interface ComplaintType {
  id: number;
  type_name: string; 
}

export interface Area {
  id: number;
  area_name: string; 
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

