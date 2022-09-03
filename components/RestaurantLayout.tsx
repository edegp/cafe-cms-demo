import React from "react";
import ErrorModal from "components/ErrorModal";
import { store } from "store";

const RestaurantLayout = ({ children }) => {
  const { lineUser } = store.getState();
  const wrap = lineUser ? "wrap" : "hidden";
  return (
    <div className={wrap}>
      {children}
      <ErrorModal />
    </div>
  );
};

export default RestaurantLayout;
