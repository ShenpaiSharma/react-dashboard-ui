import React, { Component } from 'react';
import {
    FaRegChartBar
}from "react-icons/fa";

import {
    BsGraphUpArrow
}from "react-icons/bs";

import {
    AiOutlineHome
}from "react-icons/ai";

import { NavLink } from 'react-router-dom';
import './css/sidebar.css'

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    // toggle = () => {
    //     this.setState(prevState => ({
    //         isOpen: !prevState.isOpen
    //     }));
    // };

    menuItem = [
        {
            path: "/home",
            name: "Dashboard",
            icon: <BsGraphUpArrow />
        },
        {
            path: "/delta",
            name: "Version2",
            icon: <FaRegChartBar />
        }
    ];

    render() {
        const { isOpen } = this.state;
        return (
            <div className="sidebar_container" >
                <div style={{ width: isOpen ? "200px" : "60px" }} className="sidebar">
                    <div className="top_section">
                        <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">Logo</h1>
                        <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                            {/* <FaBars onClick={this.toggle}/> */}
                            <AiOutlineHome />
                        </div>
                    </div>
                    {
                        this.menuItem.map((item, index) => (
                            <NavLink to={item.path} key={index} className="link">
                                <div className="icon">{item.icon}</div>
                                <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                            </NavLink>
                        ))
                    }
                </div>
                <main className='sidebar_main'>{this.props.children}</main>
            </div>
        );
    }
}

export default Sidebar;