import React from "react";

const DashboardCard = ({
  header,
  body,
  footerNumber,
  footerText,
  borderColor = "",
  primaryTextColor,
  secondaryColor,
  svg,
}) => {
  return (
    <div className="transition-all hover:-translate-y-4 hover:scale-105 duration-300 cursor-pointer">
      <div
        className={`card mb-0 ${svg} bg-no-repeat bg-cover bg-white p-6 rounded-xl shadow-2xl hover:border-t-8 active:border-t-4 hover:${borderColor} active:rounded-3xl transition-all duration-300 active:scale-90 active:font-extralight`}>
        <div className="flex justify-between mb-3 gap-4">
          <div>
            <span className="block text-gray-600 text-normal font-sans font-bold mb-3">
              {header}
            </span>
            <div className="text-2xl font-bold">{body}</div>
          </div>
          <div
            className={`flex items-center justify-center ${secondaryColor} rounded`}
            style={{ width: "2.5rem", height: "2.5rem" }}>
            <i className={`pi pi-user ${primaryTextColor} text-xl`} />
          </div>
        </div>
        <span className={`${primaryTextColor} font-medium`}>
          {footerNumber}{" "}
        </span>
        <span className="text-500">{footerText}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
