import React from 'react';
import Button from './Button/Button';
import Picture1 from './Pictu3.png';

const imageStyle = {
    width: '45vw', // 100% of viewport width
    height: '45vh', // 100% of viewport height
    objectFit: 'cover' // Ensures the image covers the entire container
};

function DashboardV2() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <img src={Picture1} alt="Description of the picture" style={imageStyle} />
        </div>
    );
}

export default DashboardV2;
