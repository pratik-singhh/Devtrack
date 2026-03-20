import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigator = useNavigate();

  const authError = () => {
    localStorage.removeItem('token');
    navigator("/");
  }



  const tokenVerify = () => {

    const token = localStorage.getItem('token');
    if (!token) {
      navigator("/");
      throw new Error("Bad Token");
    }
    else return token;
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigator("/");

  }

  return { authError, tokenVerify, logout };
}

