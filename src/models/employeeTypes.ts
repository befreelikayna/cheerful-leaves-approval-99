
export interface Employee {
  id: number;
  name: string;
  cin?: string;
}

export interface LeaveFormData {
  employee: Employee | null;
  location: string;
  date: string;
  cin: string;
  company: string;
}
