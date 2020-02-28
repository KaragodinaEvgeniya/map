
// eslint-disable-next-line no-undef
ymaps.ready(init);



var modal = document.getElementById('balloon');
let closeModal = document.getElementById('close');
var feedbacksArray = [];
function init() {
    // eslint-disable-next-line no-undef
    var myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 13,
        controls: ['zoomControl'],
        behaviors: ['drag', 'dblClickZoom', 'scrollZoom']
    }, {
        searchControlProvider: 'yandex#search',
        geoObjectOpenBalloonOnClick: false
    });

    // eslint-disable-next-line no-undef
    var clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedDarkOrangeClusterIcons',
        clusterDisableClickZoom: true,
        openBalloonOnClick: true,
        groupByCoordinates: false,
        clusterBalloonContentLayout: 'cluster#balloonCarousel'
    });

    myMap.geoObjects.add(clusterer);

    myMap.events.add('click', function(e) {
        var coords = e.get('coords');
        // eslint-disable-next-line no-undef
        var geoCoords = ymaps.geocode(coords);
        var position = e.get('position');
        modal.classList.add('balloon--active');
        geoCoords.then(res => {
            var obj = {};

            obj.coords = coords;
            obj.address = res.geoObjects.get(0).properties.get('text');
            obj.comments = [];

            if (position[1] > window.screen.availHeight - 526) {
                position[1] = window.screen.availHeight - 526;
            }
            if (position[0] > window.screen.availWidth - 380) {
                position[0] = window.screen.availWidth - 760;
            }

            modal(obj, myMap, position, clusterer, '');
        });
    });

    function openModal(obj, myMap, position, clusterer, hintContent) {
        addFeedback(obj, myMap, position, clusterer, modal, hintContent);
    }

    function addFeedback(obj, myMap, position, clusterer, modal, hintContent){
        var inputName = document.getElementsByTagName('name');
        var inputPlace = document.getElementsByTagName('place');
        var inputText = document.getElementsByTagName('comment');
        var addButton = document.getElementById('btn')[document.getElementById('btn').length - 1];
        var myInput = document.getElementById('address');

        myInput.innerHTML = obj.address;

        var feedbacks = document.getElementById('balloon-list');
        var feedback = document.createElement('li');

        feedback.classList.add('feedback');
        feedback.innerHTML = hintContent;
        feedbacks.appendChild(feedback);

        addButton.addEventListener('click', (p) => {
            p.preventDefault();
            if (inputName.value && inputPlace.value && inputText.value) {
                var feedback = document.createElement('li');

                var name = document.createElement('div');
                var place = document.createElement('div');
                var text = document.createElement('div');
                var day = document.createElement('div');
                var firstLine = document.createElement('div');

                name.innerHTML = inputName.value;
                place.innerHTML = inputPlace.value;
                text.innerHTML = inputText.value;

                var date = new Date();

                day.innerHTML = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();

                feedback.classList.add('feedback');
                name.classList.add('feedback__name');
                place.classList.add('feedback__place');
                text.classList.add('feedback__text');
                firstLine.classList.add('feedback__firstLine');

                firstLine.appendChild(name);
                firstLine.appendChild(place);
                firstLine.appendChild(day);

                feedback.appendChild(firstLine);
                feedback.appendChild(text);

                feedbacks.appendChild(feedback);

                inputName.value = '';
                inputPlace.value = '';
                inputText.value = '';

                placemarks(obj, myMap, position, clusterer, modal);
                feedbacksArray.push(feedback);
            } else {
                alert('Заполните все поля!')
            }
        })
    }

    function placemarks(obj, myMap, position, clusterer, modal) {
        // eslint-disable-next-line no-undef
        var placemark = new ymaps.Placemark(obj.coords, {
            hintContent: modal.children[1].lastChild.innerHTML,
            modalContent: obj.address + modal.children[1].lastChild.innerHTML
        }, {
            preset: 'islands#darkOrangeDotIcon',
            openHintOnHover: false
        });

        myMap.geoObjects.add(placemark);
        clusterer.add(placemark);

        placemark.events.add('click', () => {
            openModal(obj, myMap, position, clusterer, placemark.properties._data.hintContent);
        })
    }


    closeModal.addEventListener('click', function(){
        modal.classList.remove('balloon--active');
        modal.innerHTML = '';
    });

}