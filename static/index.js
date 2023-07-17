const from_country_group = document.querySelector('.from_country_group');
const to_country_group = document.querySelector('.to_country_group');
const from_country = document.querySelector('.from_country');
const to_country = document.querySelector('.to_country');
const currency_main_form = document.getElementById('currency_main_form');
const currency_cal_btn = document.getElementById('currency_cal_btn');
const save_from_country = document.querySelector('.save_from_country');
const save_to_country = document.querySelector('.save_to_country');
const save_currency_btn = document.getElementById('save_currency_btn');
const notificationBtn = document.getElementById('notificationBtn');
const switchBtn = document.getElementById('switchBtn');
const currencyInput = document.getElementById('currencyInput');
const currency_save_form = document.getElementById('currency_save_form');
const getCurrencyRateNotiBtn = document.getElementById('getCurrencyRateNotiBtn');

let from_currency = '';
let to_currency = '';

let save_from_currency = '';
let save_to_currency = '';

const pick_from_group = (group) => {
    let from_countries = [];
    switch (group) {
        case 'Asia':
            from_countries = country['Asia'];
            break;
        case 'America':
            from_countries = country['America'];
            break;
        case 'Oceania':
            from_countries = country['Oceania'];
            break;
        case 'Euro':
            from_countries = country['Euro'];
            break;
    }
    return from_countries;
};

const pick_to_group = (group) => {
    let to_countries = [];
    switch (group) {
        case 'Asia':
            to_countries = country['Asia'];
            break;
        case 'America':
            to_countries = country['America'];
            break;
        case 'Oceania':
            to_countries = country['Oceania'];
            break;
        case 'Euro':
            to_countries = country['Euro'];
            break;
    }

    return to_countries;
};

const setFromCountries = (countries) => {
    if (from_country.firstChild) {
        from_country.replaceChildren();
    }
    for (var i = 0; i < countries.length; i++) {
        let option = document.createElement('option');
        option.value = countries[i];
        option.append(countries[i]);
        from_country.append(option);
    }
    from_currency = from_country.options[from_country.selectedIndex].value;
    currency_cal_btn.disabled = false;
    // setting selectbox for save
    if (save_from_country) {
        if (save_from_country.firstChild) {
            save_from_country.replaceChildren();
        }
        let fromOption = document.createElement('option');
        fromOption.value = from_currency;
        fromOption.append(from_currency);
        save_from_country.append(fromOption);
    }
};

const setToCountries = (countries) => {
    if (to_country.firstChild) {
        to_country.replaceChildren();
    }
    for (var i = 0; i < countries.length; i++) {
        let option = document.createElement('option');
        option.value = countries[i];
        option.append(countries[i]);
        to_country.append(option);
    }
    to_currency = to_country.options[to_country.selectedIndex].value;
    currency_cal_btn.disabled = false;
    // setting selectbox for save
    if (save_to_country) {
        if (save_to_country.firstChild) {
            save_to_country.replaceChildren();
        }
        let toOption = document.createElement('option');
        toOption.value = to_currency;
        toOption.append(to_currency);
        save_to_country.append(toOption);
    }
};

const handleChangeFromGroup = (e) => {
    console.log(e);
    const from_group = e.target.value;
    const countries = pick_from_group(from_group);
    setFromCountries(countries);
};

const handleChangeToGroup = (e) => {
    const to_group = e.target.value;
    const countries = pick_to_group(to_group);
    setToCountries(countries);
};

from_country_group.addEventListener('change', handleChangeFromGroup);

to_country_group.addEventListener('change', handleChangeToGroup);

const handleChangeFromCountry = (e) => {
    from_currency = e.target.value;
    currency_cal_btn.disabled = false;
};

from_country.addEventListener('change', handleChangeFromCountry);

const handleChangeToCountry = (e) => {
    to_currency = e.target.value;
    currency_cal_btn.disabled = false;
};

to_country.addEventListener('change', handleChangeToCountry);

// save selectbox input handle
const setSaveFromCountry = (e) => {
    let from = e.target.value;
    if (save_from_country) {
        if (save_from_country.firstChild) {
            save_from_country.replaceChildren();
        }
        let fromOption = document.createElement('option');
        fromOption.value = from;
        fromOption.append(from);
        save_from_country.append(fromOption);
    }
};

from_country.addEventListener('input', setSaveFromCountry);

const setSaveToCountry = (e) => {
    let to = e.target.value;
    if (save_to_country) {
        if (save_to_country.firstChild) {
            save_to_country.replaceChildren();
        }
        let toOption = document.createElement('option');
        toOption.value = to;
        toOption.append(to);
        save_to_country.append(toOption);
    }
};

to_country.addEventListener('input', setSaveToCountry);
// switch country
const switchCountry = (e) => {
    e.preventDefault();
    from_group = to_country_group.value;
    to_group = from_country_group.value;
    from_country_group.value = from_group;
    to_country_group.value = to_group;

    let from = to_country.value;
    console.log(from);
    let to = from_country.value;
    console.log(to);

    const fromCountries = pick_from_group(from_group);
    setFromCountries(fromCountries);
    const toCountries = pick_to_group(to_group);
    setToCountries(toCountries);
    from_country.value = from;
    to_country.value = to;

    if (save_from_country.firstChild) {
        save_from_country.replaceChildren();
    }
    let fromOption = document.createElement('option');
    fromOption.value = from;
    fromOption.append(from);
    save_from_country.append(fromOption);

    if (save_to_country.firstChild) {
        save_to_country.replaceChildren();
    }
    let toOption = document.createElement('option');
    toOption.value = to;
    toOption.append(to);
    save_to_country.append(toOption);

    updateCurrencyRate();
};

switchBtn.addEventListener('click', switchCountry);

const updateCurrencyRate = () => {
    let currency_main_form = document.getElementById('currency_main_form');
    const formData = new FormData(currency_main_form);
    console.log(`form data : ${new URLSearchParams(formData).toString()}`);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/getCurrencyRate?' + new URLSearchParams(formData).toString(), true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.currency_rate) {
                let currencyRateElement = document.getElementById('currency_rate');
                currencyRateElement.textContent = '현재 환율: ' + response.currency_rate;
            }
        }
    };

    xhr.onerror = function () {
        console.error('Error occurred during the request.');
    };
};
/**
 *
 * to-do: return script func into python schedule func
 */
// let intervalId;
// get real time currency-rate

const getCurrencyRate = (e) => {
    e.preventDefault();

    updateCurrencyRate();

    // currency_cal_btn.disabled = true;

    // if (intervalId) {
    //   clearInterval(intervalId);
    // }

    // intervalId = setInterval(updateCurrencyRate, 5000)
};

currency_cal_btn.addEventListener('click', getCurrencyRate);
currency_main_form.addEventListener('submit', (e) => {
    e.preventDefault();
});

// currency goal input regEx

currencyInput.addEventListener('input', function () {
    // Extract only numbers and decimals.
    const number = this.value.replace(/[^\d.]/g, '');

    // f there are decimal numbers, display up to three digits below the decimal point.
    const parts = number.split('.');
    // Add commas for thousands
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Set a value in the input field.
    if (parts.length === 1) {
        // If there are no numbers after the decimal point.
        this.value = integerPart;
    } else {
        // Display up to three decimal places.
        const decimalPart = parts[1].slice(0, 3);
        // return formatted number
        this.value = `${integerPart}.${decimalPart}`;
    }
});

const handleSaveGoalCurrency = (e) => {
    e.preventDefault();
    let currency_save_form = document.getElementById('currency_save_form');
    save_from_country.disabled = false;
    save_to_country.disabled = false;
    const formData = new FormData(currency_save_form);
    save_from_country.disabled = true;
    save_to_country.disabled = true;
    console.log(`save form data : ${new URLSearchParams(formData).toString()}`);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/saveGoalCurrencyRate', true);
    xhr.send(formData);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let response = JSON.parse(xhr.response);
        }
    };
};
save_currency_btn.addEventListener('click', handleSaveGoalCurrency);
// service-worker

const isServiceWorkerSupported = 'serviceWorker' in navigator;
if (isServiceWorkerSupported) {
    //브라우저에 Service Worker를 등록
    navigator.serviceWorker
        .register('service-worker.js', { scope: '/' })
        .then(function (registration) {
            console.log('[ServiceWorker] 등록 성공: ', registration.scope);
        })
        .catch(function (err) {
            console.log('[ServiceWorker] 등록 실패: ', err);
        });
}
// notification
const createNotification = () => {
    let notification = new Notification('', {});
};

const checkNotificationPromise = () => {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }

    return true;
};

const askNotificationPermission = () => {
    // 권한을 실제로 요구하는 함수
    const handlePermission = (permission) => {
        // 사용자의 응답에 관계 없이 크롬이 정보를 저장할 수 있도록 함
        if (!('permission' in Notification)) {
            Notification.permission = permission;
        }

        // 사용자 응답에 따라 단추를 보이거나 숨기도록 설정
        if (Notification.permission === 'denied' || Notification.permission === 'default') {
            notificationBtn.style.display = 'block';
        } else {
            notificationBtn.style.display = 'none';
        }
    };

    // 브라우저가 알림을 지원하는지 확인
    if (!('Notification' in window)) {
        alert('이 브라우저는 알림을 지원하지 않습니다.');
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission().then((permission) => {
                handlePermission(permission);
            });
        } else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
};
