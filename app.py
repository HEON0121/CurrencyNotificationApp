from flask import Flask, request, redirect, jsonify, render_template, url_for, session
from flask_login import LoginManager, current_user, login_user, logout_user
from server.currency import cal_currency
from server.dao import CurrencyNotification, User
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import dotenv_values

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


@login_manager.user_loader
def load_user(user_Id):
    return User.getUser(user_Id)


@app.route('/')
def index():
    if current_user.is_authenticated:
        return render_template("index.html", current_user=current_user)
    else:
        # print('Not Authenticated')
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
        print(f'user_info ::: {user_info}')
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
        # currency save info

        # session.commit()
        # print(f'try current_user.is_authenticated ::: {current_user.is_authenticated}')

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


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/getCurrencyRate', methods=["GET"])
def getCurrencyRate():
    currency_from = request.args.get('currency_from')
    currency_to = request.args.get('currency_to')
    print(f'currency_from: {currency_from} / currency_to: {currency_to}')
    currency_rate = cal_currency(currency_from, currency_to)
    if currency_rate is not None:
        data = {
            'currency_rate': currency_rate
        }
        return jsonify(data)
    else:
        return jsonify({})


def getGoalCurrencyRate():
    if current_user.is_authenticated:
        if (CurrencyNotification.getGoalCurrency(
                current_user.id) is not None):
            currencyNotificationInfo = CurrencyNotification.getGoalCurrency(
                current_user.id)

            return jsonify(currencyNotificationInfo.__dict__)
        else:
            return jsonify({})


@app.route('/saveGoalCurrencyRate', methods=["POST"])
def saveGoalCurrencyRate():
    currency_from = request.form.get('save_from_country')
    currency_to = request.form.get('save_to_country')
    currencyInput = request.form.get('currencyInput')
    print(
        f'save currency_from: {currency_from} / save currency_to: {currency_to} / currencyInput: {currencyInput}')
    # lastrowid = CurrencyNotification.insertGoalCurrency(current_user.id,
    #                                                     current_user.email,
    #                                                     currency_from,
    #                                                     currency_to,
    #                                                     currencyInput)
    # print(lastrowid)
    if current_user.is_authenticated:
        if (CurrencyNotification.getGoalCurrency(
                current_user.id) is not None):
            currencyNotificationInfo = CurrencyNotification.getGoalCurrency(
                current_user.id)

            return jsonify(currencyNotificationInfo.__dict__)
        else:
            return jsonify({})
    print(
        f'from save func currencyNotificationInfo:::{currencyNotificationInfo}')
    return 'save currency_from: {currency_from} / save currency_to: {currency_to} / currencyInput: {currencyInput}'


if __name__ == '__main__':
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('localhost.pem', 'localhost-key.pem')

    app.run(ssl_context=context, debug=True)
