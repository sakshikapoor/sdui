

function filterPincodes(target) {
    pincodeFunction.setPincode(target.value);
    fetchData();
}

var debouncefilterPincodes = debounce(filterPincodes, 500);


function debounce(func, delay) {
    let timer;
    return function (...arg) {
        const context = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = func.apply(context, arg);
        }, delay)
    }
}


var pageData = {
    getData: function () {
        return this.data;
    },
    setData: function (data) {
        this.data = data;
    }
}

var pincodeFunction = {
    setPincode: function (pincode) {
        localStorage.setItem('pin', pincode);
    },
    getPincode: function () {
        return (localStorage.getItem('pin'));
    }
}

function fetchData() {
    const localStorageData = pageData.getData()
    if (localStorageData && localStorageData.length) {
        renderPincodeData(localStorageData);
    } else {
        fetch('https://flipkart-page-api.now.sh').then(res => res.json()).then((res) => {
            pageData.setData(res);
            renderPincodeData(res);
        });
    }

    const pin = pincodeFunction.getPincode();
    if (pin && pin.length) {
        document.getElementById('pinInput').value = pin;
    }
}


function renderPincodeData(res) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    renderPageData(container, res);
}

function renderPageData(container, data) {
    if (!data) {
        return
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i].slotType === "WIDGET") {
            renderWidget(container, data[i]);
        } else {
            const widdgetContainer = document.createElement('div');
            widdgetContainer.className = 'widget-container';
            container.appendChild(widdgetContainer);
            renderPageData(widdgetContainer, data[i].children)
        }
    }
}

function renderWidget(container, data) {
    const pincode = pincodeFunction.getPincode();
    const isWidgetAccessible = (!pincode) || (data.serviceablePincodes ? data.serviceablePincodes.includes(pincode) : true);
    if (isWidgetAccessible) {
        const img = data.assets[0].imageUrl;
        const imageContainer = document.createElement('img');
        imageContainer.classList.add('widget');
        imageContainer.setAttribute('src', img);
        imageContainer.setAttribute('width', data.grow);
        imageContainer.setAttribute('height', '250px');
        imageContainer.addEventListener('click', widgetClickHandler)
        container.appendChild(imageContainer)
    }
}

function widgetClickHandler(event) {
    const isClicked = (event.target).classList.contains('border');
    if (!isClicked) {
        (event.target).classList.add('border');
    } else {
        (event.target).classList.remove('border')
    }
}