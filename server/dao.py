import pymysql
import traceback
from dotenv import dotenv_values
from flask_login import UserMixin
import os
import logging

# logging file directory root
log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')

if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# setting logging
logging.basicConfig(
    level=logging.ERROR,
    filename=os.path.join(log_dir, 'error.log'),
    filemode='a',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

env_vars = dotenv_values(".env")

db = pymysql.connect(
    host=env_vars.get("DB_HOST"),
    user=env_vars.get("DB_USER"),
    password=env_vars.get("DB_PASSWORD"),
    db=env_vars.get("DB_NAME"),
    charset="utf8"
)


class Session():
    def __init__(self, _id, _user_Id):
        self.id = _id
        self.user_Id = _user_Id

    @staticmethod
    def getSession(user_Id):
        try:
            with db.cursor() as cursor:
                sql = "select user_Id from sessions where user_Id=%s"
                cursor.execute(sql, (user_Id))
                result = cursor.fetchone()

                if result:
                    session = result[0]
                    return session
                else:
                    return None
        except Exception as e:
            logging.error(
                "An error occurred while getting session for user %s.", user_Id)
            logging.error(traceback.format_exc())
            return None

    @staticmethod
    def insertSession(user_Id):
        sql = '''insert 
            into sessions 
            (
                user_Id   
            ) 
            values
            (
                %s           
            )'''
        try:
            with db.cursor() as cursor:
                cursor.execute(sql, (user_Id,))
                db.commit()
                inserted_id = cursor.lastrowid
                return inserted_id
        except Exception as e:
            logging.error(
                "An error occurred while inserting session for user %s.", user_Id)
            logging.error(traceback.format_exc())
            return None

    @staticmethod
    def deleteSession(user_Id):
        try:
            with db.cursor() as cursor:
                sql = "delete from sessions where user_Id=%s"
                cursor.execute(sql, (user_Id,))
                db.commit()
        except Exception as e:
            logging.error(
                "An error occurred while deleting session for user %s.", user_Id)
            logging.error(traceback.format_exc())
            return None


class User(UserMixin):
    def __init__(self, _id, _email):
        self.id = _id
        self.email = _email

    @staticmethod
    def getUser(user_Id):
        try:
            with db.cursor() as cursor:
                sql = "select * from user where user_Id=%s"
                cursor.execute(sql, (user_Id))
                result = cursor.fetchone()

                if result:
                    user = User(
                        _id=result[0],
                        _email=result[1]
                    )
                    return user
                else:
                    return None
        except Exception as e:
            logging.error(
                "An error occurred while getting user info for user %s.", user_Id)
            logging.error(traceback.format_exc())
            return None

    @staticmethod
    def insertUser(user_Id,
                   user_email):
        sql = '''insert 
            into user 
            (
                user_Id, 
                user_email                
            ) 
            values
            (
                %s,
                %s            
            )'''
        try:
            with db.cursor() as cursor:
                cursor.execute(sql, (user_Id, user_email))
                db.commit()
                inserted_id = cursor.lastrowid
                return inserted_id
        except Exception as e:
            logging.error(
                "An error occurred while inserting user info for user user id : %s, user email : %s.", user_Id, user_email)
            logging.error(traceback.format_exc())
            return None


class CurrencyNotification():
    def __init__(self, _id, _userId, _userEmail, _fromCountry, _toCountry, _goalCurrencyRate, _isSubscribed, _subscription_json):
        self.id = _id
        self.userId = _userId
        self.userEmail = _userEmail
        self.fromCountry = _fromCountry
        self.toCountry = _toCountry
        self.goalCurrencyRate = _goalCurrencyRate
        self.isSubscribed = _isSubscribed
        self.subscription_json = _subscription_json

    @staticmethod
    def getGoalCurrency(user_Id):
        try:
            with db.cursor() as cursor:
                sql = "select * from currency_rate_notification where user_Id=%s"
                cursor.execute(sql, (user_Id))
                result = cursor.fetchall()
                if result:
                    currencyNotifications = []
                    for row in result:
                        currencyNotification = CurrencyNotification(
                            _id=row[0],
                            _userId=row[1],
                            _userEmail=row[2],
                            _fromCountry=row[3],
                            _toCountry=row[4],
                            _goalCurrencyRate=row[5],
                            _isSubscribed=row[6],
                            _subscription_json=row[7],
                        )
                        currencyNotifications.append(currencyNotification)
                    return currencyNotifications
                else:
                    return None
        except Exception as e:
            logging.error(
                "An error occurred while getting user currency info for user id : %s", user_Id)
            logging.error(traceback.format_exc())
            return None

    @staticmethod
    def insertGoalCurrency(user_Id,
                           user_email,
                           from_country,
                           to_country,
                           goal_currency
                           ):
        try:
            with db.cursor() as cursor:
                sql = '''insert 
                    into currency_rate_notification 
                    (
                        user_Id, 
                        user_email,
                        from_country, 
                        to_country, 
                        goal_currency_rate              
                    ) 
                    values
                    (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s       
                    )'''

                cursor.execute(sql, (user_Id,
                                     user_email,
                                     from_country,
                                     to_country,
                                     goal_currency,
                                     ))
                db.commit()
                inserted_id = cursor.lastrowid
                return inserted_id
        except Exception as e:
            logging.error(
                "An error occurred while inserting user currency info for user id : %s", user_Id)
            logging.error(traceback.format_exc())
            return None

    @staticmethod
    def deleteGoalCurrency(id):
        try:
            with db.cursor() as cursor:
                sql = "delete from currency_rate_notification where notification_Id=%s"
                deleted_row = cursor.execute(sql, (id,))
                if deleted_row > 0:
                    db.commit()
                return deleted_row
        except Exception as e:
            logging.error(
                "An error occurred while deleting user currency info delete node id : %s", id)
            logging.error(traceback.format_exc())

    @staticmethod
    def updateGoalCurrency(targetCurrency, id):
        try:
            with db.cursor() as cursor:
                sql = "update currency_rate_notification set goal_currency_rate = %s where notification_Id=%s"
                updated_row = cursor.execute(sql, (targetCurrency, id))
                if updated_row > 0:
                    db.commit()
                return updated_row
        except Exception as e:
            logging.error(
                "An error occurred while updating user currency info update node id : %s", id)
            logging.error(traceback.format_exc())

    @staticmethod
    def updateSubscribed(isSubscribed, subscription_json, id):
        try:
            with db.cursor() as cursor:
                sql = "update currency_rate_notification set is_Subscribed = %s, subscription_json = %s where notification_Id=%s"
                updated_row = cursor.execute(
                    sql, (isSubscribed, subscription_json, id))
                if updated_row > 0:
                    db.commit()
                return updated_row
        except Exception as e:
            logging.error(
                "An error occurred while updating user subscrition info update node id : %s", id)
            logging.error(traceback.format_exc())
