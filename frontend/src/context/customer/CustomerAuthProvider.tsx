import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import api from "../../api";

import { CustomerAuthContext, type Customer } from "./CustomerAuthContext.ts";

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = Cookies.get("customerAuthToken");
      if (token) {
        try {
          const response = await api.get<Customer>("/api/customer/users/profile");
          setCustomer(response.data);
        } catch (error) {
          console.error("Failed to fetch customer profile", error);
          setCustomer(null);
          Cookies.remove("customerAuthToken");
        }
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (token: string) => {
    Cookies.set("customerAuthToken", token, { expires: 5 });
    try {
        const response = await api.get<Customer>("/api/customer/users/profile");
        setCustomer(response.data);
    } catch (error) {
        console.error("Failed to fetch customer profile after login", error);
    }
  };

  const logout = () => {
    Cookies.remove("customerAuthToken");
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{ isAuthenticated: !!customer, customer, isLoading, login, logout }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};