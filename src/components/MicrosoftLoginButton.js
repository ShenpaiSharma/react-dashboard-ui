// src/components/MicrosoftLoginButton.js
import React from 'react';
import { useNavigate } from "react-router-dom";
import { PublicClientApplication } from '@azure/msal-browser';

const MicrosoftLoginButton = () => {

  const navigate = useNavigate();

  const msalConfig = {
    auth: {
        clientId: 'afe22ca5-8e49-48be-88af-eb33fd4c5306', // Replace with your client ID
        authority: 'https://login.microsoftonline.com/383c3a06-b515-4d81-8253-4f0237d90053', // Replace with your tenant ID
        redirectUri: 'http://localhost:3000/home/', // Replace with your redirect URI
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
};

  const msalInstance = new PublicClientApplication(msalConfig);

  const handleLogin = async () => {
    const loginRequest = {
      scopes: ['openid', 'profile', 'User.Read'],
    };

    try {
      const response = await msalInstance.loginPopup(loginRequest);
      // Handle successful login
      if(response.accessToken) {
        window.location.href = "http://localhost:3000/home";
      }
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <div>
      <button 
        onClick={handleLogin}
        class="microsoft-auth-button"
      >
        Login with Microsoft
      </button>
    </div>
  );
};

export default MicrosoftLoginButton;
