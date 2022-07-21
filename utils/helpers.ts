import { store, setLineUser, setAxiosError } from "store";
import { isIOS, isAndroid } from "react-device-detect";
import { RestaurantClient } from "utils/reserve_client";
import { useRouter } from "next/router";

export const _module = process.env.NEXT_PUBLIC_AJAX_MODULE
  ? process.env.NEXT_PUBLIC_AJAX_MODULE
  : "axios";

export const weekdayName = (weekday) => {
  let name = "";
  const { t } = store.getState();
  switch (parseInt(weekday, 10)) {
    case 0:
      name = t.utils.sun;
      break;
    case 1:
      name = t.utils.mon;
      break;
    case 2:
      name = t.utils.tue;
      break;
    case 3:
      name = t.utils.wed;
      break;
    case 4:
      name = t.utils.thu;
      break;
    case 5:
      name = t.utils.fri;
      break;
    case 6:
      name = t.utils.sat;
      break;
  }

  return name;
};

export const openMapApp = (latitude, longitude, zoom, markered = true) => {
  let params = `ll=${latitude},${longitude}&z=${zoom}`;
  if (markered) {
    params += `&q=${latitude},${longitude}`;
  }
  import("@line/liff").then((liff) => {
    if (isIOS) {
      liff.default.openWindow({
        url: `https://maps.apple.com/maps?${params}`,
        external: true,
      });
    } else if (isAndroid) {
      liff.default.openWindow({
        url: `https://maps.google.com/maps?${params}`,
        external: true,
      });
    } else {
      window.open(`https://maps.google.com/maps?${params}`, "_blank");
    }
  });
};

export const getAreaShops = async () => {
  let ret = { areas: [], restaurants: {} };
  // エリアレコード
  const arecord = () => {
    return { code: null, name: null };
  };
  // 店舗レコード
  const srecord = () => {
    return {
      id: null,
      name: null,
      img: null,
      address: null,
      start: null,
      end: null,
      holiday: null,
      budget: null,
      seats: null,
      smoking: null,
      tel: null,
      line: null,
      map: null,
    };
  };

  // エリア＆店舗データ取得
  const data = await RestaurantClient[_module].areaData();
  if (!data) {
    return ret;
  }

  for (const record of data) {
    const areaId = record.areaId;
    const areaName = record.areaName;
    // エリア情報
    if (!(areaId in ret.restaurants)) {
      let area = arecord();
      area.code = areaId;
      area.name = areaName;
      ret.areas.push(area);
      ret.restaurants[record.areaId] = [];
    }

    // 並び順変更
    record.shop.sort((previous, after) => {
      const val1 = previous.displayOrder;
      const val2 = after.displayOrder;
      if (val1 < val2) return -1;
      if (val1 > val2) return 1;
      return 0;
    });
    const { t } = store.getState();
    // console.log(store.getState());
    // console.log(t);
    for (const shopRecord of record.shop) {
      // 店舗情報
      let shop = srecord();
      shop.id = shopRecord.shopId;
      shop.name = shopRecord.shopName;
      shop.img = shopRecord.imageUrl;
      shop.address = shopRecord.shopAddress;
      shop.start = shopRecord.openTime;
      shop.end = shopRecord.closeTime;
      shop.holiday = convertWeekdays(shopRecord.closeDay);
      shop.tel = shopRecord.shopTel;
      shop.line = shopRecord.lineAccountUrl;
      shop.budget = shopRecord.averageBudget;
      shop.seats = shopRecord.seatsNumber;
      shop.smoking =
        shopRecord.smokingFlg == 1
          ? t.restaurant.allowed
          : t.restaurant.not_allowed;
      shop.map = shopRecord.coordinate ? shopRecord.coordinate : null;
      ret.restaurants[record.areaId].push(shop);
    }
  }

  return ret;
};

export const convertWeekdays = (weekdays) => {
  let ret = [];
  for (let weekday of weekdays) {
    switch (weekday) {
      case 0:
        ret.push(-1);
        break; // 休日なし
      case 1:
        ret.push(1);
        break; // 月
      case 2:
        ret.push(2);
        break; // 火
      case 3:
        ret.push(3);
        break; // 水
      case 4:
        ret.push(4);
        break; // 木
      case 5:
        ret.push(5);
        break; // 金
      case 6:
        ret.push(6);
        break; // 土
      case 7:
        ret.push(0);
        break; // 日
      case 9:
        ret.push(9);
        break; // 祝
    }
  }

  return ret;
};

// const router = useRouter();
const liffId = process.env.LIFF_ID;

export const showHttpError = (error) => {
  if (error.response && error.response.status >= 400) {
    // HTTP 403 Topへ画面遷移
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    if (error.response.status == 403) {
      const { t } = store.getState();
      const errmsg = t.error.msg005;
      if (typeof window !== "undefined") window.alert(errmsg);
      store.dispatch(setLineUser(null));
      import("@line/liff").then((liff) => {
        liff.default.logout();
      });
      if (typeof window !== "undefined")
        router.push(`https://liff.line.me/${liffId}`);
      return true;
    }

    const response = error.response;
    const message =
      !response.data && httpStatus[response.status]
        ? httpStatus[response.status].message
        : response.data;
    setTimeout(() => {
      store.dispatch(
        setAxiosError(
          `status=${response.status} ${response.statusText} ${message}`
        )
      );
    }, 500);
    return true;
  }
  return false;
};

/**
 * HTTPステータス情報
 *
 */
const httpStatus = {
  // Client Error
  400: { message: "Bad Request" },
  401: { message: "Unauthorized" },
  402: { message: "Payment Required" },
  403: { message: "Forbidden" },
  404: { message: "Not Found" },
  405: { message: "Method Not Allowed" },
  406: { message: "Not Acceptable" },
  407: { message: "Proxy Authentication Required" },
  408: { message: "Request Timeout" },
  409: { message: "Conflict" },
  410: { message: "Gone" },
  411: { message: "Length Required" },
  412: { message: "Precondition Failed" },
  413: { message: "Request Entity Too Large" },
  414: { message: "Request-URI Too Long" },
  415: { message: "Unsupported Media Type" },
  416: { message: "Requested Range Not Satisfiable" },
  417: { message: "Expectation Failed	Expect" },
  // Server Error
  500: { message: "Internal Server Error" },
  501: { message: "Not Implemented" },
  502: { message: "Bad Gateway" },
  503: { message: "Service Unavailable" },
  504: { message: "Gateway Timeout" },
  505: { message: "HTTP Version Not Supported" },
};

export const monthList = (count) => {
  let months = [];
  let yyyymmdd = now("yyyymmdd");
  let yyyy = yyyymmdd.slice(0, 4);
  let mm = yyyymmdd.slice(4, 6).replace(/^0/, " ");
  const { t } = store.getState();
  if (t.type === "en") {
    mm = englishMonth(mm);
  }
  months.push({
    text: t.restaurant.yyyymm.replace("{year}", yyyy).replace("{month}", mm),
    value: `${yyyymmdd.substr(0, 6)}`,
  });

  for (let i = 0; i < count; i++) {
    yyyymmdd = now("yyyymmdd", i + 1);
    yyyy = yyyymmdd.substr(0, 4);
    mm = yyyymmdd.substr(4, 2).replace(/^0/, " ");
    if (t.type == "en") {
      mm = englishMonth(mm);
    }
    months.push({
      text: t.restaurant.yyyymm.replace("{year}", yyyy).replace("{month}", mm),
      value: `${yyyymmdd.substr(0, 6)}`,
    });
  }

  return months;
};

export const now = (format, addMonths?) => {
  let date = new Date();
  if (typeof addMonths == "number") {
    // 月末日処理
    const endDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + addMonths + 1,
      0
    );
    date.setMonth(date.getMonth() + addMonths);
    if (date.getTime() > endDayOfMonth.getTime()) {
      date = endDayOfMonth;
    }
  }
  return _dateformat(date, format);
};

const englishMonth = (month) => {
  let engMonth = null;

  switch (parseInt(month, 10)) {
    case 1:
      engMonth = "Jan.";
      break; // January
    case 2:
      engMonth = "Feb.";
      break; // February
    case 3:
      engMonth = "Mar.";
      break; // March
    case 4:
      engMonth = "Apr.";
      break; // April
    case 5:
      engMonth = "May.";
      break; // May
    case 6:
      engMonth = "Jun.";
      break; // June
    case 7:
      engMonth = "Jul.";
      break; // July
    case 8:
      engMonth = "Aug.";
      break; // August
    case 9:
      engMonth = "Sep.";
      break; // September
    case 10:
      engMonth = "Oct.";
      break; // October
    case 11:
      engMonth = "Nov.";
      break; // November
    case 12:
      engMonth = "Dec.";
      break; // December
  }

  return engMonth;
};

const _dateformat = (date, format) => {
  const yyyy = date.getFullYear();
  const mm = ("00" + (date.getMonth() + 1)).slice(-2);
  const dd = ("00" + date.getDate()).slice(-2);
  const hh = ("00" + date.getHours()).slice(-2);
  const mi = ("00" + date.getMinutes()).slice(-2);
  const ss = ("00" + date.getSeconds()).slice(-2);

  let ret = `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
  if (format !== undefined) {
    let strFormat = format.toLowerCase();
    strFormat = strFormat.replace("yyyy", yyyy);
    strFormat = strFormat.replace("mm", mm);
    strFormat = strFormat.replace("dd", dd);
    strFormat = strFormat.replace("hh", hh);
    strFormat = strFormat.replace("mi", mi);
    strFormat = strFormat.replace("ss", ss);
    ret = strFormat;
  }

  return ret;
};

export const timeList = (fromTime, toTime) => {
  let ret = [];

  let ftime = parseInt(fromTime.split(":")[0], 10);
  let ttime = parseInt(toTime.split(":")[0], 10);

  for (let tm = ftime; tm <= ttime; tm++) {
    let time = ("00" + tm).slice(-2) + ":00";
    let mtime = ("00" + tm).slice(-2) + ":30";
    if (time >= fromTime) {
      ret.push({ text: time, value: time });
    }
    if (mtime <= toTime) {
      ret.push({ text: mtime, value: mtime });
    }
  }

  return ret;
};

export const getCourses = async (shopId) => {
  let ret = [];

  // コースレコード
  const crecord = () => {
    return {
      id: null,
      name: null,
      time: null,
      price: null,
      comment: null,
      text: null,
      value: null,
    };
  };
  const { t } = store.getState();
  // コースなし
  ret.push({
    id: 0,
    name: t.restaurant.no_course,
    time: 0,
    price: 0,
    comment: null,
    text: t.restaurant.no_course,
    value: 0,
  });

  // コースデータ取得
  const data = await RestaurantClient[_module].courseData(shopId);
  if (!data) {
    return ret;
  }

  for (const record of data) {
    let course = crecord();
    course.id = record.courseId;
    course.name = record.courseName;
    course.time = parseInt(record.courseMinutes, 10);
    course.price = parseInt(record.price, 10);
    course.comment = record.comment;
    course.text = `${course.name} (${t.restaurant.yen.replace(
      "{price}",
      course.price.toLocaleString()
    )})`;
    course.value = course.id;
    ret.push(course);
  }

  return ret;
};

export const createStatusRecord = () => {
  return {
    status: null,
    name: null,
    start: null,
    end: null,
    events: [],
  };
};

export function isHoliday(yyyymmdd, holiday) {
  let ret = false;
  let weekday = new Date(yyyymmdd.replace(/-/g, "/")).getDate();
  //  = date.getDay();
  if (holiday != null && holiday.length > 0 && holiday.indexOf(weekday) >= 0) {
    ret = true;
  }
  return ret;
}

export const getMonthlyReservationStatus = async (
  shopId,
  month,
  restaurant
) => {
  let ret = {};

  // 月別予約状況データ取得
  const data = await RestaurantClient[_module].shopStatusCalendar(
    shopId,
    month
  );
  if (!data) {
    return ret;
  }

  // 予約状況データ格納
  const yyyymm = new String(data.reservedYearMonth);
  const calendar = data.reservedDays;

  for (const dayRecord of calendar) {
    // 日別営業状態＆予約状況
    const dd = ("000" + dayRecord.day).slice(-2);
    const day = `${yyyymm}-${dd}`;
    const vacancyStatus = dayRecord.vacancyFlg;
    const workingStatus = isHoliday(day, restaurant.holiday);

    let reservation = createStatusRecord();
    reservation.status = workingStatus
      ? 0
      : vacancyStatus == 0
      ? 3
      : vacancyStatus;
    reservation.name = "";
    reservation.start = restaurant.start;
    reservation.end = restaurant.end;
    ret[day] = reservation;
  }

  return ret;
};

export const getDailyReservationStatus = async (shopId, day, restaurant) => {
  let ret = [];

  // 日別別予約状況データ取得
  const data = await RestaurantClient[_module].shopDailyStatus(shopId, day);
  if (!data) {
    return ret;
  }
  const { t } = store.getState();
  let events = [];
  for (const record of data) {
    if (!("status" in record)) {
      record["status"] = 0; // 空き有
      const reservedNumber = record.reservedNumber;
      const reservedLimit = restaurant.seats;
      const percentage = reservedNumber / reservedLimit;
      if (percentage >= 1.0) {
        record["status"] = 2; // 空き無
      } else if (percentage >= 0.8) {
        record["status"] = 1; // 空き少
      }
    }
    // 空き状況
    let name = t.restaurant.vacant;
    let color = "success";
    switch (record.status) {
      case 1:
        name = t.restaurant.vacant_little;
        color = "orange lighten-1";
        break;
      case 2:
        name = t.restaurant.full;
        color = "error";
        break;
    }
    // 予約
    let event = {
      shopId: null,
      name: null,
      start: null,
      end: null,
      color: null,
      reserved: null,
    };
    event.shopId = restaurant.id;
    event.name = name;
    event.start = `${day} ${record.reservedStartTime}`;
    event.end = `${day} ${record.reservedEndTime}`;
    event.color = color;
    event.reserved = record.reservedNumber;
    events.push(event);
  }

  // 1日分時間帯イベント取得
  ret = createEvents(day, restaurant);
  for (const event of events) {
    let targetEvent = ret.find((v) => v.start == event.start);
    if (targetEvent) {
      // 予約状況イベント反映
      targetEvent.shopId = event.shopId;
      targetEvent.name = event.name;
      targetEvent.start = event.start;
      targetEvent.end = event.end;
      targetEvent.color = event.color;
      targetEvent.reserved = event.reserved;
    }
  }

  return ret;
};

const createEvents = (day, restaurant) => {
  let ret = [];
  const { t } = store.getState();
  // レストラン開始・終了時間
  const start = `${day.replace(/-/g, "/")} ${restaurant.start}`;
  const end = `${day.replace(/-/g, "/")} ${restaurant.end}`;
  let fdate = new Date(start);
  let tdate = new Date(end);
  // 営業時間帯
  let ftime = fdate.getTime();
  let ttime = tdate.getTime();

  // 時間帯ループ
  for (let dt = ftime; dt < ttime; dt = dt + 1000 * 60 * 30) {
    const startDate = new Date(dt);
    const endDate = new Date(dt + 1000 * 60 * 30);
    const stime = `${day} ${("00" + startDate.getHours()).slice(-2)}:${(
      "00" + startDate.getMinutes()
    ).slice(-2)}`;
    const etime = `${day} ${("00" + endDate.getHours()).slice(-2)}:${(
      "00" + endDate.getMinutes()
    ).slice(-2)}`;

    // イベント
    let event = {
      shopId: null,
      name: null,
      start: null,
      end: null,
      color: null,
      reserved: null,
    };
    event.shopId = restaurant.id;
    event.name = t.restaurant.vacant;
    event.start = stime;
    event.end = etime;
    event.color = "success";
    ret.push(event);
  }

  return ret;
};

export const updateReserve = async (
  token,
  shopId,
  day,
  start,
  end,
  courseId,
  people,
  names
) => {
  // LIFF ID Token取得
  const { lineUser } = store.getState();
  const idToken = lineUser.idToken;

  const params = {
    idToken: idToken,
    accessToken: token,
    shopId: shopId,
    shopName: names.shopName,
    reservationDate: day,
    reservationStarttime: start,
    reservationEndtime: end,
    reservationPeopleNumber: parseInt(people, 10),
    courseId: courseId,
    courseName: names.courseName,
    userName: names.userName,
  };

  // 予約登録
  const data = await RestaurantClient[_module].reserve(params);
  if (!data) {
    return null;
  }

  // メッセージ
  let message = {
    reservationId: data.reservationId,
  };

  return message;
};

export const deleteReserve = async (token, day, shopId, start) => {
  // LIFF ID Token取得
  const { lineUser } = store.getState();
  const idToken = lineUser.idToken;
  const params = {
    idToken: idToken,
    accessToken: token,
    shopId,
    reservationDate: day,
    reservationStarttime: start,
  };
  // 予約登録
  const data = await RestaurantClient[_module].deleteReserve(params);
  if (!data) {
    return null;
  }
  // メッセージ
  let message = {
    data,
  };
  return message;
};
