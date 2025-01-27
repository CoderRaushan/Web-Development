import React, { useState } from 'react';
import Cookies from 'js-cookie';

const CookieManager = () => {
  const [cookieValue, setCookieValue] = useState(Cookies.get('username') || '');

  // Function to set a cookie
  const handleSetCookie = () => {
    Cookies.set('username', 'Raushan', { expires: 7 });
    setCookieValue(Cookies.get('username'));
    alert('Cookie has been set');
  };

  // Function to get the cookie value
  const handleGetCookie = () => {
    const value = Cookies.get('username');
    const val2=Cookies.get('jwt'); 
    setCookieValue(value || 'No cookie found');
    alert(`Cookie value: ${ val2}`);
  };

  // Function to remove the cookie
  const handleRemoveCookie = () => {
    Cookies.remove('username');
    setCookieValue('');
    alert('Cookie has been removed');
  };

  return (
    <div>
      <h2>Cookie Manager</h2>
      <p>Current Cookie Value: {cookieValue || 'No cookie set'}</p>
      <button onClick={handleSetCookie}>Set Cookie</button>
      <button onClick={handleGetCookie}>Get Cookie</button>
      <button onClick={handleRemoveCookie}>Remove Cookie</button>
    </div>
  );
};

export default CookieManager;
