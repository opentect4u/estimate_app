import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";
import { ScrollTop } from "primereact/scrolltop";
import { BreadCrumb } from "primereact/breadcrumb";
import { useLocation } from "react-router-dom";
import SidebarComp from "../../Components/Sidebar";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../../Components/Error";
import { useNavigate } from "react-router-dom";
import { pathMap } from "../../Assets/Data/BreadCrumbMap";

import Background from "../../Assets/Images/bg.jpg";

function Home() {
  let pathnames = [];
  const location = useLocation();
  const paths = location.pathname.split("/");
  const navigate = useNavigate();

  paths.forEach(
    (e) =>
      isNaN(e) &&
      e != "view" &&
      e != "undefined" &&
      pathnames.push({ label: pathMap[e] })
  );

  useEffect(() => {
    console.log(!localStorage.getItem("email_id"));
    if (!localStorage.getItem("email_id")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div>
        {localStorage.getItem("email_id") && <Header />}
        {localStorage.getItem("email_id") && <SidebarComp />}

        <div className="p-6 sm:ml-64 bg-blue-300 min-h-screen">
          <div
            className={
              pathnames.length != 1
                ? "border-2 h-auto p-3 bg-white border-white shadow-lg rounded-xl dark:border-gray-700 "
                : "border-2 h-auto p-3 bg-blue-300 border-blue-300 rounded-xl dark:border-gray-700"
            }
            style={
              {
                // background: `url(${Background})`,
              }
            }>
            {pathnames?.length > 1 && (
              <BreadCrumb model={pathnames} className="text-xs" />
            )}
            <ErrorBoundary
              FallbackComponent={Error}
              onError={(error) => {
                console.error(error);
              }}>
              <ScrollTop style={{ backgroundColor: "#404198" }} />

              <Outlet />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
