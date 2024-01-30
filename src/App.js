import React, { useEffect, useState } from 'react';
import './App.css';
// import Dashboard from './components/Dashboard';
// import DashboardV2 from './components/DashboardV2';
// import Dashboardv2 from './components/Pages/DashboardV2';
import ValidationApp from './components/ValidationApp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Signin from './components/Signin/Signin'
import Navigation from './components/Navbar/Navbar'
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';
import 'tachyons';
import { LicenseManager } from 'ag-grid-enterprise';
import axios from 'axios';

const licenseKey = process.env.REACT_APP_KEY;
LicenseManager.setLicenseKey(licenseKey);


function App() {
  const [route, setRoute] = useState('signout');
  const [brands, setBrands] = useState(null);
  // const [brandsv2, setBrandsv2] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isSigned, setIsSigned] = useState(false);

  const [brandsFetched, setBrandsFetched] = useState(false);

  useEffect(() => {
    if (brands === null) {
      // getBrands();
    }
    // if (brandsv2 === null) {
    //   getBrandsv2();
    // }
    if (window.location.href.includes('/home') || window.location.href.includes('/delta')) {
      setRoute('home');
      setIsSigned(true);
    }
  }, []);


  function onRouteChange(route) {
    if (route === 'signout') {
      setIsSigned(false);
    } else if (route === 'home') {
        setIsSigned(true);
    }
    setRoute(route);
  }

  // async function getBrands() {
  //   const resp = await axios.get('http://localhost:8080/api/v1/metadata/distinct/')
  //   const brandArr = resp.data['brands'].sort()
  //   const brand = brandArr[0]
  //   const metadata = await axios.get('http://localhost:8080/api/v1/metadata/?key=' + brand.replaceAll(' ', '%20').replaceAll('&', '%26'))
  //   setMetadata(metadata.data)
  //   setBrands(resp.data)  
  // }

  // async function getBrandsv2() {
  //   const resp = await axios.get('http://localhost:4000/api/v2/metadata/distinct/')
  //   const brand = resp.data['brands'][0]
  //   const metadata = await axios.get('http://localhost:4000/api/v2/metadata/?key=' + brand.replaceAll(' ', '%20').replaceAll('&', '%26'))
  //   setMetadata(metadata.data)
  //   setBrandsv2(resp.data)
  // }
  
  return (
    <div>
      {route === 'home' || window.location.href.includes('/home') || window.location.href.includes('/delta') ? (
        <Sidebar>
          <Navigation onRouteChange={onRouteChange} isSigned={isSigned} />
          <Routes>
            <Route
              path="/home"
              // element={<DashboardV2 brands={brandsv2} brand={brandsv2['brands'][0]} baseApiURL="http://localhost:4000/api/v2" />}
              element={<ValidationApp />}
            />
            {/* <Route
              path="/delta"
              // element={<Dashboard brands={brands} brand={brands['brands'][0]} baseApiURL="http://localhost:8080/api/v1" />}
              element={<DashboardV2 brands={brandsv2} brand={brandsv2['brands'][0]} baseApiURL="http://localhost:4000/api/v2" />}

            /> */}
          </Routes>
        </Sidebar>
      ) : route === 'signout' ? (
        <div>
          {/* <Navigation onRouteChange={onRouteChange} isSigned={isSigned} /> */}
          <Signin onRouteChange={onRouteChange} />
        </div>
      ) : null}
    </div>
  );
}

export default App;
