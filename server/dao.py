import pymysql
from dotenv import dotenv_values
from flask_login import UserMixin
env_vars = dotenv_values(".env")

db = pymysql.connect(
    host=env_vars.get("DB_HOST"),
    user=env_vars.get("DB_USER"),
    password=env_vars.get("DB_PASSWORD"),
    db=env_vars.get("DB_NAME"),
    charset="utf8"
)


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
            print(f"Error occurred: {str(e)}")
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
        cursor = db.cursor()
        cursor.execute(sql, (user_Id,
                             user_email))
        db.commit()
        db.close()
        inserted_id = cursor.lastrowid
        return inserted_id


class CurrencyNotification():
    def __init__(self, _id, _userId, _userEmail, _fromCountry, _toCountry, _goalCurrencyRate):
        self.id = _id
        self.userId = _userId
        self.userEmail = _userEmail
        self.fromCountry = _fromCountry
        self.toCountry = _toCountry
        self.goalCurrencyRate = _goalCurrencyRate

    @staticmethod
    def getGoalCurrency(user_Id):
        cursor = db.cursor()
        sql = "select * from currency_rate_notification where user_Id=%s"
        cursor.execute(sql, (user_Id))
        result = cursor.fetchone()
        if result:
            currencyNotification = CurrencyNotification(
                _id=result[0],
                _userId=result[1],
                _userEmail=result[2],
                _fromCountry=result[3],
                _toCountry=result[4],
                _goalCurrencyRate=result[5],
            )
            return currencyNotification
        else:
            return None

    @staticmethod
    def insertGoalCurrency(user_Id,
                           user_email,
                           from_country,
                           to_country,
                           goal_currency):
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
        cursor = db.cursor()
        cursor.execute(sql, (user_Id,
                             user_email,
                             from_country,
                             to_country,
                             goal_currency))
        db.commit()
        db.close()
        inserted_id = cursor.lastrowid
        return inserted_id
