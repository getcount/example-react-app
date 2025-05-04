/* eslint-disable no-useless-escape */
import React, { useEffect } from 'react';
import './css/style.css';
import './css/utility-patterns.css';
import { useDispatch } from 'react-redux';
import { getUserDetails } from 'apis';
import Axios from 'axios';
import { setUser } from 'slices/UserReducer';
import Route from './routes';

// To fix IOS mobile input zoom in issue
const addMaximumScaleToMetaViewport = () => {
  const el = document.querySelector('meta[name=viewport]');

  if (el !== null) {
    let content = el.getAttribute('content');
    const re = /maximum\-scale=[0-9\.]+/g;

    if (re.test(content)) {
      content = content.replace(re, 'maximum-scale=1.0');
    } else {
      content = [content, 'maximum-scale=1.0'].join(', ');
    }

    el.setAttribute('content', content);
  }
};

function App() {
  const dispatch = useDispatch();

  const getConnectionDetail = async () => {
    try {
      const res = await Axios.get(
        `${process.env.REACT_APP_BASE_URL_API}/connection-details`,
      );
      console.log('accounts', res);
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    getConnectionDetail();
  }, []);

  const checkIsIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;

  const loadUserDetails = async () => {
    try {
      const userDetails = await getUserDetails();
      dispatch(setUser(userDetails));
      return userDetails;
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    // if (token) {
    //   loadUserDetails();
    // }
  }, []);

  useEffect(() => {
    if (checkIsIOS()) {
      disableIosTextFieldZoom();
    }
  }, []);

  return <Route />;
}

export default App;
