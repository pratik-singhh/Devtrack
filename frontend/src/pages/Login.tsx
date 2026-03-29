import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginRequest } from "../types";
import { AttemptLogin } from "../api/auth";
function Login() {
  let navigator = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: "",
    password: ""
  });


  const handleSubmit = async () => {
    setLoading(true);

    try {
      setError(null);
      const response = await AttemptLogin(credentials);
      const token = response.token;
      localStorage.setItem('token', (token));

      console.log(response);
      navigator("/dashboard")

    }
    catch (error) {
      setError("Invalid Credentials");
      console.error(error);
    }
    finally {

      setLoading(false);
    }
  }




  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="paper-container p-12 max-w-md w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-2 opacity-20 text-xs pointer-events-none">
          FORM-DT-2026<br />
          CONFIDENTIAL
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl mb-2">TaskMaster</h1>
          <p className="text-xs opacity-60 uppercase tracking-widest">Welcome Back</p>
          <div className="h-px bg-current opacity-20 w-full mt-4"></div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="flex flex-col">
            <label className="text-xs uppercase font-bold mb-1 opacity-70">Email:</label>
            <input 
              value={credentials.email} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials((prev) => ({ ...prev, email: (e.target.value) }))} 
              placeholder="Your email address" 
              className="input-typewriter w-full" 
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs uppercase font-bold mb-1 opacity-70">Secret Code:</label>
            <input 
              value={credentials.password} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials((prev) => ({ ...prev, password: (e.target.value) }))} 
              type="password" 
              placeholder="••••••••" 
              className="input-typewriter w-full" 
            />
          </div>

          {error && (
            <div className="text-red-800 text-xs font-bold uppercase text-center p-2 border border-red-800/20 bg-red-800/5 animate-pulse">
              [ ERROR ]: {error}
            </div>
          )}

          <div className="pt-4">
            <button 
              disabled={loading} 
              onClick={handleSubmit} 
              className="stamped-btn w-full"
            >
              {!loading ? "Enter" : "One moment..."}
            </button>
          </div>
        </div>

        <div className="mt-12 text-[10px] opacity-40 uppercase text-center leading-tight">
          TaskMaster Project Manager<br />
          Personal Use Only.
        </div>
      </div>
    </div>
  )
}

export default Login
