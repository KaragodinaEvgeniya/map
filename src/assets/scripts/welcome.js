// eslint-disable-next-line no-undef
ymaps.ready(init);
var modal = document.getElementById('balloon');
let closeModal = document.getElementById('close');
var myInput = document.getElementById('address');
let text = document.getElementById('text');
var feedbacks;
var objMap = {};
var count = 0;
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

        addFeedback(coords);
    });

    function addFeedback(coords){
        // eslint-disable-next-line no-undef
        var geoCoords = ymaps.geocode(coords);
        modal.classList.add('balloon--active');

        geoCoords.then(res => {
            var obj = {};
            obj.coords = coords;
            obj.address = res.geoObjects.get(0).properties.get('text');
            obj.comments = [];
            myInput.innerHTML = obj.address;
            feedbacks = document.getElementById('balloon-list');
            var addButton = document.getElementById('btn');

            addButton.addEventListener('click', (e) => {
                e.preventDefault();
                let formContext = document.querySelector('.balloon-form');

                var feedback = document.createElement('li');
                feedbacks.appendChild(feedback);
                var header = document.createElement('div');
                header.innerHTML = `${formContext.name.value} ${formContext.place.value}`;
                feedback.appendChild(header);

                var day = document.createElement('div');
                var date = new Date();
                day.innerHTML = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
                feedback.appendChild(day);

                var footer = document.createElement('div');
                footer.classList.add('review');
                footer.innerHTML = `${formContext.comment.value}`;
                feedback.appendChild(footer);

                var place = `${formContext.place.value}`;
                var comment= `${formContext.comment.value}`;

                objMap[count++] = {coords:coords, name: name, date:date.toString(), message: `<div id=“review”></div>`};


              var  serialObj = JSON.stringify(objMap) ;
                        localStorage.setItem("coords", serialObj);
                // var returnObj = JSON.parse(localStorage.getItem("coords"));

                // eslint-disable-next-line no-undef
                let objectMarker = new ymaps.GeoObject({
                    geometry: { type: "Point", coordinates: coords },
                    preset: 'islands#darkOrangeDotIcon',
                    draggable: true,
                    properties: {
                        balloonContentHeader: '<span> '+ place + ' </span>',
                        balloonContentBody: '<a href=""  class="myLink">' + obj.address + '</a>',

                        balloonContentFooter: '<span>' + comment + '</span>'
                    },
                });


                clusterer.add(objectMarker);
                formContext.reset();
               text.classList.add('balloon__text--delete');

                objectMarker.events.add(['click'],  function () {

                    const div = document.createElement('div');
                    var jsonContent =  JSON.parse(localStorage.getItem("coords"));

                    for (var i in jsonContent.coords) {
                        div.innerHTML = jsonContent.coords[i].name + " " + jsonContent.coords[i].date + " " + jsonContent.coords[i].message;
                        feedbacks.appendChild(div);
                    }
                    modal.classList.add('balloon--active');

                })
            });
        });

    }




    closeModal.addEventListener('click', function(){
        modal.classList.remove('balloon--active');
        clear();
    });
        function clear() {
            document.getElementById('balloon-list').innerHTML = '';
        }
}