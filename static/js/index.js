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
const saved_goal_currencies = document.querySelectorAll('.saved_goal_currency');
const getCurrencyRateNotiBtn = document.getElementById('getCurrencyRateNotiBtn');
const deleteCurrencyRateBtns = document.querySelectorAll('.deleteCurrencyRateBtn');
const updateCurrencyRateBtns = document.querySelectorAll('.updateCurrencyRateBtn');
const saveCurrencyRateBtns = document.querySelectorAll('.saveCurrencyRateBtn');
const cancelBtns = document.querySelectorAll('.cancelBtn');
const subscribeBtns = document.querySelectorAll('.subscribeBtn');
const unSubscribeBtns = document.querySelectorAll('.unSubscribeBtn');
const targetCurrencyListSize = document.querySelector('.targetCurrencyListSize');
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

    if (save_from_country) {
        if (save_from_country.firstChild) {
            save_from_country.replaceChildren();
        }
        let fromOption = document.createElement('option');
        fromOption.value = from;
        fromOption.append(from);
        save_from_country.append(fromOption);
    }

    if (save_to_country) {
        if (save_to_country.firstChild) {
            save_to_country.replaceChildren();
        }
        let toOption = document.createElement('option');
        toOption.value = to;
        toOption.append(to);
        save_to_country.append(toOption);
    }

    updateCurrencyRate();
};

switchBtn.addEventListener('click', switchCountry);

const updateCurrencyRate = () => {
    let currency_main_form = document.getElementById('currency_main_form');
    const formData = new FormData(currency_main_form);
    // console.log(`form data : ${new URLSearchParams(formData).toString()}`);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/getCurrencyRate?' + new URLSearchParams(formData).toString(), true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.currency_rate) {
                let currencyRateElement = document.querySelector('.currency_rate');
                currencyRateElement.textContent = 'Current Currency rate';
                let currencyFrom = document.querySelector('.currency_rate_from');
                currencyFrom.textContent = `1 ${from_country.value}`;
                let currency_rate_stick = document.querySelector('.currency_rate_stick');
                currency_rate_stick.textContent = '|';
                let currencyRate = document.querySelector('.currency_rate_value');
                currencyRate.textContent = response.currency_rate;
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

// get real time currency-rate

const getCurrencyRate = (e) => {
    e.preventDefault();

    updateCurrencyRate();

    // currency_cal_btn.disabled = true;
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

// save Target Currency
const handleSaveTargetCurrency = (e) => {
    e.preventDefault();
    if (targetCurrencyListSize.getAttribute('data-id') >= 4) {
        let warn_message = document.querySelector('.warn_message');
        warn_message.textContent = 'You can save up to 4 exchange rates.';
        return false;
    }
    let currency_save_form = document.getElementById('currency_save_form');
    let currency_Input = currency_save_form.currencyInput.value;

    currency_Input = parseFloat(currency_Input.replace(/,/g, ''));
    currency_save_form.currencyInput.value = currency_Input;

    save_from_country.disabled = false;
    save_to_country.disabled = false;

    const formData = new FormData(currency_save_form);
    save_from_country.disabled = true;
    save_to_country.disabled = true;

    // console.log(`save form data : ${new URLSearchParams(formData).toString()}`);
    // console.log(`formData : ${formData.toString()}`);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/saveTargetCurrencyRate', true);
    xhr.send(formData);

    xhr.onreadystatechange = async function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let response = JSON.parse(xhr.response);
            // console.log(response);
            await showSubscriptionToast('saved', 2000);
            location.reload();
        }
    };
};
save_currency_btn.addEventListener('click', handleSaveTargetCurrency);

getCurrencyRateNotiBtn.addEventListener('click', function () {
    getCurrencyRateNotiBtn.classList.toggle('rotate');
    const goalCurrencyList = document.querySelector('.goalCurrencyList');
    goalCurrencyList.classList.toggle('show-content');
});

// delete Notification
const handleDeleteTargetCurrency = async (e) => {
    const content = e.target.closest('.content');
    let id = content.querySelector('.notificationId').value;
    //console.log(iargetCurrencyListSize.getAttribute('data-id');
    listsize = Number(listsize);
    targetCurrencyListSize.textContent = listsize - 1;
    targetCurrencyListSize.setAttribute('data-id', listsize - 1);
};
deleteCurrencyRateBtns.forEach((btn) => {
    btn.addEventListener('click', handleDeleteTargetCurrency);
});

// edit currency rate

updateCurrencyRateBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const editBtn = btn;
        const form = editBtn.closest('.content').querySelector('form');
        const input = form.querySelector('.saved_goal_currency');
        input.readOnly = !input.readOnly;
        input.focus();

        const btn_group = editBtn.closest('.content__btn_group');
        const saveBtn = btn_group.querySelector('.saveCurrencyRateBtn');
        saveBtn.classList.remove('hidden_Btn');
        editBtn.classList.add('hidden_Btn');

        const deleteBtn = btn_group.querySelector('.deleteCurrencyRateBtn');
        deleteBtn.classList.add('hidden_Btn');

        const cancelBtn = btn_group.querySelector('.cancelBtn');
        cancelBtn.classList.remove('hidden_Btn');
    });
});

cancelBtns.forEach((btn) => {
    let saved_goal_currency = null;
    const input = btn.closest('.content').querySelector('form').querySelector('.saved_goal_currency');
    input.addEventListener('focus', (e) => {
        saved_goal_currency = e.target.value;
    });
    btn.addEventListener('click', (e) => {
        btn.classList.add('hidden_Btn');
        const form = btn.closest('.content').querySelector('form');
        const input = form.querySelector('.saved_goal_currency');
        input.value = saved_goal_currency;
        input.readOnly = !input.readOnly;
        const btn_group = btn.closest('.content__btn_group');
        const saveBtn = btn_group.querySelector('.saveCurrencyRateBtn');
        saveBtn.classList.add('hidden_Btn');
        const delBtn = btn_group.querySelector('.deleteCurrencyRateBtn');
        delBtn.classList.remove('hidden_Btn');
        const editBtn = btn_group.querySelector('.updateCurrencyRateBtn');
        editBtn.classList.remove('hidden_Btn');
    });
});
// edit-save
const handleSaveCurrencyRate = async (e) => {
    const form = e.target.closest('.content').querySelector('form');
    const input = form.querySelector('.saved_goal_currency');
    const value = input.value;
    const id = e.target.getAttribute('data-id');
    const data = {
        saved_goal_currency: value,
        id: id,
    };
    await fetch('/updateCurrencyNotification', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            //console.log('from update server ::: ', result);
            location.reload();
        })
        .catch((e) => {
            console.log('error : ', e);
        });
};
saveCurrencyRateBtns.forEach((btn) => {
    btn.addEventListener('click', handleSaveCurrencyRate);
});

// subscription info var
// let subscription_json = null;
// let severKey = null;

// set service-worker & subscribe info

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const updateSubscriptionOnSever = async (data, apiEndPoint) => {
    //console.log('data:::', data);
    await fetch(apiEndPoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            //console.log('from update server ::: ', result);
            showSubscriptionToast(result.message, 2000);
        })
        .catch((e) => {
            console.log('error : ', e);
        });
};

function subscribeUser(swRegistration, applicationServerPublicKey, apiEndPoint, data) {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
        })
        .then(function (subscription) {
            //console.log('User is subscribed.', JSON.stringify(subscription));
            // data append
            data.subscription_json = JSON.stringify(subscription);
            return updateSubscriptionOnSever(data, apiEndPoint);
        })
        .then((result) => {
            //console.log('from update server ::: ', result);
            showSubscriptionToast(result.message, 2000);
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
            console.log(err.stack);
        });
}

// register service-worker

function registerServiceWorker(serviceWorkerUrl, applicationServerPublicKey) {
    let swRegistration = null;
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');

        navigator.serviceWorker
            .register(serviceWorkerUrl)
            .then(function (swReg) {
                console.log('Service Worker is registered', swReg);
                subscription_json = swReg;
                severKey = applicationServerPublicKey;
                swRegistration = swReg;
            })
            .catch(function (error) {
                console.error('Service Worker Error', error);
            });
    } else {
        console.warn('Push messaging is not supported');
    }
    return swRegistration;
}

// subscription : 1 unsubscription : 0
// show subscription toast
const showSubscriptionToast = (msg, duration) => {
    const toast__content = document.querySelector('.toast__content');
    toast__content.textContent = msg;
    toast__content.classList.add('show-toast');
    setTimeout(() => {
        toast__content.classList.remove('show-toast');
    }, duration);
};

const handleUpdateSubscription = (isSubscribed, id) => {
    const data = {
        is_subscribed: isSubscribed,
        id: id,
    };
    subscribeUser(subscription_json, severKey, '/updateSubscription', data);
};

// subscribe Btn
subscribeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const btnGrp = btn.closest('.subscribe__btn_group');
        const unSubBtn = btnGrp.querySelector('.unSubscribeBtn');
        unSubBtn.classList.toggle('hidden_Btn');
        btn.classList.toggle('hidden_Btn');
        const id = btn.getAttribute('data-id');
        const isSubscribed = 1;
        handleUpdateSubscription(isSubscribed, id);
    });
});
// unsubscribe Btn
unSubscribeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const btnGrp = btn.closest('.subscribe__btn_group');
        const subBtn = btnGrp.querySelector('.subscribeBtn');
        subBtn.classList.toggle('hidden_Btn');
        btn.classList.toggle('hidden_Btn');
        const id = btn.getAttribute('data-id');
        const isSubscribed = 0;
        handleUpdateSubscription(isSubscribed, id);
    });
});
