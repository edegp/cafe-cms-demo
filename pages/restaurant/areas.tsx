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
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Image from "next/Image";
import Link from "next/Link";
import React, { useState } from "react";
import { weekdayName } from "utils/helpers";
import RestaurantLayout from "components/RestaurantLayout";
import { openMapApp } from "utils/helpers";
import { getAreaShops } from "utils/helpers";
import { useDispatch } from "react-redux";
import { useLocale } from "utils/useLocale";

const { Panel } = Collapse;

const areas = ({ areas, restaurants }) => {
  const dispatch = useDispatch();
  const { rippled, setRippled } = useState();
  const { t } = useLocale();
  const weekdayNames = (weekdays) => {
    let names = "";
    if (typeof weekdays == "object {
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
    const tagName = event.srcElement.tagName;
    if (num == 2) {
      event.stopPropagation();
    } else {
      if (tagName != "A setRippled(true);
    }
  };
  const openMap = (name, coordinate) => {
    let latitude = coordinate.latitude;
    let longitude = coordinate.longitude;
    openMapApp(latitude, longitude, 18);
  };
  return (
    <RestaurantLayout>
      <Layout>
        <Content>
          <Row>
            {areas.map((area) => (
              <Collapse key={area.id}>
                <Panel header={area.name}>
                  {restaurants[area.code].map((restaurant) => (
                    <Row key={restaurant.name}>
                      <Col sm="6" md="4" lg="12">
                        <Card
                          title={restaurant.name}
                          cover={
                            <Image
                              src={restaurant.img}
                              layout="fill"
                              alt="LINE Shop"
                            />
                          }
                          actions={
                            <Typography>
                              <EnvironmentOutlined />
                              <Button
                                type="link"
                                href="javascript:void(0);"
                                onClick={openMap(
                                  restaurant.name,
                                  restaurant.map
                                )}
                                onMouseDown={mousedownCard(2)}
                              >
                                {restaurant.address}
                              </Button>
                            </Typography>
                          }
                        >
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
                                <Link>{t.areas.msg007}</Link>
                              </Typography>
                            </List.Item>
                            <List.Item>
                              <Typography>Tel: {restaurant.tel}</Typography>
                            </List.Item>
                          </List>
                        </Card>
                      </Col>
                    </Row>
                  ))}
                </Panel>
              </Collapse>
            ))}
          </Row>
        </Content>
        <Footer></Footer>
      </Layout>
    </RestaurantLayout>
  );
};

export default areas;

export const getStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale, ["common"]);
  console.log(i18n["_nextI18Next"].initialI18nStore.ja.common);
  const data = await getAreaShops();
  const areas = data.areas;
  const restaurants = data.restaurants;
  return {
    props: {
      ...i18n,
    },
  };
};
