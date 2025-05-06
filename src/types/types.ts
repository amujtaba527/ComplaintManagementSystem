export type UserRoleType = "admin" | "employee" | "owner" | "manager" | "it_manager";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; 
  role: UserRoleType;
  created_at?: string;
}

export interface Complaint {
  date : string;
  id: number;
  user_id: number;
  building: string; 
  floor: string; 
  area_id?: number ;
  area_name: string; 
  complaint_type_id?: number ;
  complaint_type_name: string; 
  details: string;
  status: "In-Progress" | "Resolved" | "No Complaint";
  created_at: string;
  action: string | null;
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

