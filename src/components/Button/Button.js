import React from "react";
import './Button.css'


function Button(props) {
    return (
        <button
            style={{fontSize: '15px', marginBottom: '2px', cursor: 'pointer', marginRight: '50px'}}
            className="btn btn-success btn-sm"
            onClick={props.function}
            >{props.name}
        </button>
    )
}

export default Button;