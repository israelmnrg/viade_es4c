import React, {Fragment} from "react";
import {HashRouter, Switch} from "react-router-dom";

import {
	FriendsRoutes,
	Home,
	MyRoutes,
	NotFound,
	Profile,
	ShowRoute,
	Share,
	Notifications
} from "./containers";

import {PrivateLayout, PublicLayout} from "./layouts";


/**
 * Manages the BrowserRouter and so, all the route navigation
 * @returns {*}
 * @constructor
 */
const Routes = () => {
	return (
		<HashRouter>
			<Fragment>
				{/* Chooses the first route matching the direction and loads it */}
				<Switch>
					{
						/*
						  PublicLayout para rutas que se tienen que mostrar a todos los usuarios(estén o no loggeados)
						  NotLoggedInLayout para rutas que se tienen que mostrar a usuarios que NO están loggeados
						  PrivateLayout para rutas que se tienen que mostrar a usuarios que SI están loggeados
						*/
					}
					<PublicLayout component={Home} path="/" exact/> {/* Homepage - "/" */}
					<PrivateLayout component={FriendsRoutes} path="/friendsRoutes" exact/> {/* Friends - "/friends" */}
					<PrivateLayout component={Profile} path="/profile" exact/> {/* Profile - "/profile" */}
					<PrivateLayout component={MyRoutes} path="/myRoutes" exact/> {/* My Routes - "/myRoutes" */}
					<PrivateLayout component={ShowRoute} path="/showRoute/:share/:uri"/> {/* Show Route - "/showRoute..." */}
					<PrivateLayout component={Share} path="/share" exact /> {/* Share - "/share" */}
					<PrivateLayout component={Notifications} path="/notifications" exact /> {/* Notifications - "/notifications" */}
					<PublicLayout component={NotFound} path="*"/> {/* Error - "*" */}
				</Switch>
			</Fragment>
		</HashRouter>
	);
};


export default Routes;