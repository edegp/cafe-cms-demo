/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  MoneyCollectOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Layout, Row, Typography } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { useSelector } from "react-redux";
import Link from "next/link";
import { weekdayName } from "utils/helpers";
import { RootState } from "store";

const Delete_completed = () => {
  // eslint-disable-next-line react-redux/useSelector-prefer-selectors
  const { t, message } = useSelector((state: RootState) => state);
  let yyyymmdd = message.day;
  yyyymmdd = yyyymmdd.split("-");
  for (let i = 0; i < yyyymmdd.length; i++) {
    yyyymmdd[i] = parseInt(yyyymmdd[i], 10);
  }
  const date = `${yyyymmdd[0]}年${yyyymmdd[1]}月${yyyymmdd[2]}日`;
  let yyymmdd = new Date(message.day.replace(/-/g, "/"));
  const weekday = weekdayName(yyymmdd.getDay());
  return (
    <Layout className="h-[100vh] bg-[url('https://media.istockphoto.com/photos/reserved-sign-on-restaurant-table-with-bar-background-picture-id912129754')] bg-center bg-no-repeat bg-cover">
      <Typography className="mx-1 mt-[20vh] text-md font-bold text-center text-white bg-stone-400/[0.55] ">
        {t.delete_completed.msg001.replace("{name}", message?.name)}
        {t.delete_completed.msg002}
        <br />
        <span className="text-[#ff6347]">{t.delete_completed.msg003}</span>
        <br />
        {t.delete_completed.msg004}
        {t.delete_completed.msg005}
      </Typography>
      <Content className="flex justify-center">
        <Card className="justify-self-center self-center w-[400px] rounded-md">
          <Row>
            <Col span={10} className="flex items-center">
              <ShopOutlined className="mr-2" />
              &nbsp;{t.delete_completed.msg006}
            </Col>
            <Col span={14}>{message.restaurant} </Col>
          </Row>
          <Row>
            <Col span={10} className="flex items-center">
              <CalendarOutlined className="mr-2" />
              &nbsp;{t.delete_completed.msg007}
            </Col>
            <Col span={14}>
              {date}（{weekday}）
            </Col>
          </Row>
          <Row>
            <Col span={10} className="flex items-center">
              <ClockCircleOutlined className="mr-2" />
              &nbsp;{t.delete_completed.msg008}
            </Col>
            <Col span={14}>{message.start} ～</Col>
          </Row>
          {/* <Row>
            <Col span={10} className="flex items-center">
              <UserOutlined className="mr-2" />
              &nbsp;{t.completed.msg009}
            </Col>
            <Col span={14}>
              {t.completed.msg013.replace("{people}", message.people)}{" "}
            </Col>
          </Row>
          <Row>
            <Col span={10} className="flex items-center">
              <MoneyCollectOutlined className="mr-2" />
              &nbsp;{t.completed.msg010}
            </Col>
            <Col span={14}>
              {message.course.name}&nbsp;
              {message.course.id !== 0 &&
                t.completed.msg011.replace(
                  "{price}",
                  message.course.price.toLocaleString("ja-JP")
                )}
            </Col>
          </Row> */}
        </Card>
      </Content>
      <Footer className="w-full bg-transparent">
        <Link href="/restaurant" passHref>
          <Button className="w-full h-full font-bold text-white bg-line rounded-lg border-line hover:border-primary">
            <span className="footer-font-size">{t.completed.msg012}</span>
          </Button>
        </Link>
      </Footer>
    </Layout>
  );
};

export default Delete_completed;
