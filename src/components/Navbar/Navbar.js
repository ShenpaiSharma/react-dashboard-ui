import React from 'react';
import { useNavigate } from "react-router-dom";

const Navigation = ({ onRouteChange, isSigned }) => {
  const navigate = useNavigate();

  function onSubmit() {
    onRouteChange('signout');
    navigate('/');
  }

  if (isSigned) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end', margin: 0, paddingLeft: 10 }}>
        <p onClick={onSubmit} className='f3 link dim black underline pa3 pointer' style={{ margin: '2px', padding: 0, fontSize: '20px' }}>Sign Out</p>
      </nav>
    );
  } else {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end', margin: 0, paddingRight: 10 }}>
        <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer' style={{ margin: 0, padding: 0 }}>Sign In</p>
        {/* <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer' style={{ margin: 0, padding: 0 }}>Register</p> */}
      </nav>
    );
  }
}

export default Navigation;
