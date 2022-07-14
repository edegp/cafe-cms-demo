import {
  Col,
  Collapse,
  Layout,
  List,
  Row,
  Typography,
  Card,
  Button,
} from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import { EnvironmentOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useState } from "react";
import { weekdayName } from "utils/helpers";
import { openMapApp } from "utils/helpers";
import { getAreaShops } from "utils/helpers";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { store, setT, setFlash } from "store";

const { Panel } = Collapse;

const areas = ({ areas, restaurants }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { rippled, setRippled } = useState();
  const t = useSelector((state) => state.t);
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
  const mousedownCard = (num, event) => {
    const tagName = event?.target?.tagName;
    if (num == 2) {
      event.stopPropagation();
    } else {
      if (tagName != "A") setRippled(true);
    }
  };
  const openMap = (name, coordinate) => {
    let latitude = coordinate.latitude;
    let longitude = coordinate.longitude;
    openMapApp(latitude, longitude, 18);
  };
  const openLineOA = (line) => router.push(line);
  const reserve = (area, restaurant) => {
    dispatch(setFlash({ area }));
    dispatch(setFlash({ restaurant }));
    return router.push(`/restaurant/${area.code}/${restaurant.id}`);
  };
  return (
    <Layout>
      <Content>
        <Row>
          {areas.map((area) => (
            <Collapse className="w-full" key={area.id}>
              <Panel header={area.name}>
                <Row gutter={[16, 32]} justify="space-evenly">
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
                                    onClick={() => openLineOA(restaurant.line)}
                                    onMouseDown={() => mousedownCard(2)}
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
                          <Typography>
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
                          </Typography>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Panel>
            </Collapse>
          ))}
        </Row>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default areas;

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
