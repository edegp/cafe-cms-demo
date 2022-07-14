import { store } from "store";
import axios from "axios";
// import { amplify } from "utils/amplify";
import { showHttpError } from "utils/helpers";
import { Amplify, API } from "aws-amplify";

const _stage = `/${process.env.APIGATEWAY_STAGE}`;

const { locale } = store.getState();

Amplify.configure({
  Auth: { region: "ap-northeast-1" },
  API: {
    endpoints: [
      {
        name: "LambdaAPIGateway",
        endpoint: process.env.BASE_URL,
      },
    ],
  },
});

export const RestaurantClient = {
  // ============================================
  //     Lambdaアクセス (Axios)
  // ============================================
  axios: {
    // 店舗一覧取得API
    areaData: async () => {
      // 送信パラメーター
      const params = {
        locale: locale,
      };
      // GET送信
      const response = await axios.get(`${_stage}/shop_list_get`, {
        params: params,
      });
      return response.status == 200 ? response.data : null;
    },
    // コース詳細情報取得API

    courseData: async (shopId) => {
      // 送信パラメーター
      const params = {
        locale: locale,
        shopId: shopId,
      };
      // GET送信
      const response = await axios.get(`${_stage}/course_list_get`, {
        params: params,
      });
      return response.status == 200 ? response.data : null;
    },

    /**
     * 店舗予約状況カレンダー取得API
     *  店舗ID
     *  年月
     *  APIレスポンス内容
     */
    shopStatusCalendar: async (shopId, month) => {
      // 送信パラメーター
      const params = {
        locale: locale,
        shopId: shopId,
        preferredYearMonth: `${month.substr(0, 4)}-${month.substr(4, 2)}`,
      };
      const response = await axios.get(`${_stage}/shop_calendar_get`, {
        params: params,
      });
      return response.status == 200 ? response.data : null;
    },

    /**
     * 店舗日別予約状況取得API
     *  店舗ID
     *  予約日
     *  APIレスポンス内容
     */
    shopDailyStatus: async (shopId, day) => {
      // 送信パラメーター
      const params = {
        locale: locale,
        shopId: shopId,
        preferredDay: day,
      };
      const response = await axios.get(`${_stage}/reservation_time_get`, {
        params: params,
      });
      return response.status == 200 ? response.data : null;
    },
    /**
     * 予約削除API
     *  送信パラメーター
     *  APIレスポンス内容
     */
    deleteReserve: async (params) => {
      // 送信パラメーター
      params["locale"] = locale;
      // POST送信
      const response = await axios.delete(
        `${_stage}/reservation_delete`,
        params
      );
      return response.status == 200 ? response.data : null;
    },
    /**
     * 予約登録API
     *  送信パラメーター
     *  APIレスポンス内容
     */
    reserve: async (params) => {
      // 送信パラメーター
      params["locale"] = locale;
      // POST送信
      const response = await axios.post(`${_stage}/reservation_put`, params);
      return response.status == 200 ? response.data : null;
    },
  },
  // ============================================
  //     Lambdaアクセス (Amplify API)
  // ============================================
  amplify: {
    /**
     *　店舗一覧取得API
     *  APIレスポンス内容
     */
    areaData: async () => {
      let response = null;
      // 送信パラメーター
      const myInit = {
        queryStringParameters: {
          locale: locale,
        },
      };
      // GET送信
      try {
        response = await API.get(
          "LambdaAPIGateway",
          `${_stage}/shop_list_get`,
          myInit
        );
      } catch (error) {
        showHttpError(error);
      }

      return response;
    },
    /**
     *　コース詳細情報取得API
     *  APIレスポンス内容
     */
    courseData: async (shopId) => {
      let response = null;
      // 送信パラメーター
      const myInit = {
        queryStringParameters: {
          locale: locale,
          shopId: shopId,
        },
      };
      // GET送信
      try {
        response = await API.get(
          "LambdaAPIGateway",
          `${_stage}/course_list_get`,
          myInit
        );
      } catch (error) {
        showHttpError(error);
      }

      return response;
    },
    /**
     * 店舗予約状況カレンダー取得API
     *  店舗ID
     *  年月
     *  APIレスポンス内容
     */
    shopStatusCalendar: async (shopId, month) => {
      let response = null;
      // 送信パラメーター
      const myInit = {
        queryStringParameters: {
          locale: locale,
          shopId: shopId,
          preferredYearMonth: `${month.substr(0, 4)}-${month.substr(4, 2)}`,
        },
      };
      // GET送信
      try {
        response = await API.get(
          "LambdaAPIGateway",
          `${_stage}/shop_calendar_get`,
          myInit
        );
      } catch (error) {
        showHttpError(error);
      }

      return response;
    },
    /**
     * 店舗日別予約状況取得API
     *  店舗ID
     *  予約日
     *  APIレスポンス内容
     */
    shopDailyStatus: async (shopId, day) => {
      let response = null;
      // 送信パラメーター
      const myInit = {
        queryStringParameters: {
          locale: locale,
          shopId: shopId,
          preferredDay: day,
        },
      };
      // GET送信
      try {
        response = await API.get(
          "LambdaAPIGateway",
          `${_stage}/reservation_time_get`,
          myInit
        );
      } catch (error) {
        showHttpError(error);
      }

      return response;
    },
    /**
     * 予約登録API
     *  送信パラメーター
     *  APIレスポンス内容
     */
    deleteReserve: async (params) => {
      let response = null;
      // 送信パラメーター
      params["locale"] = locale;
      const myInit = {
        body: params,
      };
      // POST送信
      try {
        response = await API.del(
          "LambdaAPIGateway",
          `${_stage}/reservation_delete`,
          myInit
        );
      } catch (error) {
        console.log(error);
        showHttpError(error);
      }
      return response;
    },
    /**
     * 予約登録API
     *  送信パラメーター
     *  APIレスポンス内容
     */
    reserve: async (params) => {
      let response = null;
      // 送信パラメーター
      params["locale"] = locale;
      const myInit = {
        body: params,
      };
      // POST送信
      try {
        response = await API.post(
          "LambdaAPIGateway",
          `${_stage}/reservation_put`,
          myInit
        );
      } catch (error) {
        showHttpError(error);
      }

      return response;
    },
  },
};
