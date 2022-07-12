import { isIOS, isAndroid } from "react-device-detect";
import { useUser } from "utils/useUser";
import RestaurantClient from "utils/reserve_client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import liff from "@line/liff";

export const weekdayName = (weekday, t) => {
  let name = "";
  switch (parseInt(weekday, 10)) {
    case 0:
      name = t("utils.sun");
      break;
    case 1:
      name = t("utils.mon");
      break;
    case 2:
      name = t("utils.tue");
      break;
    case 3:
      name = t("utils.wed");
      break;
    case 4:
      name = t("utils.thu");
      break;
    case 5:
      name = t("utils.fri");
      break;
    case 6:
      name = t("utils.sat");
      break;
  }

  return name;
};

export const openMapApp = (latitude, longitude, zoom, markered = true) => {
  let params = `ll=${latitude},${longitude}&z=${zoom}`;
  if (markered) {
    params += `&q=${latitude},${longitude}`;
  }
  if (isIOS) {
    liff.openWindow({
      url: `https://maps.apple.com/maps?${params}`,
      external: true,
    });
  } else if (isAndroid) {
    liff.openWindow({
      url: `https://maps.google.com/maps?${params}`,
      external: true,
    });
  } else {
    window.open(`https://maps.google.com/maps?${params}`, "_blank");
  }
};

export const getAreaShops = async () => {
  const _module = process.env.AJAX_MODULE ? process.env.AJAX_MODULE : "axios";
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
  const data = await RestaurantClient()[_module].areaData();
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
          ? t("restaurant.allowed")
          : t("restaurant.not_allowed");
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

export const showHttpError = (error, locale) => {
  if (error.response && error.response.status >= 400) {
    // HTTP 403 Topへ画面遷移
    if (error.response.status == 403) {
      const errmsg = locale.error.msg005;
      window.alert(errmsg);
      store.commit("lineUser", null);
      if (liff) liff.logout();
      window.location = `https://liff.line.me/${process.env.LIFF_ID}`;
      return true;
    }

    const response = error.response;
    const message =
      !response.data && this.httpStatus[response.status]
        ? this.httpStatus[response.status].message
        : response.data;
    setTimeout(() => {
      store.commit(
        "axiosError",
        `status=${response.status} ${response.statusText} ${message}`
      );
    }, 500);
    return true;
  }
  return false;
};
