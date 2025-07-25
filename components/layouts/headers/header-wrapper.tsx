"use client";

import { store } from "@/hooks/store";
import { Provider } from "react-redux";
import DashboardHeader from "./dashboard-header";

const HeaderWrapper = () => {
  return (
    <Provider store= { store }>
        <DashboardHeader />
    </Provider>
  )
}

export default HeaderWrapper