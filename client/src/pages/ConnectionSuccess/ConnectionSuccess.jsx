import React, { useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../assets/images/count-logo.png';

const ConnectionSuccess = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);

  // Example: for URL ?name=John&age=30
  const code = params.get('code'); // "John"
  const stateParam = params.get('state'); // "30"

  const onExchangeCode = async () => {
    const state = localStorage.getItem('state');
    if (state === stateParam) {
      try {
        const response = await Axios.post(
          `${process.env.REACT_APP_BASE_URL_API}/exchange-code`,
          {
            code,
          },
        );
        localStorage.removeItem('state');
        if (response?.data?.data?.data?.workspaceId) {
          localStorage.setItem(
            'workspaceId',
            response?.data?.data?.data?.workspaceId,
          );
          toast.success('COUNT authorized successfully');
          navigate('/');
        }
      } catch (e) {
        toast.error(e?.response?.data?.message);
        console.log('Exchange token failed');
      }
    } else {
      navigate('/signin');
      toast.error('Invalid Secret State');
    }
  };

  useEffect(() => {
    if (stateParam && code) {
      onExchangeCode();
    }
  }, [stateParam, code]);

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
                Verifying Connection
              </h1>
              <div className="btn gap-2 !text-xl">
                <svg
                  className="animate-spin w-3.5 h-3.5 fill-current shrink-0 mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                </svg>
                <span>Please Wait</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConnectionSuccess;
