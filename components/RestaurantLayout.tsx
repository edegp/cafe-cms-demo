import React from "react";
import ErrorModal from "components/ErrorModal";
import { useSelector } from "react-redux";

const RestaurantLayout = ({ children }) => {
  const lineUser = useSelector((state) => state.lineUser);
  console.log(lineUser);
  return (
    <div className={lineUser ? "wrap" : "hidden"}>
      {children}
      <ErrorModal />
    </div>
  );
};

export default RestaurantLayout;
