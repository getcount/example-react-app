import React, { useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import Logo from '../../assets/images/count-logo.png';

const state = 'Hello_World';
const redirect = encodeURIComponent('http://localhost:3000/success');
const SignIn = () => {
  const [loading, setLoading] = useState(false);

  const callApi = async () => {
    setLoading(true);
    localStorage.setItem('state', state);
    const url = `https://dev-api.getcount.com/auth2/authorize-intiate?clientId=${process.env.REACT_APP_COUNT_CLIENT_ID}&redirectUri=${redirect}&state=${state}`;

    try {
      const response = await Axios.get(url, {
        credentials: 'include',
        redirect: 'manual',
      });
      setLoading(false);

      if (response?.data?.data?.redirectUri) {
        window.location.href = response?.data?.data?.redirectUri;
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message);
      console.error('Request failed:', err.message);
    }
  };

  return (
    <main className="bg-white dark:bg-black">
      <div className="relative md:flex">
        {/* Content */}
        <div className="w-full">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-end justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <img src={Logo} alt="logo" className="h-10 w-fit" />
              </div>
            </div>

            <div className="flex flex-col items-center text-black  max-w-[90dvw] sm:max-w-lg mx-auto w-full py-6 px-4 sm:px-8 sm:py-12 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md">
              <h1 className="text-3xl  font-bold mb-8 text-center">
                Click below to connect your COUNT workspace
              </h1>
              <button
                type="button"
                className="btn gap-2 !text-xl"
                onClick={callApi}
              >
                {loading ? (
                  <svg
                    className="animate-spin w-3.5 h-3.5 fill-current shrink-0 mr-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                    <path d="M9 12h6" />
                    <path d="M12 9v6" />
                  </svg>
                )}
                <span>Connect to COUNT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
