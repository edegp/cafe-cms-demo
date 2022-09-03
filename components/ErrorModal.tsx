/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import { Button, Card, Modal, Typography } from "antd";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { setAxiosError, store } from "store";

const ErrorModal = () => {
  const state = store.getState();
  const { axiosError, t } = state;
  const reload = () => {
    location.reload();
    return;
  };
  return (
    <Modal
      title={
        <>
          <ExclamationCircleOutlined className='text-red-600' />
          {t.error.msg001}
          <Button onClick={() => store.dispatch(setAxiosError(null))}>
            <CloseOutlined />
          </Button>
        </>
      }
      footer={
        <Button className='bg-transparent text-emerald-700' onClick={reload}>
          {t.error.msg004}
        </Button>
      }
    >
      <Typography>{t.error.msg003}</Typography>
      <Typography>{`（${t.error.msg003}：${axiosError}）`}</Typography>
    </Modal>
  );
};

export default ErrorModal;
