import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Form,
  Select,
  DatePicker,
  TimePicker,
  ConfigProvider,
  Modal,
  Typography,
  Spin,
  Button,
} from "antd";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { store, clearFlash, setT, setFlash, RootState } from "store";
import { getAreaShops, deleteReserve } from "utils/helpers";
import moment from "moment";
import "moment/locale/ja";
import ja from "antd/lib/locale/ja_JP";
import CalendarLocale from "antd//lib/calendar/locale/ja_JP";
import { useForm } from "antd/lib/form/Form";
import { useRouter } from "next/router";
import { Header } from "antd/lib/layout/layout";
import Head from "next/head";

const Delete = ({ shopInfo, locale }) => {
  const router = useRouter();
  const { Content, Footer } = Layout;
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState({
    title: "",
    text: "",
  });
  const newCalendarLocale: any = CalendarLocale;
  // eslint-disable-next-line react-redux/useSelector-prefer-selectors
  const { t, lineUser } = useSelector((state: RootState) => state);
  moment.locale(locale);
  // eslint-disable-next-line
  newCalendarLocale.lang["shortWeekDays"] = Object.values(t.utils).slice(0, -1);
  newCalendarLocale.lang["shortMonths"] = [...Array(12)].map(
    (_, i) => i + 1 + "月"
  );
  newCalendarLocale.lang["monthsShort"] = [...Array(12)].map(
    (_, i) => i + 1 + "月"
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearFlash);
  }, [dispatch]);
  const handleErrorModalClick = useCallback(
    () =>
      setErrorDialogMessage({
        ...errorDialogMessage,
        title: "",
        text: "",
      }),
    [errorDialogMessage]
  );
  const handleDeleteReserve = async (input) => {
    setLoading(true);
    const token = lineUser.token;
    const { shopId } = input;
    const day = input.day.format("YYYY-MM-DD");
    const start = input.start.format("HH:mm");
    try {
      const { data } = await deleteReserve(token, day, shopId, start);
      const message = {
        no: data[0].reservationId,
        restaurant: { name: data[0].shopName },
        name: lineUser.name,
        day,
        start,
      };
      dispatch(setFlash(message));
      await router.push("/restaurant/delete_completed");
    } catch {
      setErrorDialogMessage({
        ...errorDialogMessage,
        title: "ご指定の予約が見つかりませんでした。",
        text: "条件をお確かめの上、再度お試しください",
      });
    } finally {
      setLoading(false);
    }
    return true;
  };
  console.log(errorDialogMessage);

  console.log(t);
  return (
    <ConfigProvider locale={ja}>
      <Head>
        <title>予約取り消しページ</title>
      </Head>
      <Layout className="h-full min-h-screen bg-white">
        <Header className="relative h-[30vh]">
          <Image
            src="https://media.istockphoto.com/photos/stylish-dinner-picture-id1178092305"
            alt="Restaurant"
            layout="fill"
            objectFit="cover"
          />
        </Header>
        <Content className="pb-24">
          <Spin
            spinning={loading}
            className="top-[-250px] z-50 text-primary"
            indicator={
              <LoadingOutlined className="font-[36px] text-primary" spin />
            }
            size="large"
            tip="送信中"
          >
            <div className="my-8 mx-5 text-neutral-600">
              <span className="border-l-[12px] border-l-[#00ba00] py-0 px-3 text-lg text-neutral-600">
                {t.delete.title}
              </span>
              <Form
                form={form}
                layout="vertical"
                className="mt-8"
                onFinish={handleDeleteReserve}
                initialValues={{
                  shopId: 1,
                  day: moment(new Date(), "YYYY-MM-DD"),
                  start: moment("12:00", "HH:mm"),
                }}
              >
                <Form.Item
                  className="w-[350px]"
                  label="予約した店名 "
                  name="shopId"
                  rules={[{ required: true, message: "必須項目です" }]}
                >
                  <Select>
                    {shopInfo.map((shop) => (
                      <Select.Option key={shop.id} value={shop.id}>
                        {shop.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="予約した日付"
                  name="day"
                  rules={[{ required: true, message: "必須項目です" }]}
                >
                  <DatePicker locale={newCalendarLocale} />
                </Form.Item>
                <Form.Item
                  label="開始時刻"
                  name="start"
                  rules={[{ required: true, message: "必須項目です" }]}
                >
                  <TimePicker
                    minuteStep={30}
                    format={"HH:mm"}
                    hideDisabledOptions={true}
                    disabledTime={() => ({
                      disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 24],
                    })}
                  />
                </Form.Item>
                <Form.Item className="fixed bottom-0 left-0 mb-0 w-full p-0">
                  <Button
                    size="large"
                    htmlType="submit"
                    className="flex h-full flex-[1_0_auto] 
                    justify-center bg-[#00ba00] p-0 
                    leading-loose text-white hover:border-white hover:opacity-80"
                    block
                  >
                    <span className="relative flex flex-[1_0_auto] items-center justify-center text-lg font-bold">
                      {t.delete.msg001}
                      <RightOutlined className="flex h-fit items-center text-md" />
                    </span>
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Spin>
          <Modal
            visible={Boolean(errorDialogMessage.title)}
            onCancel={handleErrorModalClick}
            onOk={handleErrorModalClick}
          >
            <Typography>
              <span>{errorDialogMessage.title}</span>
            </Typography>
            <Typography>
              <span className="whitespace-pre-wrap">
                {errorDialogMessage.text}
              </span>
            </Typography>
          </Modal>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default Delete;

export const getStaticProps = async ({ locale }) => {
  await store.dispatch(setT(locale));
  const data = await getAreaShops();
  const restaurants = data.restaurants;
  const shopInfo = Object.keys(restaurants)
    .map((key) =>
      restaurants[key].map((restaurant) => ({
        name: restaurant.name,
        id: restaurant.id,
      }))
    )
    .flat();
  return {
    props: {
      shopInfo,
      locale,
    },
  };
};
