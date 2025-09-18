import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerLogin from "./CustomerLogin";
import CustomerSignUp from "./CustomerSignUp";
import CustomerForgot from "./CustomerForgotPassword";
import CustomerResetPassword from "./CustomerResetPassword";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerLogin />} />
        <Route path="/signup" element={<CustomerSignUp />} />
        <Route path="/forgot-password" element={<CustomerForgot/>}/>
        <Route path="/create-password" element={<CustomerResetPassword/>}/>
      </Routes>
    </Router>
  );
};

export default App;
