import React from "react";
import ErrorModal from "components/ErrorModal";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { State } from "store";
import { Spin } from "antd";

const RestaurantLayout = ({ children }) => {
  // eslint-disable-next-line react-redux/useSelector-prefer-selectors
  const { lineUser, isLoading } = useSelector((state: State) => state);
  const wrap = lineUser ? "wrap" : "hidden";
  if (isLoading)
    return (
      <Spin tip='Loading...' className='fixed top-1/3 text-primary'>
        <LoadingOutlined className='font-[36px] text-primary' spin />
      </Spin>
    );
  return (
    <div className={wrap}>
      {children}
      <ErrorModal />
    </div>
  );
};

export default RestaurantLayout;
