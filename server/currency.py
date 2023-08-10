import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime


def cal_currency(currency_from, currency_to):
    # Chrome 웹 드라이버 설정
    # chrome_options = Options()
    # chrome_options.add_argument("--headless")  # 브라우저 창을 띄우지 않고 실행
    # driver = webdriver.Chrome(chrome_options=chrome_options)
    header = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Content-Type': 'text/html; charset=utf-8'
    }
    # response=requests.get(f'https://investing.com/currencies/{currency_from}-{currency_to}', headers=header)
    currency_from = currency_from.upper()
    currency_to = currency_to.upper()
    response = requests.get(
        f'https://www.x-rates.com/calculator/?from={currency_from}&to={currency_to}&amount=1', headers=header)
    # response=requests.get(f'https://www.oanda.com/currency-converter/en/?from={currency_from}&to={currency_to}&amount=1', headers=header)
    # time.sleep(3)
    contents = BeautifulSoup(response.content, 'html.parser')

    # exchange=contents.find('span', {'data-test':'instrument-price-last'})
    exchange = contents.find('span', 'ccOutputRslt')
    # exchange=contents.find('input', attrs={'class':'MuiInputBase-input MuiFilledInput-input','tabindex':'4'})
    exchange_rate = exchange.text
    if exchange is not None:
        exchange_rate = exchange.text
        # print(exchange_rate)
    else:
        exchange_rate = 'Sorry! Exchange rate not found'
        # print(exchange_rate)
    return exchange_rate


# cal_currency('nzd', 'cny')
