import React from "react";
import {Link, NavLink} from "react-router-dom";

/**
 * 404 Page
 * @returns {*}
 * @constructor
 */
const NotFoundComponent = () => {
	return (
		<div className="ErrorImage">
			<NavLink to="/">
				<img src={process.env.PUBLIC_URL + "/img/error404.jpg"} alt="error" height="50%" width="50%"/>
			</NavLink>
			<p style={{textAlign: "center"}}>
				<Link to="/">Go back Home </Link>
			</p>
		</div>
	);
};

export default NotFoundComponent;
