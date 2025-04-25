import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlesubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://react-task-cyan-nine.vercel.app/login", {
        email,
        password,
      });
      if (response.data.status === true) {
        console.log('response.data.status: ', response.data.status);
        toast.success("Login Successfully")
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("userEmail", email)
        navigate("/")
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || 'Login failed');
      } else {
        toast.error('Login failed');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Log in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handlesubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input
                  type="email"
                  name="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
              <p className="text-sm font-light text-gray-500">
                Don't have an account yet? <a href="/sign-up" className="font-medium text-blue-600 hover:underline">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
