import {
  Col,
  Collapse,
  Layout,
  List,
  Row,
  Typography,
  Card,
  Button,
  Divider,
  Space,
} from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { EnvironmentOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useState } from "react";
import { weekdayName } from "utils/helpers";
import { openMapApp } from "utils/helpers";
import { getAreaShops } from "utils/helpers";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { store, setT, setFlash, RootState } from "store";
import Head from "next/head";

const { Panel } = Collapse;

const Areas = ({ areas, restaurants }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  // eslint-disable-next-line react-redux/useSelector-prefer-selectors
  const t = useSelector((state: RootState) => state.t);
  const weekdayNames = (weekdays) => {
    let names = "";
    if (typeof weekdays == "object") {
      for (const weekday of weekdays) {
        if (names.length > 0) {
          names += ", ";
        }
        names += weekdayName(weekday);
      }
    } else {
      names = weekdays;
    }

    return names.length == 0 ? "なし" : names;
  };
  const mousedownCard = (num) => {
    if (num == 2) {
      event.stopPropagation();
    }
  };
  const openMap = (name, coordinate) => {
    let latitude = coordinate.latitude;
    let longitude = coordinate.longitude;
    openMapApp(latitude, longitude, 18);
  };
  const openLineOA = (line) => router.push(line);
  const reserve = (area, restaurant) => {
    dispatch(setFlash(area));
    dispatch(setFlash(restaurant));
    return router.push(`/restaurant/${area.code}/${restaurant.id}`);
  };
  return (
    <Layout title="カルディ予約　店舗選択ページ" className="bg-white">
      <Header className="flex text-center bg-primary">
        <Typography.Title
          level={2}
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="self-center mb-0 text-white font-[Yu Mincho]"
        >
          予約　店舗選択
        </Typography.Title>
      </Header>
      <Content className="m-[2.5%] mb-0 bg-white">
        <Row>
          <Space direction="vertical" size="middle" className="flex w-full">
            {areas.map((area) => (
              <Collapse key={area.id} className="w-full">
                <Panel key={area.id} header={area.name}>
                  <Row
                    gutter={[16, 32]}
                    justify="space-evenly"
                    className="mx-[2.5%]"
                  >
                    {restaurants[area.code].map((restaurant) => (
                      <Col
                        key={restaurant.name}
                        xs={24}
                        lg={12}
                        xl={{ span: 10, offset: 2 }}
                      >
                        <Card
                          hoverable
                          onClick={() => reserve(area, restaurant)}
                          title={restaurant.name}
                        >
                          <Row gutter={16} align="middle">
                            <Col xs={24} md={13}>
                              <Image
                                src={restaurant.img}
                                layout="responsive"
                                width="1024"
                                height="667"
                                objectFit="contain"
                                alt="LINE Shop"
                              />
                            </Col>
                            <Col xs={24} md={9} offset={2}>
                              <List>
                                <List.Item>
                                  <Typography>
                                    {t.areas.msg001}: {restaurant.start}～
                                    {restaurant.end}
                                  </Typography>
                                </List.Item>
                                <List.Item>
                                  <Typography>
                                    {t.areas.msg002}:
                                    {weekdayNames(restaurant.holiday)}
                                  </Typography>
                                </List.Item>
                                <List.Item>
                                  <Typography>
                                    {t.areas.msg003}: ¥
                                    {restaurant.budget
                                      ? restaurant.budget.toLocaleString()
                                      : null}
                                  </Typography>
                                </List.Item>
                                <List.Item>
                                  <Typography>
                                    {t.areas.msg004}:{restaurant.seats}
                                    {t.areas.msg005}
                                  </Typography>
                                </List.Item>
                                <List.Item>
                                  <Typography>
                                    {t.areas.msg006}: {restaurant.smoking}
                                  </Typography>
                                </List.Item>
                                <List.Item>
                                  <Typography>
                                    <Button
                                      href="javascript:void(0);"
                                      onClick={() =>
                                        openLineOA(restaurant.line)
                                      }
                                      onMouseDown={() => mousedownCard(2)}
                                      className="text-line hover:border-line"
                                    >
                                      {t.areas.msg007}
                                    </Button>
                                  </Typography>
                                </List.Item>
                                <List.Item>
                                  <Typography>Tel: {restaurant.tel}</Typography>
                                </List.Item>
                              </List>
                            </Col>
                            <div className="flex items-center">
                              <EnvironmentOutlined />
                              <Button
                                type="link"
                                href="javascript:void(0);"
                                onClick={() =>
                                  openMap(restaurant.name, restaurant.map)
                                }
                                onMouseDown={() => mousedownCard(2)}
                              >
                                {restaurant.address}
                              </Button>
                            </div>
                          </Row>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Panel>
              </Collapse>
            ))}
          </Space>
        </Row>
      </Content>
    </Layout>
  );
};

export default Areas;

export const getStaticProps = async ({ locale }) => {
  store.dispatch(setT(locale));
  const data = await getAreaShops();
  const areas = data.areas;
  const restaurants = data.restaurants;
  return {
    props: {
      areas,
      restaurants,
    },
  };
};
