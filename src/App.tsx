import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignIn } from './page/authentication/signin';
import { ForgotPassword } from './page/authentication/forgotpassword';
import { Verification } from './page/authentication/verification';
import { ResetPassword } from './page/authentication/resetpassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<SignIn />} />
        <Route path={"/forgot-password"} element={<ForgotPassword />} />
        <Route path={"/auth-verification/:id"} element={<Verification />} />
        <Route path={"/reset-password/:id"} element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
