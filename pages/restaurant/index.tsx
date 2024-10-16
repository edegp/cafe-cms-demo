/* eslint-disable tailwindcss/no-custom-classname */
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
} from "antd"
import { Content, Footer, Header } from "antd/lib/layout/layout"
import { EnvironmentOutlined, LeftOutlined } from "@ant-design/icons"
import Image from "next/image"
import React from "react"
import { weekdayName } from "utils/helpers"
import { openMapApp } from "utils/helpers"
import { getAreaShops } from "utils/helpers"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import { store, setT, setFlash, State, Restaurant } from "store"
// import Head from "next/head"
import { GetServerSideProps } from "next"
import { Area } from "types/Restaurant"

const { Panel } = Collapse

export default function Areas({
  areas,
  restaurants,
}: {
  areas: Area[]
  restaurants: { [key: string]: Restaurant[] }
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  // eslint-disable-next-line react-redux/useSelector-prefer-selectors
  const t = useSelector((state: State) => state.t)
  const weekdayNames = (weekdays: string[] | string) => {
    let names = ""
    if (typeof weekdays == "object") {
      for (const weekday of weekdays) {
        if (names.length > 0) {
          names += ", "
        }
        names += weekdayName(weekday)
      }
    } else {
      names = weekdays
    }

    return names.length == 0 ? "なし" : names
  }
  const mousedownCard = (num: number) => {
    if (num == 2) {
      event?.stopPropagation()
    }
  }
  const openMap = (
    name: string,
    coordinate: {
      latitude: number
      longitude: number
    }
  ) => {
    let latitude = coordinate.latitude
    let longitude = coordinate.longitude
    openMapApp(latitude, longitude, 18)
  }
  const openLineOA = (line: string) => router.push(line)
  const reserve = (area: Area, restaurant: Restaurant) => {
    dispatch(setFlash(area))
    dispatch(setFlash(restaurant))
    return router.push(`/restaurant/${area.code}/${restaurant.id}`)
  }
  return (
    <>
      <Layout title="カルディ予約　店舗選択ページ" className="bg-white">
        <Header className="flex bg-primary text-center">
          <Typography.Title
            level={2}
            className="font-[Yu Mincho] mb-0 self-center text-white"
          >
            予約　店舗選択
          </Typography.Title>
        </Header>
        <Content className="m-[2.5%] mb-24 bg-white">
          <Row>
            <Space direction="vertical" size="middle" className="flex w-full">
              {areas.map((area) => (
                <Collapse key={area.name} className="w-full">
                  <Panel
                    key={area.name}
                    header={
                      <Typography.Text className="font-semibold">
                        {area.name}
                      </Typography.Text>
                    }
                  >
                    <Row
                      gutter={[16, 32]}
                      justify="space-evenly"
                      className="mx-[2.5%]"
                    >
                      {restaurants[area.code].map((restaurant) => (
                        <Col
                          key={restaurant.name}
                          xs={24}
                          sm={21}
                          lg={12}
                          xxl={8}
                        >
                          <Card
                            hoverable
                            onClick={() => reserve(area, restaurant)}
                            title={
                              <Typography.Text className="font-semibold">
                                {restaurant.name}
                              </Typography.Text>
                            }
                          >
                            <Row gutter={8} align="middle">
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
                                      {t?.areas.msg001}: {restaurant.start}～
                                      {restaurant.end}
                                    </Typography>
                                  </List.Item>
                                  <List.Item>
                                    <Typography>
                                      {t?.areas.msg002}:
                                      {weekdayNames(restaurant.holiday)}
                                    </Typography>
                                  </List.Item>
                                  <List.Item>
                                    <Typography>
                                      {t?.areas.msg003}: ¥
                                      {restaurant.budget
                                        ? restaurant.budget.toLocaleString()
                                        : null}
                                    </Typography>
                                  </List.Item>
                                  <List.Item>
                                    <Typography>
                                      {t?.areas.msg004}:{restaurant.seats}
                                      {t?.areas.msg005}
                                    </Typography>
                                  </List.Item>
                                  <List.Item>
                                    <Typography>
                                      {t?.areas.msg006}: {restaurant.smoking}
                                    </Typography>
                                  </List.Item>
                                  <List.Item>
                                    <Button
                                      onClick={() =>
                                        openLineOA(restaurant.line)
                                      }
                                      onMouseDown={() => mousedownCard(2)}
                                      className="text-line hover:border-line"
                                    >
                                      {t?.areas.msg007}
                                    </Button>
                                  </List.Item>
                                  <List.Item>
                                    <Typography>
                                      Tel: {restaurant.tel}
                                    </Typography>
                                  </List.Item>
                                </List>
                              </Col>
                              <div className="flex items-center">
                                <EnvironmentOutlined />
                                <Button
                                  type="link"
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
        <Footer className="fixed bottom-0 w-full text-center">
          <Button
            href="/"
            className="inline-flex items-center justify-center hover:top-[-2px] hover:border-primary  hover:text-primary hover:opacity-75 hover:shadow-lg active:border-primary active:text-primary"
          >
            <LeftOutlined />
            カルディ非公式ホームページに戻る
          </Button>
        </Footer>
      </Layout>
    </>
  )
}

export const getStaticProps: GetServerSideProps = async ({ locale }) => {
  store.dispatch(setT(locale))
  const data = await getAreaShops()
  const areas = data.areas
  const restaurants = data.restaurants
  return {
    props: {
      areas,
      restaurants,
      title: "カルディ予約　店舗選択ページ",
    },
  }
}
