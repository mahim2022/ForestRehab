import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./components/About/About";
// import Home from "./components/Home/home";
import CommunityEngament from "./components/CommunityEngagement/CommunityEngament";
import ReportDeforestation from "./components/ReportDeforestation/ReportDeforestation";
import KnowledgeHub from "./components/KnowledgeHub/KnowledgeHub";
import NewsUpdate from "./components/NewsUpdate/NewsUpdate";
import ReforestationProject from "./components/ReforestationProjects/ReforestationProject";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import SignIn from "./components/SignIn/SignIn";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignUp from "./components/Signup/Signup";
import LandingPage from "./components/LandingPage/LandingPage";
import Contact from "./components/Contact/Contact";
import ReportForm from "./components/ReportForm/ReportForm";
// import TestApp from "./TestApp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "report",
        element: <ReportDeforestation />,
      },
      {
        path: "community",
        element: <CommunityEngament />,
      },
      {
        path: "knowledge",
        element: <KnowledgeHub />,
      },
      {
        path: "news",
        element: <NewsUpdate />,
      },
      {
        path: "project",
        element: <ReforestationProject />,
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "reportForm",
        element: <ReportForm />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
