/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import { Button, Card, Modal, Typography } from "antd";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";

const ErrorModal = () => {
  // eslint-disable-next-line react-redux/useSelector-prefer-selectors
  const { axiosError, t } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const reload = () => {
    location.reload();
    return;
  };
  return (
    <Modal
      title={
        <>
          <ExclamationCircleOutlined className="text-red-600" />
          {t.error.msg001}
          <Button
            onClick={() => dispatch({ type: "AxiosError", payload: null })}
          >
            <CloseOutlined />
          </Button>
        </>
      }
      footer={
        <Button className="text-emerald-700 bg-transparent" onClick={reload}>
          {t.error.msg004}
        </Button>
      }
    >
      <Typography>{t.error.msg003}</Typography>
      <Typography>
        （{t.error.msg003}：{axiosError}）
      </Typography>
    </Modal>
  );
};

export default ErrorModal;
