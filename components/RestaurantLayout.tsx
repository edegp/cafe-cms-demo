import React, { useState } from "react";
import ErrorModal from "components/ErrorModal";
import { useSelector } from "react-redux";

const RestaurantLayout = ({ children }) => {
  const lineUser = useSelector((state) => state.lineUser);
  const wrap = lineUser ? "wrap" : "hidden";
  return (
    <div className={wrap}>
      {children}
      <ErrorModal />
    </div>
  );
};

export default RestaurantLayout;
