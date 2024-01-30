import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Signin.css'
import MicrosoftLoginButton from '../MicrosoftLoginButton';
import axios from 'axios';

function Signin({ onRouteChange, loadUser }) {

  const [signEmail, setEmail] = useState('');
  const [signPassword, setPassword] = useState('');

  const navigate = useNavigate();


  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }  

  const handleMicrosoftLogin = (response) => {
    // Handle successful Microsoft Login
    // You can retrieve the access token or ID token from the response
  };

    async function onSubmit() {
    let signUser = signEmail.toLowerCase()
    try {
      const formData = new URLSearchParams();
      formData.append('username', signUser);
      formData.append('password',signPassword);
      // Add more form parameters as needed
  
      // const response = await axios.post('http://localhost:5000/user/', formData.toString(), {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      // });
      // console.log('response', response)
      // Handle the response
      onRouteChange('home');
      navigate('/home');
      // if(response.data.message !== "password in incorrect" && response.data.message !== "user not found") {
      //   if(response.data.message === signUser)
      //     onRouteChange('home');
      //     navigate('/home');
      // }
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  }

  return (
    <div>
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <h1>NFRR Checklist Automation</h1>
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6 black" htmlFor="email">
                  Email
                </label>
                <input
                  onChange={onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  style={{color: "black"}}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6 black" htmlFor="password">
                  Password
                </label>
                <input
                  onChange={onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  style={{color: "black"}}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={onSubmit}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              {/* <MicrosoftLoginButton 
                className="f6 link dim black db pointer" 
                onSuccess={handleMicrosoftLogin} 
              /> */}
              {/* <p
                onClick={() => onRouteChange('register')}
                className="f6 link dim black db pointer"
              >
                Register
              </p> */}
            </div>
          </div>
        </main>
      </article>
    </div>
  );
}

export default Signin;