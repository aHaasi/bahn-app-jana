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
    {en: "overcast clouds", de: "Dichte Wolkendecke", colorCls: "weather-cloudy"},
    {en: "light intensity shower rain", de: "Regenschauer", colorCls: "weather-rainy"}
];
var millisecondsToWaitWeather = 900000;
var millisecondsTrains = 120000;
var millisecondsLocalTrains = 30000;
var millisecondsForTime = 10000;
var millisecondsToWaitBirthday = 600000;
var millisecondsToWaitToDos = 120000;
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

    var day = today.getDate();
    var month = today.getMonth()+1; //January is 0!
    var year = today.getFullYear();

    if(day<10) {
        day = '0'+day
    }

    if(month<10) {
        month = '0'+month
    }

    var todayDate = year + '-' + month + '-' + day;
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

function setToDoTimeInterval(){
    setInterval(function() {
        trelloLogin();
    }, millisecondsToWaitToDos);
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

function getCurrentLocalTrains(localStationName, localStationId, stationsBetweenString, timeInFuture, trainCounter){
    $('.localTrainName').text(localStationName);
    stationsBetweenString = stationsBetweenString.replace(' ', '');
    var stationsBetween = stationsBetweenString.split(',');
    timeInFuture = parseInt(timeInFuture);
    trainCounter = parseInt(trainCounter);
    $.ajax({
        url: '/currentTrains.php?id='+localStationId,
        success: function(data) {
            var trains = getLocalTrains(data, stationsBetween);
            $('.local-train-container-content').empty();
            if(trains.length > 0){
                for(var i=0; i<trains.length; i++){
                    if(trainCounter > 0){
                        var timeInMin = getArrivalTimeInMinLocalTrain(trains[i]);
                        var delayInMinutes = null;
                        if(trains[i].delay.length > 0){
                            var delay = trains[i].delay;
                            if(delay.indexOf('>') > -1 && delay.indexOf('</')>-1){
                                var delayTime = delay.substring(delay.indexOf('>')+1, delay.indexOf('</'));
                                delayInMinutes = getDelayTimeInMinutes(trains[i].time.toString(), delayTime);
                            }
                        }
                        if(timeInMin >= timeInFuture || (delayInMinutes !== null && timeInMin + delayInMinutes >= timeInFuture)){
                            var trainData = {
                                id: trains[i].id,
                                endStation: trains[i].endStation,
                                minutes: timeInMin,
                                delay: ''
                            };
                            if(delayInMinutes !== null && (delayInMinutes > 0 || delayInMinutes <0)){
                                var delayText = '(';
                                if(delayInMinutes > 0){
                                    delayText += '+ ' + delayInMinutes.toString();
                                }else{
                                    //negativ number don't need a sign
                                    delayText +=  delayInMinutes.toString();
                                }
                                delayText += ')';
                                trainData.delay = delayText;

                            }
                            appendLocalTrainDataToContainer(trainData);
                            trainCounter--;
                        }
                    }
                }
            }else{
                appendLocalTrainDataToContainer(null);
            }
        }
    });
}

function getArrivalTimeInMinLocalTrain(trainData){
    var currentTime = new Date();
    var trainDate = new Date();

    trainDate.setHours(0,0,0,0);

    var time = trainData.time;
    var splittedTime = time.split(':');
    trainDate.setMinutes(parseInt(splittedTime[1]));
    trainDate.setHours(parseInt(splittedTime[0]));
    var diff = trainDate - currentTime;
    return Math.round(((diff % 86400000) % 3600000) / 60000);

}

function getDelayTimeInMinutes(time, delayTime){
    var estimatedTime = new Date();
    estimatedTime.setHours(0,0,0,0);
    var trainDate = new Date();
    trainDate.setHours(0,0,0,0);

    if(delayTime.indexOf(':') > -1 && time.indexOf(':')>-1){
        var splittedTimeDelay = delayTime.split(':');
        trainDate.setMinutes(parseInt(splittedTimeDelay[1]));
        trainDate.setHours(parseInt(splittedTimeDelay[0]));

        var splittedTimeEstimated = time.split(':');
        estimatedTime.setMinutes(parseInt(splittedTimeEstimated[1]));
        estimatedTime.setHours(parseInt(splittedTimeEstimated[0]));
        var diff = trainDate - estimatedTime;
        return Math.round(((diff % 86400000) % 3600000) / 60000);
    }
    return null;

}

/**
 * Get the current trains. Send request to get all trains.
 * @param departure
 * @param arrival
 * @param cityName
 * @param departureStationId
 * @param otherStations
 */
function getCurrentTrains(departure, arrival, cityName, departureStationId, otherStations, compensationTrainId, compensationTrainName){
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
    $('.infoContainer').remove();

    $.ajax({
        url: '/currentTrains.php?id='+departureStationId,
        success: function(data) {
            var trains = getTrains(data);
            if(trains.length > 0){
                requestTrainDetails(getTrains(data));
            }else{
                //get the other station details
                getCurrentTrainsOfCompensationTrain(compensationTrainId, compensationTrainName);
            }
        }
    });
}

function getCurrentTrainsOfCompensationTrain(compensationTrainId, compensationTrainName){
    departureStation = compensationTrainName;
    var infoContainer = '<div class="row infoContainer"><div class="col-md-12 no-padding-right">'+
        '<p>Für Berlin Ostbahnhof liegen aktuell keine Daten vor</p></div></div>';
    $('.train-container').append(infoContainer);

    $.ajax({
        url: '/currentTrains.php?id='+compensationTrainId,
        success: function(data) {
            var trains = getTrains(data);
            if(trains.length > 0){
                requestTrainDetails(getTrains(data));
            }
        }
    });
}

function getEmptyTrainText(){
    return '<div class="train-connection border-radius"><p>Aktuell liegen keine Daten über diese Zugverbindung vor</p></div>';
}

function setTrainInterval(departure, arrival, cityName, arrivalStationId, otherStations, compensationTrainId, compensationTrainName){
    setInterval(function() {
        getCurrentTrains(departure, arrival, cityName, arrivalStationId, otherStations, compensationTrainId, compensationTrainName);
    }, millisecondsTrains);
}

function setLocalTrainInterval(localStationName, localStationId, stationsBetweenString, timeInFuture, trainCounter){
    setInterval(function() {
        getCurrentLocalTrains(localStationName, localStationId, stationsBetweenString, timeInFuture, trainCounter);
    }, millisecondsLocalTrains);
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
                }else if(otherStationsArray){
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

function getLocalTrains(data, stationsBetween){
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
                if(checkSearchedLocalTrainIsIn(child.children,stationsBetween)){
                    var returnedId = encodeURI(removeReturnCharacter(getIdOfTrain(child.children)));
                    dataList.push({
                        id: returnedId.replace(/%20/g, ''),
                        //url: getUrlOfTrain(child.children),
                        time: getTimeOfTrain(child.children),
                        delay: removeReturnCharacter(getDelayOfTrain(child.children)),
                        endStation: getEndstationOfTrain(child.children)
                    });
                }
            }
        }
    }
    return dataList.sort(compareTime);
}

function checkSearchedLocalTrainIsIn(children, stations){
    var stationName = '';
    //get the current station name
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "route"){
            stationName = child.innerText;
        }
    }

    for(var j=0; j<stations.length; j++){
        if(stationName.indexOf(stations[j])> -1){
            return true;
        }
    }

    return false;
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
                    if(linkChild.href.indexOf('reiseauskunft') == -1){
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
 * Get the current delay/ris of a train
 * @param children
 * @returns {null}
 */
function getDelayOfTrain(children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "ris"){
            return child.innerHTML;
        }
    }
    return null;
}

function getEndstationOfTrain(children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "route"){
            var innerHtml = child.children;
            for(var j=0; j<innerHtml.length; j++){
                var innerHtmlChild = innerHtml[j];
                if(innerHtmlChild.localName == 'span' && innerHtmlChild.className == 'bold'){
                    return innerHtmlChild.innerText
                }
            }
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
    var aTime = a.time.toString();
    var bTime = b.time.toString();

    a.time = parseFloat(aTime.replace(':', '.'));
    b.time = parseFloat(bTime.replace(':', '.'));
    if (a.time < b.time){
        return -1;
    }
    if (a.time > b.time){
        return 1;
    }
    return 0;
}

/**
 * Compare the train objects by parameter time.
 * @param a
 * @param b
 * @returns {number}
 */
function compareTime(a,b) {
    var aTime = new Date();
    var bTime = new Date();

    var aSplitted = a.time.split(':');
    aTime.setHours(0,0,0,0);
    aTime.setMinutes(parseInt(aSplitted[1]));
    aTime.setHours(parseInt(aSplitted[0]));

    var bSplitted = b.time.split(':');
    bTime.setHours(0,0,0,0);
    bTime.setMinutes(parseInt(bSplitted[1]));
    bTime.setHours(parseInt(bSplitted[0]));

    if (aTime.getTime() < bTime.getTime()){
        return -1;
    }
    if (aTime.getTime() > bTime.getTime()){
        return 1;
    }
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
    var trainDetailsArray = [];
    for(var i=0; i<trains.length; i++){
        var sendData = trains[i];
        sendData.departureStation = departureStation;
        sendData.arrivalStation = arrivalStation;

        $.ajax({
            type      : 'POST', //Method type
            url       : 'http://localhost/trainDetails.php', //Your form processing file URL
            data      : sendData, //Forms name
            dataType  : 'json',
            success   : function(response) {
                //var htmlElem = data.html;
                if(response.success){
                    //lösche /n aus den daten
                    var data = response.data;
                    var departure = data.departure.replace(/\n/g, '');
                    var arrival = data.arrival.replace(/\n/g, '');
                    var departureArray = departure.split(',');
                    var arrivalArray = arrival.split(',');

                    var departureInfo = getDataOfCurrentStation(departureArray);
                    var arrivalInfo = getDataOfCurrentStation(arrivalArray);

                    if(departureInfo && arrivalInfo){
                        var trainDetails = {
                            id: data.id,
                            startStation: departureInfo,
                            endStation: arrivalInfo
                        };
                        if(!checkIfTrainExists(trainDetailsArray, trainDetails)){
                            appendTrainDataToContainer(trainDetails);
                        }
                        trainDetailsArray.push(trainDetails);
                    }

                }
            }
        });
    }
}

/**
 * Check if the train exists as information. Return true if trains is in array.
 * @param trainArray
 * @param trainDetails
 * @returns {boolean}
 */
function checkIfTrainExists(trainArray, trainDetails){
    for(var i=0; i<trainArray.length; i++){
        var train = trainArray[i];
        if(train.endStation.time === trainDetails.endStation.time && train.startStation.station === trainDetails.startStation.station){
            //we have the same train
            return true;
        }
    }

    return false;
}

function getDataOfCurrentStation(dataArray){
    if(dataArray && dataArray.length > 2){
        var data = {};
        if(dataArray.includes(' Halt entfällt ')){
           //the stop will not arrive
            data = {
                station : dataArray[0],
                time: '<b>Halt entfällt</b>',
                delay: '',
                info: dataArray[10]
            };
        }else{
            data = {
                station : dataArray[0],
                time: removeDelay(dataArray[4]),
                delay: getDelay(dataArray[4]),
                info: dataArray[10]
            };
        }

        return data;
    }
    return null;

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
            var data = {
                station : '',
                time: '',
                delay: '',
                info: ''
            };
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

function getDelay(time){
    if(time.indexOf('+') > -1){
        return time.substring(time.indexOf('+'), time.length);
    }else if(time.indexOf('-') > -1){
        return time.substring(time.indexOf('-'), time.length);
    }else{
        //check if there are another time like this: " ab 18:0118:02"
        if(numberOfOccursInString(time, ':') > 1){
            var onlyTime = time.replace('ab', '');
            onlyTime = onlyTime.replace(' ', '');
            return onlyTime.substring(onlyTime.length/2 + 1, time.length);
        }

    }
    return null;
}

function numberOfOccursInString(str, char){
    var occurs = 0;

    var substr = str;
    while(substr.indexOf(char) > -1){
        if(substr.indexOf(char) > -1){
            occurs++;
            substr = substr.substring(substr.indexOf(char)+1, substr.length);
        }
    }

    return occurs;
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
    }else if(numberOfOccursInString(str, ':') > 1){
        var onlyTime = str.replace('ab', '');
        onlyTime = onlyTime.replace(' ', '');
        return onlyTime.substring(0, onlyTime.length/2+1);
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
    if(str){
        return str.replace(/\r?\n|\r/g, "");
    }else{
        return null;
    }

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

    var startStationText = trainData.startStation.time;
    var endStationText = trainData.endStation.time;
    if(startStationText.indexOf('Halt entfällt') === -1){
        startStationText += ' Uhr ' + startStationDelay;
    }else{
        startStationText = '<span class="departureDelay red-color">' + startStationText + '</span>';
    }
    if(endStationText.indexOf('Halt entfällt') === -1){
        endStationText += ' Uhr ' + endStationDelay;
    }else{
        endStationText = '<span class="departureDelay red-color">' + endStationText + '</span>';
    }

    var container = '<div class="train-connection border-radius"><div class="row"><div class="col-md-2 no-padding-right">'+
        '<p><b>' + trainData.id + '</b></p></div><div class="col-md-1 no-padding-left"><img src="images/icons/24/003-symbol.png"/>'+
        '</div><div class="col-md-3 no-padding-left text-center"><p>'+ trainData.startStation.station +'</p>'+
        '</div><div class="col-md-2 no-padding-left"><img src="images/icons/32/arrows.png"/></div>' +
        '<div class="col-md-1 no-padding-left"><img src="images/icons/24/002-car.png"/></div>' +
        '<div class="col-md-3 no-padding-left text-center"><p>'+ trainData.endStation.station +'</p></div></div>'+
        '<div class="row"><div class="col-md-2 no-padding-right"> </div><div class="col-md-1 no-padding-left"></div>'+
        '<div class="col-md-3 no-padding-left text-center"><p>'+ startStationText + '</p>' +
        '</div><div class="col-md-2 no-padding-left"></div><div class="col-md-1 no-padding-left"></div>' +
        '<div class="col-md-3 no-padding-left text-center"><p>'+ endStationText + '</p>' +
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
    if(delay.indexOf(':')> -1){
        return 'red-color';
    }
    return 'green-color';
}

/**
 * Add local train data and container to html element.
 * @param trainData
 */
function appendLocalTrainDataToContainer(trainData){
    if(trainData !== null){
        var container = getLocalTrainConnectionContainer(trainData);
        $('.local-train-container-content').append(container);
    }else{
        $('.local-train-container-content').append(getLocalTrainEmptyContainer);
    }
}


function getLocalTrainConnectionContainer(trainData){
    /**var startStationDelay = '';
    if(trainData.startStation && trainData.startStation.delay){
        var delayColor = getColorOfDelay(trainData.startStation.delay);
        startStationDelay = '<span class="departureDelay '+ delayColor +'">'+ trainData.startStation.delay +'</span>';
    }
    var endStationDelay = '';
    if(trainData.endStation && trainData.endStation.delay){
        var delayColor = getColorOfDelay(trainData.endStation.delay);
        endStationDelay = '<span class="arrivalDelay '+ delayColor +'">'+ trainData.endStation.delay +'</span>';
    }**/

    var container = '<div class="row "><div class="col-md-6 small-margin-left"><p>' + trainData.id + ' ' + trainData.endStation + '</p></div><div class="col-md-4"><p> in '+
    trainData.minutes + ' min ' + trainData.delay +'</p></div></div>';

    return container;
}

function getLocalTrainEmptyContainer(){
    var container = '<div class="row "><div class="col-md-12 small-margin-left"><p>Aktuell liegen keine Verbindungen vor</p></div>';

    return container;
}

function trelloLogin(){
    var authenticationSuccess = function() {
        console.log('Successful authentication');
        getListsOfBoard('5965f1f9bd7eae62b37e2ccb');
    };

    var authenticationFailure = function() {
        console.log('Failed authentication');
    };

    window.Trello.authorize({
        type: 'popup',
        name: 'Getting Started Application',
        scope: {
            read: 'true',
            write: 'true' },
        expiration: 'never',
        success: authenticationSuccess,
        error: authenticationFailure
    });
}

function getListsOfBoard(id){
    //'5965f1f9bd7eae62b37e2ccb'
    var success = function (data) {
        //load the lists of the board
        getCardsOfLists(data.lists);
    };

    window.Trello.boards.get(id, {fields: ['id', 'name'], lists: 'open', list_fields: ['id', 'name']}, success);
}

/**
 * Request the cards of a list.
 * @param lists
 */
function getCardsOfLists(lists){
    var cardList = [];

    for(var i=0; i<lists.length; i++){
        var list = lists[i];
        cardList.push({
            listId: list.id,
            listName: list.name,
            wasFilled: false,
            cards: []
        });

        (function(listId){
            var success = function (data) {
                addCardsToList(cardList, listId, data);
                if(checkAllWasFilled(cardList)){
                    //all cards was filled
                    //search cards with due day today
                    getCardsDueToday(cardList);
                }

            };
            window.Trello.get('/lists/'+ list.id + '/cards', {fields: ['id', 'name', 'badges', 'idMembers', 'idChecklists', 'idList']}, success);

        })(list.id);
    }
}

/**
 * Add the card to the list.
 * @param cardList
 * @param listId
 * @param items
 */
function addCardsToList(cardList, listId, items){
    for(var i=0; i<cardList.length; i++){
        var cardListItem = cardList[i];
        if(cardListItem.listId === listId){
            cardListItem.wasFilled = true;
            for(var j=0; j<items.length; j++){
                cardListItem.cards.push(items[j]);
            }
        }
    }
}

/**
 * Check if the card list was filled with the cards.
 * @param cardList
 * @returns {boolean}
 */
function checkAllWasFilled(cardList){
    var wasFilled = true;
    for(var i=0; i<cardList.length; i++){
        wasFilled = cardList[i].wasFilled && wasFilled;
    }
    return wasFilled;
}

/**
 * Get all the cards with due date is today.
 * @param cardList
 */
function getCardsDueToday(cardList){
    var cardListToday = [];
    var today = new Date();
    var checkListWasInCard = false;

    for(var i=0; i<cardList.length; i++){
        var cardItem = cardList[i];
        var cards = cardItem.cards;
        for(var j=0; j<cards.length; j++){
            var card = cards[j];
            if(card.badges.due!== null){
                var cardDay = new Date(card.badges.due);
                if(today.toDateString() === cardDay.toDateString()){
                    //add to list
                    addTodayCardToList(cardListToday, card, cardItem.listId, cardItem.listName);
                    if(card.idChecklists && card.idChecklists.length > 0){
                        //request the checklists
                        getCheckListOfCard(card, cardListToday);
                        checkListWasInCard = true;
                    }
                }
            }
        }
    }

    if(!checkListWasInCard){
        //we have no checklist and can insert the cards to index html
        //if we have checklist we have to request the list and insert after request
        addTodoContainer(cardListToday);
    }

}

/**
 * Add a card to a list of all cards today.
 * @param list
 * @param card
 * @param listId
 * @param listName
 */
function addTodayCardToList(list, card, listId, listName){
    for(var i=0; i<list.length; i++){
        var currentList = list[i];
        if(currentList.id === listId){
            currentList.cards.push(card);
            return;
        }
    }

    //insert new element if that wasn't insert before
    list.push({
        id: listId,
        name: listName,
        cards: [card]
    });
}

function getCheckListOfCard(card, cardListToday){
    if(!card.checkLists || card.checkLists === null){
        card.checkList = [];
    }
    card.checkListWasFilled = false;

    var checkLists = card.idChecklists;
    for(var i=0; i<checkLists.length; i++){
        var checkListId = checkLists[i];

        (function(checkListId, cardItemIndex, cardList){
            var success = function (data) {
                card.checkList.push(data);

                if(cardItemIndex === checkLists.length -1 ){
                    card.checkListWasFilled = true;
                }
                if(wasCardFilledWithChecklist(cardList) && cardItemIndex === checkLists.length -1){
                    //it was the last card and last checklist -> render it in index html
                    addTodoContainer(cardList);
                }
            };
            window.Trello.checklists.get(checkListId, {fields: ['id', 'name']}, success);

        })(checkListId, i, cardListToday);
    }
}

function wasCardFilledWithChecklist(cardListToday){
    var wasFilledConpletely = true;
    for(var i=0; i<cardListToday.length; i++){
        var cardItem = cardListToday[i];
        var cards = cardItem.cards;

        for(var j=0; j<cards.length; j++){
            var card = cards[j];
            wasFilledConpletely = wasFilledConpletely && card.checkListWasFilled;
        }
    }
    return wasFilledConpletely;
}

function addTodoContainer(cardListToday){
    $('.todo-container-details').empty();

    if(cardListToday.length === 0){
        var emptyContainer = '<div class="row todos"><div class="col-md-12"><p><b>Heute gibt es keine ToDos</b></p></div></div>';
        $('.todo-container-details').append(emptyContainer);
    }else{
        for(var i=0; i<cardListToday.length; i++){
            var cards = cardListToday[i].cards;
            for(var j=0; j<cards.length; j++){
                var card = cards[j];
                var checkListContainer = '';
                if(card.checkList && card.checkList.length > 0){
                    checkListContainer = getCheckListsAsContainer(card.checkList);

                }
                var container = '<div class="row todos"><div class="col-md-12"><p><b>'+ card.name + ' (' + cardListToday[i].name+ ')</b></p>'+ checkListContainer + '</div></div>';
                $('.todo-container-details').append(container);
            }
        }
    }

}

function getCheckListsAsContainer(checkLists){
    var containerList = '<ul>';
    for(var i=0; i<checkLists.length; i++){
        var checkList = checkLists[i];
        var checkItems = checkList.checkItems;
        for(var j=0; j<checkItems.length; j++){
            var item = checkItems[j];
            if(item.state === 'incomplete'){
                containerList += '<li> <p>'+ item.name +'</p> </li>';
            }

        }
    }
    containerList += '</ul>';
    return containerList;
}

$( document ).ready(function() {
    $('.pull-down').each(function() {
        var $this=$(this);
        $this.css('margin-top', $this.parent().height()-$this.height())
    });

    trelloLogin();

});