/* eslint-disable tailwindcss/no-custom-classname */
import React, {
  useState,
  useCallback,
  useRef,
  ReactFragment,
  useMemo,
} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import {
  Button,
  Col,
  Layout,
  Row,
  Select,
  Typography,
  Modal,
  Drawer,
  Form,
  InputNumber,
  Spin,
  Input,
} from "antd"
import AntdCalendar, { CalendarProps } from "antd/lib/calendar"
import { store, setT, setFlash, RootState, Restaurant, Course } from "store"
import Link from "next/link"
import {
  getAreaShops,
  getCourses,
  getMonthlyReservationStatus,
  monthList,
  now,
  timeList,
  isHoliday,
  getDailyReservationStatus,
  updateReserve,
  range,
} from "utils/helpers"
import { Footer } from "antd/lib/layout/layout"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import "moment/locale/ja"
import moment, { min, Moment } from "moment"
import locale from "antd//lib/calendar/locale/ja_JP"
import {
  Calendar,
  momentLocalizer,
  DateFormat,
  Culture,
  DateLocalizer,
} from "react-big-calendar"
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  LoadingOutlined,
} from "@ant-design/icons"
import SwiperCore from "swiper"
// import Head from "next/head"
import { Area, ReserveEvent } from "types/Restaurant"
import { GetServerSideProps, GetStaticPaths } from "next"
import { DayTimeSlotCalendar } from "components/DayTimeSlotCalendar"
import { isPCbrowser } from "libs/mediaQuery"
import { message } from "antd"

export default function Idex(props: {
  statuses: number[]
  area: Area
  restaurant: Restaurant
  minDate: string
  maxDate: string
  times: {
    value: string
    label: string
  }[]
  course: Course[]
}) {
  const { statuses, area, restaurant, maxDate, minDate, times, course } = props
  const router = useRouter()
  const swiperRef = useRef() as any
  const dispatch = useDispatch()
  const localizer = momentLocalizer(moment)
  const [form] = Form.useForm()
  // eslint-disable-next-line react-redux/useSelector-prefer-selectors
  const { t, axiosError, lineUser } = useSelector((state: RootState) => state)
  // const nowDate = now("YYYY-MM-DD")
  const [reserveDate, setReserveDate] = useState<string>(null)
  const [reserveDialog, setReserveDialog] = useState(false)
  const [events, setEvents] = useState<ReserveEvent[]>([])
  const [month, setMonth] = useState(moment())
  const [loading, setLoading] = useState(false)
  const [endtimeDisabled, setEndtimeDisabled] = useState(false)
  const [errorDialogMessage, setErrorDialogMessage] = useState<{
    title: string | undefined
    text: string | undefined
  }>({
    title: undefined,
    text: undefined,
  })
  // const [monthOptions, setMonthOptions] = useState<React.ReactElement[]>([])
  //日本語対応
  moment.locale(router.locale)
  const newLocale: any = locale
  newLocale.lang["shortWeekDays"] = Object.values(t?.utils || {}).slice(0, -1)
  const dayStatus = useCallback(
    (d: string | Moment) => {
      let date = d
      if (moment.isMoment(d)) date = d.format("YYYY-MM-DD")
      if (typeof date !== "string") {
        return 0
      }
      let ret = 1
      if (date in statuses) {
        ret = statuses[date].status
      } else {
        ret = isHoliday(date, restaurant.holiday) ? 0 : 1
      }
      return ret
    },
    [restaurant, statuses]
  )
  const showDayDetail = useCallback(
    async (date: string) => {
      setReserveDate(date)
      setLoading(true)
      const status = dayStatus(date)
      if (status === 0 || status === 3) {
        setLoading(false)
        message.error("定休日です")
        return
      } // 「定休日」と「無し」は詳細表示しない
      let events = await getDailyReservationStatus(
        restaurant.id,
        date,
        restaurant
      )
      setEvents(events)
      if (!axiosError) {
        form.setFieldsValue({ ...form.getFieldsValue(true), day: date })
      }
      setLoading(false)
    },
    [axiosError, dayStatus, form, restaurant, setLoading]
  )
  const changeCourse = useCallback(
    (start: string, courseId: number) => {
      setEndtimeDisabled(false)
      if (!start || !courseId) {
        return
      }
      if (courseId > 0) {
        setEndtimeDisabled(true)
      }
      // 終了時間算出
      let endTime = moment(reserveDate + " " + start)
        .add(course[courseId].time, "m")
        .format("HH:mm")
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        end: times.find((v: { value: string }) => v.value === endTime)
          ? endTime
          : null,
      })
    },
    [reserveDate, course, form, times]
  )
  const reserve = useCallback(
    async (value: {
      course?: any
      people?: any
      end?: any
      start?: any
      day?: any
    }) => {
      setLoading(true)
      const { people, end, start, day } = value
      const token = lineUser?.token
      const shopId = restaurant.id
      const courseId = value.course
      // デモ用
      const setCourse = course.find((v: { id: any }) => v.id === courseId)
      const names = {
        userName: lineUser?.name,
        shopName: restaurant.name,
        courseName:
          courseId == 0
            ? t?.calendar.msg014
            : setCourse
            ? setCourse.name
            : t?.calendar.msg014,
      }
      try {
        // 予約申込送信
        const data = await updateReserve(
          token,
          shopId,
          day,
          start,
          end,
          courseId,
          people,
          names
        )
        if (data) {
          const reservationId = data.reservationId
          if (isNaN(reservationId)) {
            setReserveDialog(false)
          } else {
            setErrorDialogMessage({
              ...errorDialogMessage,
              title: t?.calendar.msg016,
              text: t?.calendar.msg017,
            })
            return false
          }
          // ページ遷移
          let courseInfo = {
            id: 0,
            name: t?.calendar.msg014,
            time: 0,
            price: 0,
            comment: null,
            text: t?.calendar.msg014,
            value: 0,
          }
          if (courseId > 0) {
            courseInfo = course[courseId]
          }
          const message = {
            no: reservationId,
            restaurant: restaurant,
            name: lineUser?.name,
            course: courseInfo,
            day: day,
            people: people,
            start: start,
            end: end,
          }
          dispatch(setFlash(message))
          await router.push("/restaurant/completed")
        }
      } finally {
        setLoading(false)
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [course, dispatch, errorDialogMessage]
  )
  const handleClose = useCallback(() => setReserveDate(null), [])
  const calendarChange = useCallback(
    (value: React.SetStateAction<moment.Moment>) => setMonth(value),
    []
  )

  const handleNavigate = useCallback(
    (newDate: moment.MomentInput) => {
      const newD = moment(newDate).format("YYYY-MM-DD")
      if (newD < moment().format("YYYY-MM-DD")) {
        setErrorDialogMessage({
          ...errorDialogMessage,
          title: "これ以上進めません",
          text: "×ボタンを押して予約する日にちを再指定してください",
        })
        return
      }
      const swiper = swiperRef?.current?.swiper
      showDayDetail(newD)
      if (reserveDate === null) {
        return
      }
      const status = dayStatus(newD)
      if (status === 0 || status === 3) {
        setErrorDialogMessage({
          ...errorDialogMessage,
          title: "定休日です",
          text: "×ボタンを押して予約する日にちを再指定してください",
        })
        return
      }
      reserveDate < newD
        ? swiper.slideNext()
        : reserveDate > newD
        ? swiper.slidePrev()
        : setErrorDialogMessage({
            ...errorDialogMessage,
            title: "これ以上進めません",
            text: "×ボタンを押して予約する日にちを再指定してください",
          })
    },
    [errorDialogMessage, reserveDate, showDayDetail]
  )
  const handleSlideNext = useCallback(() => {
    showDayDetail(moment(reserveDate).add(1, "days").format("YYYY-MM-DD"))
  }, [reserveDate, showDayDetail])

  const handleSlidePrev = useCallback(() => {
    showDayDetail(moment(reserveDate).subtract(1, "days").format("YYYY-MM-DD"))
  }, [reserveDate, showDayDetail])

  const handleSelectEvent = useCallback(
    (calEvent: {
      id: number
      title: string
      start: moment.MomentInput
      end: moment.MomentInput
    }) => {
      setReserveDialog(true)
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        start: moment(calEvent.start).format("HH:mm"),
        end: moment(calEvent.end).format("HH:mm"),
      })
    },
    [form]
  )

  const handleCancel = useCallback(() => {
    setReserveDialog(false)
    form.getFieldsValue({
      ...form.getFieldsValue(true),
      start: null,
      end: null,
      course: 0,
    })
  }, [form])
  const handleFinishFailed = useCallback(
    (errorInfo: any) => console.log("Failed:", errorInfo),
    []
  )
  const handleCourseChange = useCallback(
    (value: any) => changeCourse(form.getFieldValue("start"), value),
    [changeCourse, form]
  )
  const handleErrorModalClick = useCallback(
    () =>
      setErrorDialogMessage({
        ...errorDialogMessage,
        title: "",
        text: "",
      }),
    [errorDialogMessage]
  )

  const handleMonthChange = useCallback(
    (start, end, months) =>
      range(start, end).map((i) => (
        // eslint-disable-next-line tailwindcss/no-custom-classname
        <Select.Option key={i} value={i} className="month-item">
          {months[i]}
        </Select.Option>
      )),
    []
  )

  const headerRender = useCallback(
    ({ value, onChange }: CalendarProps<Moment>) => {
      const start = parseInt(minDate.slice(4, -2).replace(/^0/, ""), 10) - 1
      const end = parseInt(maxDate.slice(4, -2).replace(/^0/, ""), 10)
      if (!value || !onChange) {
        return
      }
      const minYear = moment(minDate).year()
      const maxYear = moment(maxDate).year()
      const year = value.year()
      let month = value.month()
      const options = range(minYear, maxYear).map((i) => (
        // eslint-disable-next-line tailwindcss/no-custom-classname
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>
      ))
      const current = value.clone()
      const localeData = value.localeData()
      const months = range(0, 12).map((i) =>
        localeData.monthsShort(current.month(i))
      )
      let monthOptions = []
      if (start > end) {
        if (year !== maxYear) {
          monthOptions = handleMonthChange(start, 11, months)
          month = start
        } else {
          monthOptions = handleMonthChange(0, end, months)
          month = 0
        }
      } else {
        monthOptions = handleMonthChange(start, end, months)
      }
      return (
        <div key={value.format()} className="py-8">
          <Typography.Title level={4} className="my-vw-8 text-center">
            <span className="line-color">
              <span className="hidden-xs-only">
                {area ? area.name : null}&nbsp;
              </span>
              {restaurant ? restaurant.name : null}
            </span>
          </Typography.Title>
          <Row gutter={8}>
            <Col>
              <Select
                size="small"
                dropdownMatchSelectWidth={false}
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className="my-year-select"
                value={year}
                onChange={(newYear) => onChange(value.clone().year(newYear))}
              >
                {options}
              </Select>
            </Col>
            <Col>
              <Select
                size="small"
                dropdownMatchSelectWidth={false}
                value={month}
                onChange={(newMonth) => onChange(value.clone().month(newMonth))}
              >
                {monthOptions}
              </Select>
            </Col>
          </Row>
        </div>
      )
    },
    [area, maxDate, minDate, restaurant]
  )

  const dateFullCellRender = useCallback(
    (value: Moment) => {
      const valueMonth = value.month() + 1
      const curMonth = month.month() + 1
      const status = dayStatus(value)
      return (
        <>
          <div
            key={value.format()}
            className={`mb-1 h-[9vw] max-h-[13vh] min-h-[82px] text-center ${
              valueMonth === curMonth &&
              value > moment(minDate) &&
              value < moment(maxDate)
                ? ""
                : "text-zinc-400"
            }`}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            onClick={useCallback(
              () => showDayDetail(value.format("YYYY-MM-DD")),
              [value]
            )}
          >
            <span className="mt-vw-3">
              {valueMonth}/{value.date()}
            </span>
            {valueMonth === curMonth &&
            value > moment(minDate) &&
            value < moment(maxDate) ? (
              status === 3 ? (
                <Typography.Link className="mt-3 inline-block text-red-600/80">
                  {t?.calendar.full}
                </Typography.Link>
              ) : status === 2 ? (
                <>
                  <div>
                    <ExclamationCircleTwoTone
                      twoToneColor="rgb(234 179 8)"
                      className="text-[28px]"
                    />
                  </div>
                </>
              ) : status === 1 ? (
                <>
                  <div className="mt-4">
                    <CheckCircleTwoTone
                      twoToneColor="rgb(34 197 94)"
                      className="text-[28px]"
                    />
                  </div>
                </>
              ) : (
                <Typography.Link className="mt-3 inline-block text-red-500/80">
                  {t?.calendar.closingday}
                </Typography.Link>
              )
            ) : (
              <></>
            )}
          </div>
        </>
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayStatus, maxDate, minDate, month, showDayDetail]
  )
  const calendarClass =
    "flex mx-auto h-[85vh] tablet:max-w-screen-tablet laptop:max-w-screen-laptop desktop:max-w-screen-desktop [&_.rbc-toolbar]:flex-nowrap gap-8"

  const ReservationPicker = useMemo(() => {
    return (
      <SwiperSlide>
        <div className={calendarClass}>
          {dayStatus(reserveDate) === 0 ? (
            <DayTimeSlotCalendar
              events={events}
              localizer={localizer}
              reserveDate={reserveDate}
              handleNavigate={handleNavigate}
              minDate={minDate}
              maxDate={maxDate}
              handleSelectEvent={handleSelectEvent}
              start={10}
              end={23}
              formats={{
                dayHeaderFormat: (
                  date: Date,
                  culture: Culture,
                  localizer: DateLocalizer
                ) => localizer.format(date, "M[月] D[日] dddd", culture),
              }}
            />
          ) : isPCbrowser() ? (
            <>
              <DayTimeSlotCalendar
                events={events}
                localizer={localizer}
                reserveDate={reserveDate}
                handleNavigate={handleNavigate}
                minDate={minDate}
                maxDate={maxDate}
                handleSelectEvent={handleSelectEvent}
                start={10}
                end={16}
              />
              <DayTimeSlotCalendar
                events={events}
                localizer={localizer}
                reserveDate={reserveDate}
                handleNavigate={handleNavigate}
                minDate={minDate}
                maxDate={maxDate}
                handleSelectEvent={handleSelectEvent}
                start={16}
                end={23}
              />
            </>
          ) : (
            <DayTimeSlotCalendar
              events={events}
              localizer={localizer}
              reserveDate={reserveDate}
              handleNavigate={handleNavigate}
              minDate={minDate}
              maxDate={maxDate}
              handleSelectEvent={handleSelectEvent}
              start={10}
              end={23}
            />
          )}
        </div>
      </SwiperSlide>
    )
  }, [
    events,
    localizer,
    reserveDate,
    handleNavigate,
    minDate,
    maxDate,
    handleSelectEvent,
  ])

  return (
    <>
      <Layout className="z-0 mx-auto max-w-screen-laptop bg-white desktop:max-w-[1300px]">
        <Layout.Content>
          <AntdCalendar
            dateFullCellRender={dateFullCellRender}
            headerRender={headerRender}
            locale={newLocale}
            defaultValue={moment()}
            validRange={[moment(minDate), moment(maxDate)]}
            onChange={calendarChange}
            className="mx-vw-6 tablet:mx-vw-12"
          />
          <Drawer
            visible={Boolean(reserveDate)}
            onClose={handleClose}
            width={"100%"}
            height={"95vh"}
            placement="bottom"
            className="z-30 sp:px-6 [&_.ant-drawer-body]:px-vw-6 [&_.ant-drawer-body]:py-1"
            title={
              <Typography.Text>
                {reserveDate} {restaurant.name}&nbsp;&nbsp;
                {t?.calendar.msg001}
              </Typography.Text>
            }
          >
            <Spin
              spinning={loading}
              className="z-50 text-primary"
              indicator={
                <LoadingOutlined className="font-[36px] text-primary" spin />
              }
              size="large"
              tip="読み込み中"
            >
              <Swiper
                onInit={(core: SwiperCore) => (swiperRef.current = core.el)}
                loop={true}
                slidesPerView={1}
                onSlideNextTransitionStart={handleSlideNext}
                onSlidePrevTransitionStart={handleSlidePrev}
              >
                {ReservationPicker}
                {ReservationPicker}
              </Swiper>
            </Spin>
          </Drawer>
          <Modal
            zIndex={30}
            visible={reserveDialog}
            closable={true}
            maskClosable={true}
            onCancel={handleCancel}
            footer={null}
          >
            <Spin
              spinning={loading}
              className="z-50 text-primary"
              indicator={
                <LoadingOutlined className="font-[36px] text-primary" spin />
              }
              size="large"
              tip="送信中"
            >
              <Form
                form={form}
                requiredMark={"optional"}
                layout="vertical"
                onFinish={reserve}
                onFinishFailed={handleFinishFailed}
                className="mt-6"
                // onValuesChange={(changeValue) => {}}
              >
                <Form.Item
                  name="day"
                  hidden
                  rules={[{ required: true, message: "必須項目です" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="start"
                  label="開始時刻"
                  rules={[{ required: true, message: "必須項目です" }]}
                >
                  <Select
                    onChange={useCallback(
                      (value: string) =>
                        changeCourse(value, form.getFieldValue("course")),
                      [changeCourse, form]
                    )}
                  >
                    {events.map((event) => {
                      const startTime = moment(event.start).format("HH:mm")
                      return (
                        <Select.Option key={event.id} value={startTime}>
                          {startTime}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="end"
                  label="終了時刻"
                  rules={[
                    { required: true, message: "必須項目です" },
                    {
                      validator: (_, value) => {
                        if (value < form.getFieldValue("start")) {
                          return Promise.reject(
                            new Error("終了時刻 が 開始時刻 以前になっています")
                          )
                        } else {
                          return Promise.resolve()
                        }
                      },
                    },
                  ]}
                >
                  <Select disabled={endtimeDisabled}>
                    {events.map((event) => {
                      const endTime = moment(event.end).format("HH:mm")
                      return (
                        <Select.Option key={event.id} value={endTime}>
                          {endTime}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="人数"
                  name="people"
                  rules={[{ required: true, message: "必須項目です" }]}
                  initialValue={1}
                >
                  <InputNumber min={1} max={150} />
                </Form.Item>
                <Form.Item name="course" label="コース">
                  <Select onChange={handleCourseChange}>
                    {course.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}（税込 {c.price}円）
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.course !== curValues.course
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue("course") > 0 && (
                      <Typography.Paragraph className="bg-neutral-400/40 p-5 font-['游明朝'] font-medium">
                        {course[getFieldValue("course")]?.comment}
                      </Typography.Paragraph>
                    )
                  }
                </Form.Item>
                <Form.Item className="w-full">
                  <Button
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    className="absolute bottom-0 w-full rounded-sm border-primary bg-primary"
                  >
                    予約する
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
          <Modal
            visible={Boolean(errorDialogMessage.title)}
            onCancel={handleErrorModalClick}
            onOk={handleErrorModalClick}
          >
            <Typography>
              <span>{errorDialogMessage.title}</span>
            </Typography>
            <Typography>
              <span>{errorDialogMessage.text}</span>
            </Typography>
          </Modal>
        </Layout.Content>
        <Footer className="flex bg-white pl-vw-6">
          <Button className="mr-vw-8 border-zinc-600 bg-white text-zinc-600">
            <Link href="/restaurant" passHref>
              予約TOPへ
            </Link>
          </Button>
          <Button className="border-zinc-600 bg-white text-zinc-600">
            <Link href="/restaurant" passHref>
              店舗選択
            </Link>
          </Button>
        </Footer>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  store.dispatch(setT(locales?.[0]))
  const data = await getAreaShops()
  const restaurants = data.restaurants
  const paths = Object.keys(restaurants)
    .map((key) =>
      restaurants[key].map((restaurant) => ({
        params: { code: key, id: restaurant.id.toString() },
        locale: locales?.[0],
      }))
    )
    .flat()
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  store.dispatch(setT(locale))
  const months = monthList(3)
  const minDate = now("yyyymmdd")
  const maxDate = now("yyyymmdd", 3)
  const data = await getAreaShops()
  const code = params?.code?.[0] as string
  const area = data.areas.find((v) => v.code == code)
  const restaurant = data.restaurants[code].find(
    (v: { id: any }) => v.id == params?.id
  )
  // 予約時間帯リスト取得
  const times = timeList(restaurant?.start, restaurant?.end)
  const course = await getCourses(restaurant?.id)
  const statuses = await getMonthlyReservationStatus(
    restaurant?.id,
    months[0].value,
    restaurant
  )
  return {
    props: {
      statuses,
      area,
      restaurant,
      // selectedMonth: months[0].value,
      minDate,
      maxDate,
      months,
      times,
      course,
      title: `${restaurant.name} 予約ページ`,
      // maxSeats: restaurant.seats,
    },
    revalidate: 3600 * 24,
  }
}
