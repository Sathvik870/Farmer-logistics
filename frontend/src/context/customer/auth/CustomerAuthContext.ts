import { createContext} from "react";

export interface Customer {
  customer_id: number;
  customer_code: string;
  username: string | null;
  gender: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
}

export interface CustomerAuthContextType {
  isAuthenticated: boolean;
  customer: Customer | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);