import { useState } from "react";
import type { LoginRequest } from "../types";
import { AttemptLogin } from "../api/auth";
function Login() {
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
      localStorage.setItem('token', JSON.stringify(token));

      console.log(response);

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
    <div>

      <div className="gap-4 flex  flex-col justify-center items-center min-h-screen">

        <input value={credentials.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials((prev) => ({ ...prev, email: (e.target.value) }))} placeholder="Enter Email" className="p-2 border-2 m-4 rounded-lg max-w-xs" />
        <input value={credentials.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials((prev) => ({ ...prev, password: (e.target.value) }))} type="password" placeholder="Enter Password" className="p-2 border-2 m-4 rounded-lg max-w-xs" />
        {(error) &&

          <h1>{error}</h1>
        }

        <button disabled={loading} onClick={handleSubmit} className="border-2 p-2  rounded-md bg-gray-200">{!loading ? "Login" : "Logging In"}</button>
      </div>

    </div>
  )
}

export default Login
