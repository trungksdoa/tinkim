import { Groups } from "./Groups";
import { Departments } from "./department";

export interface Employee {
  id: number;
  code: string;
  password: string;  // Change from 'code' to 'password'
  username: string;
  email: string;
  gender?: string;
  avatar?: string;
  birthDate?: string | null;
  departmentId: number | null;
  groupId?: number | null;
  education?: string | null;
  expertise?: string | null;
  roleId?: number;
  isActive?: boolean;
  Department: {
    id: number;
    name: string;
  };
  MemberOf?: [{ id: Number; name: string }];
  Role?: {
    id: number;
    name: string;
  };
  EmploymentInformation?: EmploymentInformation;
  FinancialInformation?: FinancialInformation;
  PrivateInformation?: PrivateInformation;
}

export interface EmployeeResponse {
  message: string;
  data: Employee[];
}

export interface EmploymentInformation {
  id: number;
  userId: number;
  startDate: Date | null;
  referrer: string | null;
  contractSignDate: Date | null;
  applicationDate: Date | null;
  decisionSignDate: Date | null;
  decisionNumber: string | null;
  employmentStatus: string | null;
}

export interface FinancialInformation {
  id: number;
  userId: number;
  basicSalary: number | null;
  allowance: number | null;
  bankAccountNumber: string | null;
  bankBranch: string | null;
  bankName: string | null;
}

export interface PrivateInformation {
  id: number;
  userId: number;
  idCard1: string | null;
  idCard1IssueDate: Date | null;
  idCard1IssuePlace: string | null;
  idCard2: string | null;
  idCard2IssueDate: Date | null;
  idCard2IssuePlace: string | null;
  address: string | null;
  socialInsuranceNumber: string | null;
  phoneNumber: string | null;
  taxNumber: string | null;
}


export const createInitialEmployee = (): Employee => ({
  id: 0,
  code: "",
  username: "",
  email: "",
  password: "",  // Change from 'code' to 'password'
  gender: "",
  avatar: "",
  departmentId: null,
  birthDate: null,
  groupId: null,
  education: null,
  expertise: null,
  roleId: 0,
  isActive: true,
  Department: {
    id: 0,
    name: "",
  },
  MemberOf: [{ 
    id: Number(0),
    name: "" 
  }] as [{ id: Number; name: string }],
  Role: {
    id: 0,
    name: "user"
  },
  EmploymentInformation: {
    id: 0,
    userId: 0,
    startDate: null,
    referrer: null,
    contractSignDate: null,
    applicationDate: null,
    decisionSignDate: null,
    decisionNumber: null,
    employmentStatus: null
  },
  FinancialInformation: {
    id: 0,
    userId: 0,
    basicSalary: null,
    allowance: null,
    bankAccountNumber: null,
    bankBranch: null,
    bankName: null
  },
  PrivateInformation: {
    id: 0,
    userId: 0,
    idCard1: null,
    idCard1IssueDate: null,
    idCard1IssuePlace: null,
    idCard2: null,
    idCard2IssueDate: null,
    idCard2IssuePlace: null,
    address: null,

    socialInsuranceNumber: null,
    phoneNumber: null,
    taxNumber: null
  }
});