"""
RestaurantReservationInfo操作用モジュール

"""
from datetime import datetime
from dateutil.tz import gettz
import uuid
import os

from aws.dynamodb.base import DynamoDB
from common import utils


class RestaurantReservationInfo(DynamoDB):
    """RestaurantReservationInfo操作用クラス"""

    __slots__ = ["_table"]

    def __init__(self):
        """初期化メソッド"""
        table_name = os.environ.get("CUSTOMER_RESERVATION_TABLE")
        super().__init__(table_name)
        self._table = self._db.Table(table_name)

    def put_item(
        self,
        shop_id,
        shop_name,
        user_id,
        user_name,
        course_id,
        course_name,
        reservation_people_number,
        reservation_date,
        reservation_starttime,
        reservation_endtime,
        amount,
        message_id1,
        message_id2,
    ):
        """
        データ登録

        Parameters
        ----------
        shop_id : int
            ショップID
        shop_name : str
            店舗名
        user_id : str
            ユーザーID
        user_name : str
            ユーザー名
        course_id : int
            コースID
        course_name : str
            コース名
        reservation_people_number : int
            予約人数
        reservation_date : str
            予約日
        reservation_starttime : str
            予約開始時刻
        reservation_endtime : str
            予約終了時刻
        amount : int
            コースの値段

        Returns
        -------
        reservation_id :str
            予約ID

        """
        reservation_id = str(uuid.uuid4())
        item = {
            "reservationId": reservation_id,
            "shopId": shop_id,
            "shopName": shop_name,
            "userId": user_id,
            "userName": user_name,
            "courseId": course_id,
            "courseName": course_name,
            "reservationPeopleCount": reservation_people_number,
            "reservationDate": reservation_date,
            "reservationStarttime": reservation_starttime,
            "reservationEndtime": reservation_endtime,
            "amount": amount,
            "expirationDate": utils.get_ttl_time(
                datetime.strptime(reservation_date, "%Y-%m-%d")
            ),
            "createdTime": datetime.now(gettz("Asia/Tokyo")).strftime(
                "%Y/%m/%d %H:%M:%S"
            ),
            "updatedTime": datetime.now(gettz("Asia/Tokyo")).strftime(
                "%Y/%m/%d %H:%M:%S"
            ),
            "messageId1": message_id1,
            "messageId2": message_id2,
        }

        try:
            self._put_item(item)
        except Exception as e:
            raise e
        return reservation_id

    def query(self, shop_id, user_id, reservation_date, reservation_starttime):
        """
        データ更新

        Parameters
        ----------
        shop_id : int
            店舗ID
        reservation_date : str
            予約日
        reservation_starttime : str
            予約開始時刻

        Returns
        -------
        response : dict
            レスポンス情報

        """
        index = "userId-index"
        expression = "userId = :user_id"  # noqa: E501
        filter_expression = "shopId = :shop_id AND reservationDate = :reservation_date AND reservationStarttime = :reservation_starttime"
        expression_value = {
            ":user_id": user_id,
            ":shop_id": shop_id,
            ":reservation_date": reservation_date,
            ":reservation_starttime": reservation_starttime,
        }

        try:
            response = self._query_index_filter(
                index, expression, filter_expression, expression_value
            )
        except Exception as e:
            raise e
        return response

    def delete_item(
        self,
        reservation_id,
    ):
        """
        データ更新

        Parameters
        ----------
        shop_id : int
            店舗ID
        reserved_day : str
            予約日
        reservation_date : str
            予約日
        reservation_starttime : str
            予約開始時刻

        Returns
        -------
        response : dict
            レスポンス情報

        """
        key = {"reservationId": reservation_id}

        try:
            response = self._delete_item(key)
        except Exception as e:
            raise e
        return response
