import React from "react";
import { createContext, useContext, useState } from "react";
const initialform = {
  from_dt: "",
  to_dt: "",
  outlet: "",
};
const FormContext = createContext();
const ReportContext = ({ children }) => {
  const [from_dt, setFrom] = useState(null);
  const [to_dt, setTo] = useState(null);
  const [outlet, setOutlet] = useState(null);
  const setForm = (items) => {
    // setList([todoItem,...todoList])
    setFrom(items.from_dt);
    setTo(items.to_dt);
    setOutlet(items.outlet);
  };
  return (
    <FormContext.Provider
      value={{ from_dt, to_dt, outlet, setForm }}></FormContext.Provider>
  );
};

export default ReportContext;
