export interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  series?: {
    value: number | null;
    isApproved: boolean;
    pendingApproval: boolean;
  };
  position?: {
    value: 'student' | 'professor' | 'associate_professor' | 'assistant_professor' | 'lecturer' | 'lab_assistant' | 'staff' | null;
    isApproved: boolean;
    pendingApproval: boolean;
  };
  department?: {
    value: 'CSE' | 'EEE' | 'ME' | 'CE' | 'IPE' | 'GCE' | 'MTE' | 'ETE' | 'CFPE';
    isApproved: boolean;
    pendingApproval: boolean;
  };
  verificationDocument?: string[];
  groups?: string[];
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// Position type extracted for reuse
export type PositionType = 'student' | 'professor' | 'associate_professor' | 'assistant_professor' | 'lecturer' | 'lab_assistant' | 'staff';

// Department type extracted for reuse
export type DepartmentType = 'CSE' | 'EEE' | 'ME' | 'CE' | 'IPE' | 'GCE' | 'MTE' | 'ETE' | 'CFPE';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UsersResponse {
  statusCode: number;
  message: string;
  payload: {
    users: User[];
    pagination: {
      totalpages: number;
      currentPage: number;
      previousPage: number | null;
      nextPage: number | null;
    }
  }
}

export interface UserResponse {
  statusCode: number;
  message: string;
  payload: {
    user: User;
  }
}

export interface UpdateUserParams {
  username?: string;
  password?: string;
  bio?: string;
  series?: {
    value: number | null;
    pendingApproval?: boolean;
  };
  position?: {
    value: PositionType | null;
    pendingApproval?: boolean;
  };
  department?: {
    value: DepartmentType;
    pendingApproval?: boolean;
  };
}

export interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgetPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyAccountParams {
  token: string;
}
