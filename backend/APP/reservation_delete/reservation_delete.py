import logging
import json
import os
import datetime

from common import common_const, utils, line
from validation.restaurant_param_check import RestaurantParamCheck
from common.remind_message import RemindMessage
from restaurant.restaurant_shop_reservation import RestaurantShopReservation
from restaurant.restaurant_reservation_info import RestaurantReservationInfo
from restaurant.restaurant_shop_master import RestaurantShopMaster

CHANNEL_ID = os.getenv("OA_CHANNEL_ID")
LIFF_CHANNEL_ID = os.getenv("LIFF_CHANNEL_ID")

# ログ出力の設定
LOGGER_LEVEL = os.environ.get("LOGGER_LEVEL")
logger = logging.getLogger()
if LOGGER_LEVEL == "DEBUG":
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

# 定数の宣言
THIRTY_MINUTES = datetime.timedelta(minutes=30)
VACANCY_FLG_MAP = {"AVAILABLE_NOTHING": 0, "AVAILABLE_MUCH": 1, "AVAILABLE_FEW": 2}
RESERVED_PROPORTION_MAP = {"RESERVED_MUCH": 0.8, "RESERVED_FULL": 1}

# テーブル操作クラスの初期化
shop_reservation_table_controller = RestaurantShopReservation()
reservation_info_table_controller = RestaurantReservationInfo()
shop_master_table_controller = RestaurantShopMaster()
message_table_controller = RemindMessage()


def update_shop_reservation_info(body, reservation_info):
    """
    カレンダーに予約情報を登録する。
    既に指定した月日に予約情報がある場合、Updateを行い、
    予約情報がない場合、Insertを行う。

    Parameters
    ----------
    body : dict
        ユーザーが選択した予約情報
    shop_info: dict
        shop_idを指定した取得した店舗の情報
    """

    if reservation_info:
        # shopIdと予約日でそのデータがあるか検索する
        reservation_item = shop_reservation_table_controller.get_item(
            int(reservation_info["shopId"]),
            body["reservationDate"],
        )
        logger.info(reservation_item)

        new_reservation_list, new_total_reserved_number = divide_thirty_minutes(
            reservation_info["reservationStarttime"],
            reservation_info["reservationEndtime"],
            reservation_info["reservationPeopleCount"],
        )

        # if->指定した予約日に予約情報がある場合：更新
        # else->指定した予約日に予約情報がない場合：新規作成
        if reservation_item:
            # 新規データと元データを統合するため、重複している時間の検索用に
            # 予約開始時刻をkeyとして予約情報をvalueに持ったデータを作成する。
            start_time_index = {}
            for reserved_time_info in reservation_item["reservedInfo"]:
                start_time_index[
                    reserved_time_info["reservedStartTime"]
                ] = reserved_time_info

            # if->予約がある時間帯：予約人数を足す
            # else->予約が無い時間帯：その時間を新たに追加する
            for new_reservation_info in new_reservation_list:
                reservation_start_time = new_reservation_info["reservedStartTime"]
                if reservation_start_time in start_time_index:
                    start_time_index[reservation_start_time][
                        "reservedNumber"
                    ] -= new_reservation_info["reservedNumber"]
                    if start_time_index[reservation_start_time]["reservedNumber"] == 0:
                        start_time_index.pop(reservation_start_time)
            sum_total_reserved_number = (
                reservation_item["totalReservedNumber"] - new_total_reserved_number
            )
            if sum_total_reserved_number == 0:
                shop_reservation_table_controller.delete_item(
                    reservation_item["shopId"], reservation_item["reservedDay"]
                )
            else:
                # 一日の予約合計数と席数に対する予約合計数の比率を算出する(カレンダーの空き状況出力時に使用)
                max_reservable_number = shop_master_table_controller.get_item(
                    reservation_info["shopId"]
                )["shop"]["seatsNumber"]
                max_reservable_number
                reserved_proportion = sum_total_reserved_number / max_reservable_number
                key = {
                    "shop_id": body["shopId"],
                    "reserved_day": body["reservationDate"],
                }
                update_value = {
                    "reserved_info": list(start_time_index.values()),
                    "total_reserved_number": sum_total_reserved_number,
                    "vacancy_flg": get_vacancy_flg(reserved_proportion),
                }
                logger.info(list(start_time_index.values()))
                logger.info(sum_total_reserved_number)
                logger.info(reserved_proportion)
                logger.info(update_value)
                shop_reservation_table_controller.update_item(**key, **update_value)
        else:
            raise


def get_vacancy_flg(reserved_proportion):
    """
    予約割合から判断し、空き状況のフラグを取得する。

    Parameters
    ----------
    reserved_proportion : float
        予約数/席数で計算した予約済み率

    Returns
    -------
    vacancy_flg: int
        空き状況フラグ
    """
    if reserved_proportion < RESERVED_PROPORTION_MAP["RESERVED_MUCH"]:
        vacancy_flg = VACANCY_FLG_MAP["AVAILABLE_MUCH"]
    elif (
        reserved_proportion >= RESERVED_PROPORTION_MAP["RESERVED_MUCH"]
        and reserved_proportion < RESERVED_PROPORTION_MAP["RESERVED_FULL"]
    ):
        vacancy_flg = VACANCY_FLG_MAP["AVAILABLE_FEW"]
    else:
        vacancy_flg = VACANCY_FLG_MAP["AVAILABLE_NOTHING"]
    return vacancy_flg


def divide_thirty_minutes(
    reservation_start_time, reservation_end_time, reservation_people_number
):
    """
    数時間単位の予約情報を、30分単位の予約情報に分割し、listで返却する。
    データ:予約開始時間,予約終了時間,予約人数

    Parameters
    ----------
    reservation_start_time : str
        予約の希望開始時間
    reservation_end_time : str
        予約の希望終了時間
    reservation_people_number : int
        予約人数

    Returns
    -------
    reservation_info_list: list
        30分単位に分割された予約情報。
        すべての時間帯で、予約人数は同じになる。
    total_people_number: int
        30分ごとの予約人数の合計
    """

    start_time = datetime.datetime.strptime(reservation_start_time, "%H:%M")
    end_time = datetime.datetime.strptime(reservation_end_time, "%H:%M")
    thirty_minutes = datetime.timedelta(minutes=30)

    # 時間のデータを30分毎の時間に分割してリストを作成する。
    reservation_info_list = []
    tmp_start_time = start_time
    tmp_end_time = start_time + thirty_minutes
    total_people_number = 0
    while tmp_end_time <= end_time:
        reservation_info = {
            "reservedStartTime": tmp_start_time.strftime("%H:%M"),
            "reservedEndTime": tmp_end_time.strftime("%H:%M"),
            "reservedNumber": reservation_people_number,
        }
        reservation_info_list.append(reservation_info)

        total_people_number += reservation_people_number
        tmp_start_time += thirty_minutes
        tmp_end_time += thirty_minutes

    return reservation_info_list, total_people_number


def delete_reminder(message_id1, message_id2):

    key1 = {"id": message_id1}

    key2 = {"id": message_id2}

    del_message1 = message_table_controller.delete_item(**key1)

    del_message2 = message_table_controller.delete_item(**key2)

    if not del_message1 or not del_message2:
        return []


def delete_reservation_time(reservation_id):
    """
    予約済み時間の情報を取得する

    Parameters
    ----------
    shop_id : str
        予約する店舗のID
    preferred_day : str
        予約する日付

    Returns
    -------
    day_reserved_info_list: list of dict
        指定日の時間毎の予約情報

    Notes
    -------
    指定日に予約がない場合、空のリストを返す
    """
    key = {"reservation_id": reservation_id}
    # 指定日の予約情報を取得
    day_reserved_info = reservation_info_table_controller.delete_item(**key)

    # 指定日の予約がない場合空のリストを返す
    if not day_reserved_info:
        return []

    return day_reserved_info


def lambda_handler(event, context):
    """
    DynamoDBテーブルから日ごとの予約情報一覧を取得して返却する

    Parameters
    ----------
    event : dict
        フロントから送られたパラメータ等の情報
    context : __main__.LambdaContext
        Lambdaランタイムや関数名等のメタ情報

    Returns
    -------
    response: dict
        正常の場合、予約情報を返却する。
        エラーの場合、エラーコードとエラーメッセージを返却する。
    """
    logger.info(event)

    if event["body"] is None:
        error_msg_disp = common_const.const.MSG_ERROR_NOPARAM
        return utils.create_error_response(error_msg_disp, 400)
    body = json.loads(event["body"])
    # ユーザーID取得
    try:
        user_profile = line.get_profile(body["idToken"], LIFF_CHANNEL_ID)
        if (
            "error" in user_profile and "expired" in user_profile["error_description"]
        ):  # noqa 501
            return utils.create_error_response("Forbidden", 403)
        else:
            body["userId"] = user_profile["sub"]

    except Exception:
        logger.exception("不正なIDトークンが使用されています")
        return utils.create_error_response("Error")

    # パラメータチェック
    param_checker = RestaurantParamCheck(body)
    if error_msg := param_checker.check_api_reservation_delete():
        error_msg_disp = ("\n").join(error_msg)
        logger.error(error_msg_disp)
        return utils.create_error_response(error_msg_disp, status=400)  # noqa: E501

    try:
        reservation_info = reservation_info_table_controller.query(
            body["shopId"],
            body["userId"],
            body["reservationDate"],
            body["reservationStarttime"],
        )
        logger.info(reservation_info)
        delete_reminder(
            reservation_info[0]["messageId1"], reservation_info[0]["messageId2"]
        )
        update_shop_reservation_info(body, reservation_info[0])
        logger.info(reservation_info[0]["reservationId"])
        delete_reservation_time(reservation_info[0]["reservationId"])
    except Exception as e:
        logger.exception("Occur Exception: %s", e)
        return utils.create_error_response("ERROR")

    return utils.create_success_response(
        json.dumps(reservation_info, default=utils.decimal_to_int, ensure_ascii=False)
    )
