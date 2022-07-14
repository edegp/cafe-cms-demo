import React from "react";
import {
  Button,
  Calendar,
  Col,
  Layout,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import { store, setT } from "store";
import {
  getAreaShops,
  getCourses,
  getMonthlyReservationStatus,
  monthList,
  now,
  timeList,
  isHoliday,
} from "utils/helpers";
import { Footer } from "antd/lib/layout/layout";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import locale from "antd/lib/calendar/locale/ja_JP";

const headerRendar = ({ value, type, onChange, onTypeChange }) => {
  const start = 0;
  const end = 12;
  const monthOptions = [];

  const current = value.clone();
  const localeData = value.localeData();
  const months = [];
  for (let i = 0; i < 12; i++) {
    current.month(i);
    months.push(localeData.monthsShort(current));
  }

  for (let i = start; i < end; i++) {
    monthOptions.push(
      <Select.Option key={i} value={i} className="month-item">
        {months[i]}
      </Select.Option>
    );
  }

  const year = value.year();
  const month = value.month();
  const options = [];
  for (let i = year - 10; i < year + 10; i += 1) {
    options.push(
      <Select.Option key={i} value={i} className="year-item">
        {i}
      </Select.Option>
    );
  }
  return (
    <div style={{ padding: 8 }}>
      <Typography.Title level={4}>Custom header</Typography.Title>
      <Row gutter={8}>
        <Col>
          <Radio.Group
            size="small"
            onChange={(e) => onTypeChange(e.target.value)}
            value={type}
          >
            <Radio.Button value="month">Month</Radio.Button>
            <Radio.Button value="year">Year</Radio.Button>
          </Radio.Group>
        </Col>
        <Col>
          <Select
            size="small"
            dropdownMatchSelectWidth={false}
            className="my-year-select"
            value={year}
            onChange={(newYear) => {
              const now = value.clone().year(newYear);
              onChange(now);
            }}
          >
            {options}
          </Select>
        </Col>
        <Col>
          <Select
            size="small"
            dropdownMatchSelectWidth={false}
            value={month}
            onChange={(newMonth) => {
              const now = value.clone().month(newMonth);
              onChange(now);
            }}
          >
            {monthOptions}
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default function index(props) {
  const router = useRouter();
  console.log(props.statuses);
  const t = useSelector((state) => state.t);
  const dayStatus = (d) => {
    const date = d.format("YYYY-MM-DD");
    let ret = 1;
    if (date in props.statuses) {
      ret = props.statuses[date].status;
    } else {
      ret = isHoliday(date, props.restaurant.holiday) ? 0 : 1;
    }
    return ret;
  };
  const dateCellRender = (value) => {
    return (
      <>
        {dayStatus(value) === 3 ? (
          <div>
            <Button danger>{t.calendar.full}</Button>
          </div>
        ) : dayStatus(value) === 2 ? (
          <div>
            <Button className="bg-yellow-500">
              {t.calendar.vacant_little}
            </Button>
          </div>
        ) : dayStatus(value) === 1 ? (
          <div>
            <div>{t.calendar.vacancy}</div>
            <Button className="bg-green-500 text-white rounded-full">
              {t.calendar.vacant}
            </Button>
          </div>
        ) : (
          <div>
            <Button type="link" danger>
              {t.calendar.closingday}
            </Button>
          </div>
        )}
      </>
    );
  };
  return (
    <Layout>
      <Layout.Content>
        <Calendar
          dateCellRender={dateCellRender}
          headerRender={headerRendar}
          locale={locale}
        />
      </Layout.Content>
      <Footer></Footer>
    </Layout>
  );
}

export const getStaticPaths = async ({ locales }) => {
  store.dispatch(setT(locales[0]));
  const data = await getAreaShops();
  const restaurants = Object.entries(data.restaurants);
  const paths = restaurants
    .map(([key, value]) =>
      value.map((restaurant) => ({
        params: { code: key, id: restaurant.id.toString() },
        locale: locales[0],
      }))
    )
    .flat();
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params, locale }) => {
  store.dispatch(setT(locale));
  const months = monthList(2);
  const minDate = now("yyyymmdd");
  const maxDate = now("yyyymmdd", 2);
  const data = await getAreaShops();
  const area = data.areas.find((v) => v.code == params.code);
  const restaurant = data.restaurants[params.code].find(
    (v) => v.id == params.id
  );
  // 予約時間帯リスト取得
  const times = timeList(restaurant.start, restaurant.end);
  // 予約コースリスト取得
  const coursePromise = getCourses(restaurant.id);
  // 予約状況データ取得
  const statusesPromise = getMonthlyReservationStatus(
    restaurant.id,
    months[0].value,
    restaurant
  );

  let course = await coursePromise;
  let statuses = await statusesPromise;

  return {
    props: {
      statuses,
      area,
      restaurant,
      selectedMonth: months[0].value,
      minDate,
      maxDate,
      months,
      times,
      course,
      maxSeats: restaurant.seats,
    },
  };
};
