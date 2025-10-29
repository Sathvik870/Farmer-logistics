import React from "react";
import { useCustomerAuth } from "../../context/customer/useCustomerAuth.ts";

const ShoppingPage: React.FC = () => {
  const { isAuthenticated, customer } = useCustomerAuth();

  return (
    <div>
      <h1>Welcome to Our Store!</h1>
      {isAuthenticated && customer ? (
        <p>Hello, {customer.username}! Happy shopping.</p>
      ) : (
        <p>Please log in to see personalized offers.</p>
      )}
    </div>
  );
};

export default ShoppingPage;