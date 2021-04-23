import Logo from "./assets/icon.png";
import React from "react";
import { render } from "react-dom";
import "./styles/style.scss";

const App = () => {
    return (
        <>
            <h1>webpack app</h1>
            <p>base config</p>
            <hr />
            <div className="logo"></div>
            <div className="box">
                <h2>SASS</h2>
            </div>
        </>
    );
};

render(<App />, document.querySelector("#app"));
