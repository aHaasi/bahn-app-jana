var translation = [
    {en: "clear sky", de: "Blauer Himmel", colorCls: "weather-sunny"},
    {en: "few clouds", de: "Wenig bewölkt", colorCls: "weather-cloudy"},
    {en: "scattered clouds", de: "Bewölkt", colorCls: "weather-cloudy"},
    {en: "broken clouds", de: "Durchbrochende Wolkendecke", colorCls: "weather-sunny"},
    {en: "shower rain", de: "Regenschauer", colorCls: "weather-rainy"},
    {en: "rain", de: "Regen", colorCls: "weather-rainy"},
    {en: "thunderstorm", de: "Gewitter", colorCls: "weather-thunder"},
    {en: "snow", de: "Schnee", colorCls: "weather-snow"},
    {en: "mist", de: "Nebel", colorCls: "weather-snow"},
    {en: "light rain", de: "Leichter Regen", colorCls: "weather-rainy"},
    {en: "overcast clouds", de: "Dichte Wolkendecke", colorCls: "weather-cloudy"}
];
var millisecondsToWaitWeather = 900000;
var millisecondsTrains = 120000;
var millisecondsForTime = 10000;
var millisecondsToWaitBirthday = 600000;
var departureStation, arrivalStation, searchedCity, otherStationsArray;

// For todays date;
Date.prototype.today = function () {
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"."+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"."+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
}

function setCurrentDateTime(){
    var newDate = new Date();
    $('.current-date').text(newDate.today());
    $('.current-time').text(newDate.timeNow());
}

function setCurrentDateTimeInterval(){
    setInterval(function() {
        setCurrentDateTime();
    }, millisecondsForTime);
}

function getWeather(apiUrl, apiId, id, cityName){
    $.getJSON(apiUrl + "/weather?id="+id+"&&units=metric&APPID="+apiId, function( data ) {
        var weather = data.weather[0];
        $("."+cityName + " .currentTemp").text(Math.round(data.main.temp) + "°");
        var trans = getTranslation(weather.description);
        $("."+cityName + " .currentWeather").text(trans);
        var colorCls = getWeatherCls(weather.description);
        removeOldWeatherClass(cityName);
        $("."+cityName).addClass(colorCls);

        setImage("."+cityName + " .weatherCurrentImg", weather.icon);
    });
}

function removeOldWeatherClass(cityName){
    for(var i=0; i<translation.length; i++){
        $("."+cityName).removeClass(translation[i].colorCls);
    }
}

function setWeatherInterval(apiUrl, apiId, id, cityName){
    setInterval(function() {
        getWeather(apiUrl, apiId, id, cityName);
    }, millisecondsToWaitWeather);
}

function getForecast(apiUrl, apiId, id, cityName){
    $.getJSON(apiUrl + "/forecast/daily?id="+id+"&&units=metric&APPID="+apiId, function( data ) {
        var dataList = data.list;
        //current day
        var currentDay = getWeatherDates(dataList, 0);
        $("."+cityName + " .currentTempMin").text(Math.round(currentDay.temp.min) + "°");
        $("."+cityName + " .currentTempMax").text(" / " + Math.round(currentDay.temp.max) + "°");

        //tomorrow
        var tomorrow = getWeatherDates(dataList, 1);
        $("."+cityName + " .weatherTomorrowTempMin").text(Math.round(tomorrow.temp.min) + "°");
        $("."+cityName + " .weatherTomorrowTempMax").text(" / " + Math.round(tomorrow.temp.max) + "°");
        setImage("."+cityName + " .weatherTomorrowImg", tomorrow.weather[0].icon);

        //in 2 days
        var in2Days = getWeatherDates(dataList, 2);
        $("."+cityName + " .weatherIn2DaysTempMin").text(Math.round(in2Days.temp.min) + "°");
        $("."+cityName + " .weatherIn2DaysTempMax").text(" / " + Math.round(in2Days.temp.max) + "°");
        setImage("."+cityName + " .weatherIn2DaysImg", in2Days.weather[0].icon);
        $("."+cityName + " .weatherIn2DaysDate").text(getDay(in2Days.dt));

        //in 3 days
        var in3Days = getWeatherDates(dataList, 3);
        $("."+cityName + " .weatherIn3DaysTempMin").text(Math.round(in3Days.temp.min) + "°");
        $("."+cityName + " .weatherIn3DaysTempMax").text(" / " + Math.round(in3Days.temp.max) + "°");
        setImage("."+cityName + " .weatherIn3DaysImg", in3Days.weather[0].icon);
        $("."+cityName + " .weatherIn3DaysDate").text(getDay(in3Days.dt));
    });
}

function setForecastIntervall(apiUrl, apiId, id, cityName){
    setInterval(function() {
        getForecast(apiUrl, apiId, id, cityName);
    }, millisecondsToWaitWeather);
}

function getIconSrc(currentImageUrl, imageName){
    if(currentImageUrl){
        var imagePath = currentImageUrl.substring(0, currentImageUrl.lastIndexOf('/')+1);
        var icon = imageName;
        if(icon.indexOf('n')>-1){
            icon = icon.replace('n', 'd');
        }
        return imagePath + icon + ".png";
    }
}

function setImage(imageClass, icon){
    var imageSrc = $(imageClass).attr("src");
    if(imageSrc){
        $(imageClass).attr("src", getIconSrc(imageSrc, icon));
    }
}
/**
 * Get day formatted as dd.mm.
 * @param timestamp
 * @returns {string}
 */
function getDay(timestamp){
    var date = new Date(timestamp*1000);
    var day = date.getDate() < 10 ? '0'+  date.getDate() :  date.getDate();
    var correctMonth = date.getMonth() +1;
    var month = correctMonth < 10 ? '0'+  correctMonth :  correctMonth;
    return day + "." + month + ".";
}

/**
 * Return true if 2 dates are the same
 * @param date1
 * @param date2
 * @returns {boolean}
 */
function compareDay(date1, date2){
    var resettedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), 0, 0, 0);
    var resettedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 0, 0, 0);
    return resettedDate1.getTime() === resettedDate2.getTime();
}

/**
 * Get the weather dates of specific date
 * @param dataList
 * @param daysInFuture: days in future: 0 is today, 1 tomorrow,..
 * @returns {*}
 */
function getWeatherDates(dataList, daysInFuture){
    var searchedDate = new Date();
    if(daysInFuture > 0){
        searchedDate.setDate(searchedDate.getDate() + daysInFuture);
    }
    for(var i=0; i<dataList.length; i++){
        var dateOfWeather = new Date(dataList[i].dt*1000);
        if(compareDay(dateOfWeather, searchedDate)){
            return dataList[i];
        }
    }
    return null;
}

/**
 * Get the translation of current weather
 * @param en
 * @returns {*}
 */
function getTranslation(en){
    for(var i=0; i<translation.length; i++){
        if(translation[i].en === en){
            return translation[i].de;
        }
    }
    return en;
}

/**
 * Get the weather class of current weather
 * @param en
 * @returns {*}
 */
function getWeatherCls(en){
    for(var i=0; i<translation.length; i++){
        if(translation[i].en === en){
            return translation[i].colorCls;
        }
    }
    return en;
}

/**
 * Get the names of people that has today his birthday
 * @param birthdays
 */
function getCurrentBirthday(birthdays){
    var birthdayArray = getBirthdayArray(birthdays);
    var today = new Date();
    var todayISO = today.toISOString();
    var todayDate = todayISO.substring(0, todayISO.indexOf('T'));
    var yearOfToday = today.getUTCFullYear();
    var people = getBirthdayPeople(birthdayArray, todayDate);
    if(people.length > 1){
        $(".birthday-start-text").text('Heute haben ');
    }else{
        $(".birthday-start-text").text('Heute hat ');
    }
    var names = '';
    for(var i=0; i<people.length; i++){
        var age = yearOfToday - parseInt(people[i].year);
        names += people[i].name + ' (' + age + ' Jahre)';
        if(i !== people.length -1){
            names += ', '
        }
    }
    if(people.length === 0){
        $(".birthday-people").text('niemand');
    }else{
        $(".birthday-people").text(names);
    }
    $(".birthday-end-text").text(' Geburtstag');
}

function setBirthdayInterval(birthdays){
    setInterval(function() {
        getCurrentBirthday(birthdays);
    }, millisecondsToWaitBirthday);
}

/**
 * Format the yml file and save all birthdays in an array.
 * @param birthdays
 * @returns {Array}
 */
function getBirthdayArray(birthdays){
    var unformattedArray = birthdays.split('",');
    var formattedArray = [];
    for(var i=0; i<unformattedArray.length; i++){
        var currentLine = unformattedArray[i].trim();
        var names = '';
        if(i === unformattedArray.length -1){
            names = currentLine.substring(currentLine.indexOf('=>"') + 3, currentLine.length-2);
        }else{
            names = currentLine.substring(currentLine.indexOf('=>"') + 3, currentLine.length);
        }

        var date = currentLine.split(' ')[1];
        formattedArray[date] = names;
    }

    return formattedArray;
}

/**
 * Iterate over birthday array and return all people that has birthday on specific date.
 * @param birthdayArray
 * @param searchedDate
 * @returns {Array}
 */
function getBirthdayPeople(birthdayArray, searchedDate){
    var names = [];
    var todayDay = searchedDate.substring(5, searchedDate.length);
    for(var key in birthdayArray){
        var date = key.substring(5, key.length);
        if(date === todayDay){
            var year = key.substring(0, 4);
            names.push({name: birthdayArray[key], year: year});
        }
    }
    return names;
}

/**
 * Get the current trains. Send request to get all trains.
 * @param departure
 * @param arrival
 * @param cityName
 * @param departureStationId
 * @param otherStations
 */
function getCurrentTrains(departure, arrival, cityName, departureStationId, otherStations){
    departureStation = departure;
    arrivalStation = arrival;
    searchedCity = cityName;

    if(otherStations){
        otherStationsArray = otherStations.split(',');

        for(var i=0; i<otherStationsArray.length; i++){
            otherStationsArray[i] = otherStationsArray[i].trim();
        }
    }

    $('.train-details').empty();
    $('.train-details').append(getEmptyTrainText());

    $.ajax({
        url: 'http://localhost/currentTrains.php?id='+departureStationId,
        success: function(data) {
            requestTrainDetails(getTrains(data));

        }
    });
}

function getEmptyTrainText(){
    return '<div class="train-connection border-radius"><p>Aktuell liegen keine Daten über diese Zugverbindung vor</p></div>';
}

function setTrainInterval(departure, arrival, cityName, arrivalStationId){
    setInterval(function() {
        getCurrentTrains(departure, arrival, cityName, arrivalStationId);
    }, millisecondsTrains);
}

/**
 * Filter the trains from table.
 * @param data
 * @returns {Array}
 */
function getTrains(data){
    var start = data.indexOf('<table class="result stboard dep"');
    var end = data.indexOf('</table>', data.indexOf('<table class="result stboard dep"'));
    var dataList = [];
    if(start > -1 && end >-1){
        var tableOfResult = data.substring(start, end);
        var htmlObject = $.parseHTML(tableOfResult);
        var children = htmlObject[0].children[0].children;
        for(var i=0; i<children.length; i++){
            var child = children[i];
            if(child.id.indexOf('journeyRow') > -1){
                if(checkSearchedTrainStationIsIn(searchedCity, child.children)){
                    dataList.push({
                        id: removeReturnCharacter(getIdOfTrain(child.children)),
                        url: getUrlOfTrain(child.children),
                        time: getTimeOfTrain(child.children)
                    });
                }else{
                    for(var j=0; j<otherStationsArray.length; j++){
                        if(checkSearchedTrainStationIsIn(otherStationsArray[j], child.children)){
                            dataList.push({
                                id: removeReturnCharacter(getIdOfTrain(child.children)),
                                url: getUrlOfTrain(child.children),
                                time: getTimeOfTrain(child.children)
                            });
                        }
                    }
                }
            }
        }
    }
    return dataList.sort(compare);

}

/**
 * Check if searched train station stands in children html elements.
 * @param trainStation
 * @param children
 * @returns {boolean}
 */
function checkSearchedTrainStationIsIn(trainStation, children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "route"){
            if(child.innerText.indexOf(trainStation)>-1){
                return true;
            }
        }
    }
    return false;
}

/**
 * Returns the url of details of train.
 * @param children
 * @returns {*}
 */
function getUrlOfTrain(children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "train"){
            for(var j=0; j<child.children.length; j++){
                if(child.children[j].localName === 'a'){
                    var linkChild = child.children[j];
                    if(linkChild.href.indexOf('localhost') === -1){
                        return linkChild.href;
                    }
                }
            }
        }
    }
    return null;
}

/**
 * Return the id of the train.
 * @param children
 * @returns {*}
 */
function getIdOfTrain(children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "train"){
            for(var j=0; j<child.children.length; j++){
                if(child.children[j].localName === 'a'){
                    var linkChild = child.children[j];
                    if(linkChild.href.indexOf('localhost') > -1){
                        return linkChild.innerHTML;
                    }
                }
            }
        }
    }
    return null;
}

/**
 * Get the current arrival time of train.
 * @param children
 * @returns {*}
 */
function getTimeOfTrain(children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "time"){
            return child.innerHTML;
        }
    }
    return null;
}

/**
 * Compare the train objects by parameter time.
 * @param a
 * @param b
 * @returns {number}
 */
function compare(a,b) {
    if (a.time < b.time)
        return -1;
    if (a.time > b.time)
        return 1;
    return 0;
}

/**
 * Send request to get the train details. Save the data.
 * @param trains
 */
function requestTrainDetails(trains){
    $('.train-details').empty();
    if(trains.length === 0){
        $('.train-details').append(getEmptyTrainText());
    }
    for(var i=0; i<trains.length; i++){
        var sendData = trains[i];

        $.ajax({
            type      : 'POST', //Method type
            url       : 'http://localhost/trainDetails.php', //Your form processing file URL
            data      : sendData, //Forms name
            dataType  : 'json',
            success   : function(data) {
                var htmlElem = data.html;
                var start = htmlElem.indexOf('<table class="result stboard train"');
                var end = htmlElem.indexOf('</table>', htmlElem.indexOf('<table class="result stboard train"'));
                var trainDetails = null;
                if(start > -1 && end >-1){
                    var tableOfResult = htmlElem.substring(start, end);
                    var htmlObject = $.parseHTML(tableOfResult);
                    var children = htmlObject[0].children[0].children;
                    if(children){
                        var startStation = getDataOfStation(departureStation, children, true);
                        var endStation = getDataOfStation(arrivalStation, children, false);
                        if(endStation === null){
                            endStation = getDataOfStation(searchedCity, children, false);
                        }
                        trainDetails = {
                            id: data.id,
                            startStation: startStation,
                            endStation: endStation
                        };
                        appendTrainDataToContainer(trainDetails);
                    }
                }
            }
        });
    }
}

/**
 * Get the data of train from html elements. Returns the data.
 * @param stationName
 * @param children
 * @param isDeparture
 * @returns {{}}
 */
function getDataOfStation(stationName, children, isDeparture){
    for(var i=0; i<children.length; i++){
        var childTr = children[i];
        if(childTr.innerText.indexOf(stationName)> -1){
            var data = {};
            for(var j=0; j<childTr.children.length; j++){
                var info = childTr.children[j];
                if(info.className === 'station'){
                    data.station = removeReturnCharacter(info.innerText);
                }else if(isDeparture && info.className.indexOf('departure') > -1){
                    data.time = removeDelay(removeReturnCharacter(info.innerText));
                    if(info.children.length>0){
                        data.delay = removeReturnCharacter(info.children[0].innerHTML);
                    }
                }else if(!isDeparture && info.className.indexOf('arrival') > -1){
                    data.time = removeDelay(removeReturnCharacter(info.innerText));
                    if(info.children.length>0){
                        data.delay = removeReturnCharacter(info.children[0].innerHTML);
                    }
                }else if(info.className === 'ris'){
                    data.info = removeUnusedString(info.innerHTML);
                }
            }
            return data;
        }
    }
    return null;
}

/**
 * Remove the delay from time.
 * @param str
 * @returns {*}
 */
function removeDelay(str){
    if(str.indexOf('+')>-1){
        return str.substring(0, str.indexOf('+'));
    }else if(str.indexOf('-')>-1){
        return str.substring(0, str.indexOf('-'));
    }else{
        return str;
    }
}

/**
 * Remove the new line character from string.
 * @param str
 * @returns {XML|string|void}
 */
function removeReturnCharacter(str){
    return str.replace(/\r?\n|\r/g, "");
}

/**
 * Remove the unused string from information of train.
 * @param str
 * @returns {XML|string|void}
 */
function removeUnusedString(str){
    if(str.indexOf('&nbsp') -1){
        return str.replace('&nbsp', '');
    }
}

/**
 * Add train data and container to html element.
 * @param trainData
 */
function appendTrainDataToContainer(trainData){
    if(trainData !== null){
        var container = getTrainConnectionContainer(trainData);
        $('.train-details').append(container);
    }
}

/**
 * Container with train details.
 * @param trainData
 * @returns {string}
 */
function getTrainConnectionContainer(trainData){
    var startStationDelay = '';
    if(trainData.startStation && trainData.startStation.delay){
        var delayColor = getColorOfDelay(trainData.startStation.delay);
        startStationDelay = '<span class="departureDelay '+ delayColor +'">'+ trainData.startStation.delay +'</span>';
    }
    var endStationDelay = '';
    if(trainData.endStation && trainData.endStation.delay){
        var delayColor = getColorOfDelay(trainData.endStation.delay);
        endStationDelay = '<span class="arrivalDelay '+ delayColor +'">'+ trainData.endStation.delay +'</span>';
    }

    var container = '<div class="train-connection border-radius"><div class="row"><div class="col-md-2 no-padding-right">'+
        '<p><b>' + trainData.id + '</b></p></div><div class="col-md-1 no-padding-left"><img src="images/icons/32/003-symbol.png"/>'+
        '</div><div class="col-md-3 no-padding-left text-center"><p>'+ trainData.startStation.station +'</p>'+
        '</div><div class="col-md-2 no-padding-left"><img src="images/icons/32/arrows.png"/></div>' +
        '<div class="col-md-1 no-padding-left"><img src="images/icons/32/002-car.png"/></div>' +
        '<div class="col-md-3 no-padding-left text-center"><p>'+ trainData.endStation.station +'</p></div></div>'+
        '<div class="row"><div class="col-md-2 no-padding-right"> </div><div class="col-md-1 no-padding-left"></div>'+
        '<div class="col-md-3 no-padding-left text-center"><p>'+ trainData.startStation.time +' Uhr ' + startStationDelay + '</p>' +
        '</div><div class="col-md-2 no-padding-left"></div><div class="col-md-1 no-padding-left"></div>' +
        '<div class="col-md-3 no-padding-left text-center"><p>'+ trainData.endStation.time +' Uhr '+ endStationDelay + '</p>' +
        '</div></div></div>';

    return container;
}

function getColorOfDelay(delay){
    if(delay.indexOf('+')> -1){
        delay = delay.replace('+', '');
        var delayInInt = parseInt(delay);
        if(delayInInt){
            if(delayInInt > 5){
                return 'red-color';
            }else{
                return 'green-color';
            }
        }
    }
    return 'green-color';
}

$( document ).ready(function() {
    $('.pull-down').each(function() {
        var $this=$(this);
        $this.css('margin-top', $this.parent().height()-$this.height())
    });

});