import React from "react";
import { useRoutes } from "react-router-dom";
import { resourcePoolRouteObject } from "../constants/routeobject/routeobject";

const RouterComponent = () => {
  const theRoutes = useRoutes([...resourcePoolRouteObject]);
  return theRoutes;
};

export { RouterComponent };
