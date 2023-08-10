from flask import Flask, request, redirect, jsonify, render_template, url_for, session
from flask_login import LoginManager, current_user, login_user, logout_user
from server.currency import cal_currency
from server.dao import CurrencyNotification, User
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import STATE_RUNNING
from dotenv import dotenv_values

import decimal
import google_auth_oauthlib.flow
import googleapiclient.discovery
import ssl

env_vars = dotenv_values(".env")
SECRET_KEY = env_vars.get('SECRET_KEY')
GOOGLE_CLIENT_ID = env_vars.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = env_vars.get('GOOGLE_CLIENT_SECRET')
CLIENT_SECRETS_FILE = "secret.json"

SCOPES = ['openid', 'https://www.googleapis.com/auth/userinfo.email']
API_SERVICE_NAME = 'drive'
API_VERSION = 'v2'

app = Flask(__name__)
app.secret_key = SECRET_KEY

login_manager = LoginManager()
login_manager.init_app(app)

# check currency rate scheduler
scheduler = BackgroundScheduler(daemon=False)

# session id
session_id = None


@login_manager.user_loader
def load_user(user_Id):
    return User.getUser(user_Id)


@app.route('/')
def index():
    if current_user.is_authenticated:
        global session_id
        session_id = current_user.id
        goalCurrencyList = getGoalCurrencyRateList(session_id)
        # check currency rate scheduler
        global scheduler
        scheduler.add_job(scheduled_job, 'interval', minutes=1)
        if scheduler.state != STATE_RUNNING:
            scheduler.start()
        return render_template("index.html", current_user=current_user, goalCurrencyList=goalCurrencyList)
    else:
        return render_template("index.html")


@app.route('/google-login')
def authorize():
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)

    flow.redirect_uri = url_for('authorized', _external=True)

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true')

    session['state'] = state
    # print(f'current_user.is_authenticated ::: {current_user.is_authenticated}')
    return redirect(authorization_url)


@app.route('/login/callback')
def authorized():
    state = session['state']
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
    flow.redirect_uri = url_for('authorized', _external=True)
    authorization_response = request.url

    try:
        flow.fetch_token(authorization_response=authorization_response)
        credentials = flow.credentials
        service = googleapiclient.discovery.build(
            'oauth2', 'v2', credentials=credentials)
        user_info = service.userinfo().get().execute()

        if user_info.get("verified_email"):
            users_email = user_info.get('email')
            unique_id = user_info.get('id')

        else:
            return "User email not available or not verified by Google.", 400

        user = User(
            _id=unique_id,
            _email=users_email
        )
        if not User.getUser(unique_id):
            User.insertUser(unique_id, users_email)
        session['credentials'] = credentials_to_dict(credentials)
        login_user(user)
        # save session
        global session_id
        session_id = unique_id
        # if not Session.getSession(unique_id):
        #     Session.insertSession(unique_id)

        return redirect(url_for('index'))
    except Exception as e:
        print(f"Error occurred: {e.args}")

    return redirect(url_for('index'))


def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}


# scheduler

# check currency rate every 15min


def is_within_tolerance(target_rate, current_rate, tolerance=0.5):
    # to check if the difference between the given target exchange rate and the current exchange rate is within an integer range of +-2
    diff = abs(target_rate - current_rate)
    return diff <= tolerance


def check_currency_rate(id):

    goalList = getGoalCurrencyRateList(id)
    for goal in goalList:
        if goal['isSubscribed'] == 1:
            # goal currency
            targetCurrencyRate = goal['goalCurrencyRate']
            # target from country
            fromCountry = goal['fromCountry']
            # target to country
            toCountry = goal['toCountry']

            currencyRate = cal_currency(fromCountry, toCountry)

            # Cut the last three characters of the text representing the currency code
            currencyRate = currencyRate[:-3]
            # print(f'from check_scheduler:::{currencyRate}')
            currencyRate = decimal.Decimal(str(currencyRate).replace(',', ''))
            targetCurrencyRate = decimal.Decimal(
                str(targetCurrencyRate).replace(',', ''))
            if targetCurrencyRate == currencyRate:
                print("target goal in!!")
            elif is_within_tolerance(targetCurrencyRate, currencyRate):
                print(
                    "The target exchange rate and the current exchange rate are within +-0.5!!")
            else:
                print('not yet')


def scheduled_job():
    with app.app_context():
        global session_id
        check_currency_rate(session_id)


# check currenidcy rate scheduler
# scheduler.start()

# shutdown scheduler when session logout


@app.route('/logout')
def logout():
    # if Session.getSession(current_user.id):
    #     Session.deleteSession(current_user.id)
    logout_user()
    # shutdown scheduler when session logout
    global scheduler
    if scheduler.state == STATE_RUNNING:
        scheduler.shutdown()
    return redirect(url_for('index'))


@app.route('/getCurrencyRate', methods=["GET"])
def getCurrencyRate():
    currency_from = request.args.get('currency_from')
    currency_to = request.args.get('currency_to')
    # print(f'currency_from: {currency_from} / currency_to: {currency_to}')
    currency_rate = cal_currency(currency_from, currency_to)
    if currency_rate is not None:
        data = {
            'currency_rate': currency_rate
        }
        return jsonify(data)
    else:
        return jsonify({})


def getGoalCurrencyRateList(id):
    # print(f'from getGoalCurrencyRateList:::{current_user.id}')
    # print(f'from getGoalCurrencyRateList:::{id}')
    currencyNotifications = CurrencyNotification.getGoalCurrency(id)
    if currencyNotifications:
        currencyData = []
        for notification in currencyNotifications:
            currencyData.append({
                'id': notification.id,
                'userId': notification.userId,
                'userEmail': notification.userEmail,
                'fromCountry': notification.fromCountry,
                'toCountry': notification.toCountry,
                'goalCurrencyRate': notification.goalCurrencyRate,
                'isSubscribed': notification.isSubscribed
            })

        return currencyData
    else:
        return []


@app.route('/saveTargetCurrencyRate', methods=["POST"])
def saveTargetCurrencyRate():
    currency_from = request.form.get('save_from_country')
    currency_to = request.form.get('save_to_country')
    currencyInput = request.form.get('currencyInput')
    print(
        f'save currency_from: {currency_from} / save currency_to: {currency_to} / currencyInput: {currencyInput}')
    CurrencyNotification.insertGoalCurrency(current_user.id,
                                            current_user.email,
                                            currency_from,
                                            currency_to,
                                            currencyInput)
    # print(lastrowid)
    if current_user.is_authenticated:
        if (CurrencyNotification.getGoalCurrency(
                current_user.id) is not None):
            currencyNotificationInfo = CurrencyNotification.getGoalCurrency(
                current_user.id)
            serialized_notificationInfo = [
                noti.__dict__ for noti in currencyNotificationInfo]
            return jsonify(serialized_notificationInfo)
        else:
            return jsonify([])

    return 'save currency_from: {currency_from} / save currency_to: {currency_to} / currencyInput: {currencyInput}'


@app.route('/deleteCurrencyNotification/<int:id>', methods=["DELETE"])
def deleteTargetCurrency(id):
    if CurrencyNotification.deleteGoalCurrency(id) > 0:
        return jsonify({'message': 'deleted'})
    else:
        return jsonify({'message': 'delete failed'})


@app.route('/updateCurrencyNotification', methods=["PUT"])
def updateTargetCurrency():
    targetCurrency = request.json.get('saved_goal_currency')
    id = request.json.get('id')
    if CurrencyNotification.updateGoalCurrency(targetCurrency, id) > 0:
        return jsonify({'message': 'updated'})
    else:
        return jsonify({'message': 'update failed'})


@app.route('/updateSubscription', methods=["PUT"])
def updateSubscribed():
    isSubscribed = request.json.get('is_subscribed')
    id = request.json.get('id')
    if CurrencyNotification.updateSubscribed(isSubscribed, id) > 0:
        if isSubscribed == 1:
            return jsonify({'message': 'Subscribed'})
        if isSubscribed == 0:
            return jsonify({'message': 'unSubscribed'})
    else:
        return jsonify({'message': 'update failed'})
# create Notification


# @app.route("/createNotification", method=["GET"])
# def createNotification():
#     return ''


if __name__ == '__main__':

    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('localhost.pem', 'localhost-key.pem')

    app.run(ssl_context=context, debug=True)
