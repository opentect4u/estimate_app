import React, { lazy, Suspense } from "react";
import "primeicons/primeicons.css";
import { Skeleton } from "primereact/skeleton";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notfound from "./Screens/Notfound/Notfound";
import { Democontext, loadingContext } from "./Context/Democontext";
import Loader from "./Components/Loader";
import Noresult from "./Screens/Noresult/Noresult";
import Bill from "./Screens/Bill/Bill";
import BrandDetailsView from "./Screens/Master/Brand/BrandDetailsView";
import AddBrand from "./Screens/Master/Brand/AddBrand";
import BrandDetailsComp from "./Screens/Master/Brand/BrandDetailsComp";
import PioReport from "./Screens/Reports/PioReport";
import EmployeewiseSaleReport from "./Screens/Reports/EmployeewiseSaleReport";
import OutletAdminComp from "./Screens/OutletAdmin/OutletAdminComp";
import ProductwiseEstimate from "./Screens/OutletAdmin/Reports/ProductwiseEstimate";
import ReportsComp from "./Screens/OutletAdmin/Reports/ReportsComp";
import UserwiseEstimate from "./Screens/OutletAdmin/Reports/UserwiseEstimate";
import CancelledEstimate from "./Screens/OutletAdmin/Reports/CancelledEstimate";
import DueEstimate from "./Screens/OutletAdmin/Reports/DueEstimate";
import ItemDetailsBranchwise from "./Screens/Master/ItemDetailsBranchwise/ItemDetailsBranchwise";
import ItemDetailsViewBranchwise from "./Screens/Master/ItemDetailsBranchwise/ItemDetailsViewBranchwise";
import AddDetailsBranchwise from "./Screens/Master/ItemDetailsBranchwise/AddDetailsBranchwise";

const CategorywiseItemsComp = lazy(() =>
  import("./Screens/SuperAdmin/CategorywiseItems/CategorywiseItemsComp")
);
const CategorywiseItemsAdd = lazy(() =>
  import("./Screens/SuperAdmin/CategorywiseItems/CategorywiseItemsAdd")
);
const ManageStockComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageStock/ManageStockComp")
);
const ManageStockView = lazy(() =>
  import("./Screens/SuperAdmin/ManageStock/ManageStockView")
);
const ManageStockAdd = lazy(() =>
  import("./Screens/SuperAdmin/ManageStock/ManageStockAdd")
);
const StockReport = lazy(() => import("./Screens/Reports/StockReport"));
const ManageItemsComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageItems/ManageItemsComp")
);
const ManageItemsView = lazy(() =>
  import("./Screens/SuperAdmin/ManageItems/ManageItemsView")
);
const ManageItemsAdd = lazy(() =>
  import("./Screens/SuperAdmin/ManageItems/ManageItemsAdd")
);
const ManageItemsEdit = lazy(() =>
  import("./Screens/SuperAdmin/ManageItems/ManageItemsEdit")
);
const StockIn = lazy(() => import("./Screens/Stock/StockIn"));
const StockOut = lazy(() => import("./Screens/Stock/StockOut"));

const ManageCategoriesComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageCategories/ManageCategoriesComp")
);
const ManageCategoriesView = lazy(() =>
  import("./Screens/SuperAdmin/ManageCategories/ManageCategoriesView")
);
const ManageCategoriesAddEdit = lazy(() =>
  import("./Screens/SuperAdmin/ManageCategories/ManageCategoriesAddEdit")
);
const SettingsComp = lazy(() => import("./Screens/Settings/SettingsComp"));
const MasterComp = lazy(() => import("./Screens/Master/MasterComp"));
const ManageComp = lazy(() => import("./Screens/Manage/ManageComp"));
const ManageOutletsComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageOutlets/ManageOutletsComp")
);
const ManageOutletsView = lazy(() =>
  import("./Screens/SuperAdmin/ManageOutlets/ManageOutletsView")
);
const ManageOutletsAddEdit = lazy(() =>
  import("./Screens/SuperAdmin/ManageOutlets/ManageOutletsAddEdit")
);
const ManageHeaderFooterComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageHeaderFooter/ManageHeaderFooterComp")
);
const ManageHeaderFooterView = lazy(() =>
  import("./Screens/SuperAdmin/ManageHeaderFooter/ManageHeaderFooterView")
);
const ManageHeaderFooterAddEdit = lazy(() =>
  import("./Screens/SuperAdmin/ManageHeaderFooter/ManageHeaderFooterAddEdit")
);
const ManageSettingsComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageSettings/ManageSettingsComp")
);
const ManageSettingsView = lazy(() =>
  import("./Screens/SuperAdmin/ManageSettings/ManageSettingsView")
);
const ManageSettingsAddEdit = lazy(() =>
  import("./Screens/SuperAdmin/ManageSettings/ManageSettingsAddEdit")
);
const ManageUnitsComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageUnits/ManageUnitsComp")
);
const ManageUnitsView = lazy(() =>
  import("./Screens/SuperAdmin/ManageUnits/ManageUnitsView")
);
const ManageUnitsAddEdit = lazy(() =>
  import("./Screens/SuperAdmin/ManageUnits/ManageUnitsAddEdit")
);

// import RecoveryReport from "./Screens/Reports/RecoveryReport";
// import DueReport from "./Screens/Reports/DueReport";
// import CustomerLedger from "./Screens/Reports/CustomerLedger";
const root = ReactDOM.createRoot(document.getElementById("root"));
const Auth = lazy(() => import("./Screens/Auth/Auth"));
const Signin = lazy(() => import("./Screens/Auth/Signin"));
const Home = lazy(() => import("./Screens/Homescreen/Home"));
const HomeScreen = lazy(() => import("./Screens/Homescreen/HomeScreen"));
const Reports = lazy(() => import("./Screens/Reports/Reports"));
const SaleReport = lazy(() => import("./Screens/Reports/SaleReport"));
const BillingReport = lazy(() => import("./Screens/Reports/BillingReport"));
const PaymodeReport = lazy(() => import("./Screens/Reports/PaymodeReport"));
const Userwise = lazy(() => import("./Screens/Reports/Userwise"));
const Gststatement = lazy(() => import("./Screens/Reports/Gststatement"));
const Gstsummary = lazy(() => import("./Screens/Reports/Gstsummary"));
const RefundReport = lazy(() => import("./Screens/Reports/RefundReport"));
const CreditReport = lazy(() => import("./Screens/Reports/CreditReport"));

// import RecoveryReport from "./Screens/Reports/RecoveryReport";
// import DueReport from "./Screens/Reports/DueReport";
// import CustomerLedger from "./Screens/Reports/CustomerLedger";
const RecoveryReport = lazy(() => import("./Screens/Reports/RecoveryReport"));
const DueReport = lazy(() => import("./Screens/Reports/DueReport"));
const CustomerLedger = lazy(() => import("./Screens/Reports/CustomerLedger"));

const SearchComp = lazy(() => import("./Screens/Search/SearchComp"));
const Bydata = lazy(() => import("./Screens/Search/Bydata"));
const Byphone = lazy(() => import("./Screens/Search/Byphone"));
const Byprod = lazy(() => import("./Screens/Search/Byprod"));
const SuperAdminComp = lazy(() =>
  import("./Screens/SuperAdmin/SuperAdminComp")
);
const ManageOutlets = lazy(() =>
  import("./Screens/SuperAdmin/ManageOutlets/ManageOutletsComp")
);
const ManageShopsComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageShops/ManageShopsComp")
);
const ManageShopsView = lazy(() =>
  import("./Screens/SuperAdmin/ManageShops/ManageShopsView")
);
const ManageShopsAddEdit = lazy(() =>
  import("./Screens/SuperAdmin/ManageShops/ManageShopsAddEdit")
);
const ManageLocations = lazy(() =>
  import("./Screens/SuperAdmin/ManageLocations")
);
const ManageUsersComp = lazy(() =>
  import("./Screens/SuperAdmin/ManageUsers/ManageUsersComp")
);
const ManageUsersView = lazy(() =>
  import("./Screens/SuperAdmin/ManageUsers/ManageUsersView")
);
const ManageUsersAddEdit = lazy(() =>
  import("./Screens/SuperAdmin/ManageUsers/ManageUsersAddEdit")
);
const Settings = lazy(() => import("./Screens/Settings/Settings"));
const Unit = lazy(() => import("./Screens/Master/Unit"));
const ItemDetails = lazy(() =>
  import("./Screens/Master/Item Details/ItemDetails")
);
const ItemDetailsView = lazy(() =>
  import("./Screens/Master/Item Details/ItemDetailsView")
);
const AddDetails = lazy(() =>
  import("./Screens/Master/Item Details/AddDetails")
);
const PrintBill = lazy(() => import("./Screens/Search/PrintBill"));
const HeaderFooterComp = lazy(() =>
  import("./Screens/Settings/HeaderFooter/HeaderFooterComp")
);
const HeaderFooterView = lazy(() =>
  import("./Screens/Settings/HeaderFooter/HeaderFooterView")
);
const HeaderFooterEdit = lazy(() =>
  import("./Screens/Settings/HeaderFooter/HeaderFooterEdit")
);
const CustomerComp = lazy(() =>
  import("./Screens/Manage/Customer/CustomerComp")
);
const CustomerView = lazy(() =>
  import("./Screens/Manage/Customer/CustomerView")
);
const CustomerAddEdit = lazy(() =>
  import("./Screens/Manage/Customer/CustomerAddEdit")
);
const UserComp = lazy(() => import("./Screens/Manage/User/UserComp"));
const UserView = lazy(() => import("./Screens/Manage/User/UserView"));
const AddUser = lazy(() => import("./Screens/Manage/User/AddUser"));
const StockComp = lazy(() => import("./Screens/Stock/ManageStock/StockComp"));
const StockView = lazy(() => import("./Screens/Stock/ManageStock/StockView"));
const StockEdit = lazy(() => import("./Screens/Stock/ManageStock/StockEdit"));
const CategoryComp = lazy(() =>
  import("./Screens/Master/Categories/CategoryComp")
);
const CategoryView = lazy(() =>
  import("./Screens/Master/Categories/CategoryView")
);
const CategoryAdd = lazy(() =>
  import("./Screens/Master/Categories/CategoryAdd")
);
const Itemwise = lazy(() => import("./Screens/Reports/Itemwise"));
const DaybookReport = lazy(() => import("./Screens/Reports/DaybookReport"));
const CancelBillReport = lazy(() =>
  import("./Screens/Reports/CancelBillReport")
);
const OutletComp = lazy(() => import("./Screens/Manage/Outlet/OutletComp"));
const OutletView = lazy(() => import("./Screens/Manage/Outlet/OutletView"));
const OutletAddEdit = lazy(() =>
  import("./Screens/Manage/Outlet/OutletAddEdit")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Auth />,
        children: [
          {
            path: "",
            element: <Signin />,
          },
        ],
      },
      {
        path: "home",
        element: <Home />,

        children: [
          {
            path: "",
            element: <HomeScreen />,
            // redirect: "report",
            // redirect: "report/daybook",
          },
          {
            path: "report",

            element: <Reports />,
            children: [
              {
                path: "salereport",
                element: <SaleReport />,
              },
              {
                path: "billreport",
                element: <BillingReport />,
              },
              {
                path: "paymode",
                element: <PaymodeReport />,
              },
              {
                path: "userwise",
                element: <Userwise />,
              },
              {
                path: "gststatement",
                element: <Gststatement />,
              },
              {
                path: "gstsummary",
                element: <Gstsummary />,
              },
              {
                path: "refundreport",
                element: <RefundReport />,
              },
              {
                path: "creditreport",
                element: <CreditReport />,
              },
              {
                path: "itemwisereport",
                element: <Itemwise />,
              },
              {
                path: "daybook",
                element: <DaybookReport />,
              },
              {
                path: "cancelbill",
                element: <CancelBillReport />,
              },
              {
                path: "recoveryreport",
                element: <RecoveryReport />,
              },
              {
                path: "duereport",
                element: <DueReport />,
              },
              {
                path: "customerledger",
                element: <CustomerLedger />,
              },
              {
                path: "stockreport",
                element: <StockReport />,
              },
              {
                path: "pioreport",
                element: <PioReport />,
              },
              {
                path: "employeewisereport",
                element: <EmployeewiseSaleReport />,
              },
            ],
          },
          {
            path: "search",

            element: <SearchComp />,
            children: [
              {
                path: "bydate",
                element: <Bydata />,
              },
              {
                path: "byphone",
                element: <Byphone />,
              },
              {
                path: "byproduct",
                element: <Byprod />,
              },
              {
                path: "printbill/:id/:user",
                element: <PrintBill />,
              },
            ],
          },
          {
            path: "superadmin",

            element: <SuperAdminComp />,
            children: [
              {
                path: "manageshops",
                element: <ManageShopsComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageShopsView />,
                  },
                  {
                    path: "manageshop/:id",
                    element: <ManageShopsAddEdit />,
                  },
                ],
              },
              {
                path: "manageoutlets",
                element: <ManageOutletsComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageOutletsView />,
                  },
                  {
                    path: "manageoutlet/:id/:id2",
                    element: <ManageOutletsAddEdit />,
                  },
                ],
              },
              {
                path: "manageusers",
                element: <ManageUsersComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageUsersView />,
                  },
                  {
                    path: "manageuser/:id",
                    element: <ManageUsersAddEdit />,
                  },
                ],
              },
              {
                path: "manageheaderfooters",
                element: <ManageHeaderFooterComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageHeaderFooterView />,
                  },
                  {
                    path: "manageheaderfooter/:id",
                    element: <ManageHeaderFooterAddEdit />,
                  },
                ],
              },
              {
                path: "managesettings",
                element: <ManageSettingsComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageSettingsView />,
                  },
                  {
                    path: "managesetting/:id",
                    element: <ManageSettingsAddEdit />,
                  },
                ],
              },
              {
                path: "manageunits",
                element: <ManageUnitsComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageUnitsView />,
                  },
                  {
                    path: "manageunit/:id/:id2",
                    element: <ManageUnitsAddEdit />,
                  },
                ],
              },
              {
                path: "managecategories",
                element: <ManageCategoriesComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageCategoriesView />,
                  },
                  {
                    path: "managecategory/:id/:id2",
                    element: <ManageCategoriesAddEdit />,
                  },
                ],
              },
              {
                path: "categorywiseitems",
                element: <CategorywiseItemsComp />,
                children: [
                  {
                    path: "add",
                    element: <CategorywiseItemsAdd />,
                  },
                ],
              },
              {
                path: "manageitems",
                element: <ManageItemsComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageItemsView />,
                  },
                  {
                    path: "manageitemadd",
                    element: <ManageItemsAdd />,
                  },
                  {
                    path: "manageitemedit/:id/:id2/:id3",
                    element: <ManageItemsEdit />,
                  },
                ],
              },
              {
                path: "managestock",
                element: <ManageStockComp />,
                children: [
                  {
                    path: "view",
                    element: <ManageStockView />,
                  },
                  {
                    path: "managestockadd",
                    element: <ManageStockAdd />,
                  },
                  // {
                  //   path: "manageitemedit/:id/:id2/:id3",
                  //   element: <ManageItemsEdit />,
                  // },
                ],
              },
              {
                path: "managelocations",
                element: <ManageLocations />,
              },
            ],
          },
          {
            path: "outletadmin",

            element: <OutletAdminComp />,
            children: [
              {
                path: "reports",
                element: <ReportsComp />,
                children: [
                  {
                    path: "productwiseestimate",
                    element: <ProductwiseEstimate />,
                  },
                  {
                    path: "userwiseestimate",
                    element: <UserwiseEstimate />,
                  },
                  {
                    path: "cancelledestimate",
                    element: <CancelledEstimate />,
                  },
                  {
                    path: "dueestimate",
                    element: <DueEstimate />,
                  },
                ],
              },
            ],
          },

          // {
          //   path: "itemdetails",

          //   element: <ItemDetails />,
          //   children: [
          //     {
          //       path: "view",
          //       element: <ItemDetailsView />,
          //     },
          //     {
          //       path: "adddetails/:id",
          //       element: <AddDetails />,
          //     },
          //   ],
          // },
          // {
          //   path: "headerfooter",

          //   element: <HeaderFooterComp />,
          //   children: [
          //     {
          //       path: "view",
          //       element: <HeaderFooterView />,
          //     },
          //     {
          //       path: "hfdetails",
          //       element: <HeaderFooterEdit />,
          //     },
          //   ],
          // },

          // {
          //   path: "customer",

          //   element: <CustomerComp />,
          //   children: [
          //     {
          //       path: "view",
          //       element: <CustomerView />,
          //     },
          //     {
          //       path: "custEdit/:id",
          //       element: <CustomerAddEdit />,
          //     },
          //   ],
          // },
          // {
          //   path: "usermng",

          //   element: <UserComp />,
          //   children: [
          //     {
          //       path: "view",
          //       element: <UserView />,
          //     },
          //     {
          //       path: "usermngadd",
          //       element: <AddUser />,
          //     },
          //   ],
          // },
          // {
          //   path: "stock",

          //   element: <StockComp />,
          //   children: [
          //     {
          //       path: "view",
          //       element: <StockView />,
          //     },
          //     {
          //       path: "stockedit/:id/:br_id",
          //       element: <StockEdit />,
          //     },
          //   ],
          // },
          {
            path: "settings",

            element: <SettingsComp />,
            children: [
              {
                path: "settingsmain",
                element: <Settings />,
              },
              {
                path: "headerfooter",

                element: <HeaderFooterComp />,
                children: [
                  {
                    path: "view",
                    element: <HeaderFooterView />,
                  },
                  {
                    path: "hfdetails",
                    element: <HeaderFooterEdit />,
                  },
                ],
              },
            ],
          },
          {
            path: "master",

            element: <MasterComp />,
            children: [
              {
                path: "unit",
                element: <Unit />,
              },
              {
                path: "category",
                element: <CategoryComp />,
                children: [
                  {
                    path: "view",
                    element: <CategoryView />,
                  },
                  {
                    path: "categoryedit/:id",
                    element: <CategoryAdd />,
                  },
                ],
              },
              {
                path: "brand",
                element: <BrandDetailsComp />,
                children: [
                  {
                    path: "view",
                    element: <BrandDetailsView />,
                  },
                  {
                    path: "brandedit/:id",
                    element: <AddBrand />,
                  },
                ],
              },
              {
                path: "itemdetails",

                element: <ItemDetails />,
                children: [
                  {
                    path: "view",
                    element: <ItemDetailsView />,
                  },
                  {
                    path: "adddetails/:id",
                    element: <AddDetails />,
                  },
                ],
              },
              {
                path: "itemdetailsbranchwise",

                element: <ItemDetailsBranchwise />,
                children: [
                  {
                    path: "view",
                    element: <ItemDetailsViewBranchwise />,
                  },
                  {
                    path: "adddetailsbranchwise/:id/:id2",
                    element: <AddDetailsBranchwise />,
                  },
                ],
              },
            ],
          },
          {
            path: "manage",

            element: <ManageComp />,
            children: [
              {
                path: "customer",

                element: <CustomerComp />,
                children: [
                  {
                    path: "view",
                    element: <CustomerView />,
                  },
                  {
                    path: "custEdit/:id",
                    element: <CustomerAddEdit />,
                  },
                ],
              },
              {
                path: "outlet",
                element: <OutletComp />,
                children: [
                  {
                    path: "view",
                    element: <OutletView />,
                  },
                  {
                    path: "outletaddedit/:id",
                    element: <OutletAddEdit />,
                  },
                ],
              },
              {
                path: "usermng",

                element: <UserComp />,
                children: [
                  {
                    path: "view",
                    element: <UserView />,
                  },
                  {
                    path: "usermngadd",
                    element: <AddUser />,
                  },
                ],
              },
              // {
              //   path: "stock",

              //   element: <StockComp />,
              //   children: [
              //     {
              //       path: "view",
              //       element: <StockView />,
              //     },
              //     {
              //       path: "stockedit/:id/:br_id",
              //       element: <StockEdit />,
              //     },
              //   ],
              // },
            ],
          },
          {
            path: "stock",

            element: <StockComp />,
            children: [
              // {
              //   path: "stockview",

              //   element: <StockComp />,
              //   children: [
              //     {
              //       path: "view",
              //       element: <StockView />,
              //     },
              //     {
              //       path: "stockedit/:id/:br_id",
              //       element: <StockEdit />,
              //     },
              //   ],
              // },
              {
                path: "stockin",
                element: <StockIn />,
              },
              {
                path: "stockout",
                element: <StockOut />,
              },
            ],
          },

          // {
          //   path: "unit",
          //   element: <Unit />,
          // },
          // {
          //   path: "category",
          //   element: <CategoryComp />,
          //   children: [
          //     {
          //       path: "view",
          //       element: <CategoryView />,
          //     },
          //     {
          //       path: "categoryedit/:id",
          //       element: <CategoryAdd />,
          //     },
          //   ],
          // },
          // {
          //   path: "outlet",
          //   element: <OutletComp />,
          //   children: [
          //     {
          //       path: "view",
          //       element: <OutletView />,
          //     },
          //     {
          //       path: "outletaddedit/:id",
          //       element: <OutletAddEdit />,
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
  {
    path: "bill/:id",
    element: <Bill />,
  },
  {
    path: "noresult/:code/:msg",
    element: <Noresult />,
  },
  {
    path: "*",
    element: <Notfound />,
  },
]);

root.render(
  <Democontext>
    <Suspense
      fallback={
        <>
          {/* <Skeleton className='mt-12 mx-16' title={true} paragraph={true} rows={10} active size={'large'} />
    <Skeleton className='mt-12 mx-16' title={true} paragraph={true} rows={10} active size={'large'} />
    <Skeleton className='mt-12 mx-16' title={true} paragraph={true} rows={10} active size={'large'} />
     */}
          <Skeleton className="mb-2 w-full" height="6rem"></Skeleton>
          <div className="flex">
            <Skeleton
              className="sm:block hidden"
              height="100rem"
              width="22rem"></Skeleton>
            <Skeleton className="sm:ml-8 m-1 w-96" height="40rem"></Skeleton>
          </div>
        </>
      }>
      <Loader />
      <RouterProvider router={router} />
    </Suspense>
  </Democontext>
);

{
  /* <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode> */
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
