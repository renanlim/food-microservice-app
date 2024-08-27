import { createContext, useState, ReactNode, SetStateAction } from "react";
import ICustomerModel from "../interfaces/ICustomerModel";

export const AppContext = createContext<{
    reload: boolean,
    setReload: React.Dispatch<SetStateAction<boolean>>,
    loggedIn: boolean,
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>,
    customerId: string | null;
    setCustomerId: (id: string | null) => void;
    customers: ICustomerModel[] | null;
    setCustomers: (customers: ICustomerModel[] | null) => void;
    customerName: string | null;
    setCustomerName: (name: string | null) => void;

}>({
  reload: false,
  setReload: function (_value: SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  },
  loggedIn: false,
  setLoggedIn: function (_value: SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  },
  customerId: null,
  setCustomerId: function (_id: string | null): void {
    throw new Error("Function not implemented.");
  },
  customers: null,
  setCustomers: function (_customers: ICustomerModel[] | null): void {
    throw new Error("Function not implemented.");
  },
  customerName: null,
  setCustomerName: function (_name: string | null): void { 
    throw new Error("Function not implemented.");
  }
});
const Application = ({ children }: { children: ReactNode }) => {
  const [reload, setReload] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<ICustomerModel[] | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ reload, setReload, loggedIn, setLoggedIn, customerId, setCustomerId, customers, setCustomers, customerName, setCustomerName }}>
      {children}
    </AppContext.Provider>
  );
};

export default Application;
