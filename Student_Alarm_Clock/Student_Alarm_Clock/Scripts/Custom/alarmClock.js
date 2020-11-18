//let's make some alarm objects so we can track if it's triggered and it's alarm id.
class Alarm {
    constructor(alarmDateTime, isTriggered, isInYellowAlert, isInRedAlert, alarmId, alarmName, alarmDays, isEnabled, userId) {
        this.alarmDateTime = alarmDateTime;
        this.isTriggered = isTriggered;
        this.isInYellowAlert = isInYellowAlert;
        this.isInRedAlert = isInRedAlert;
        this.alarmId = alarmId;
        this.alarmName = alarmName;
        this.alarmDays = alarmDays;
        this.isEnabled = isEnabled;
        this.userId = userId;
    }
}
//the dates come back weird from json.parse. Let's make a custom function to fix that.
dateTimeReviver = function (key, value) {
    var parsedDateString;
    if (typeof value === 'string') {
        parsedDateString = /\/Date\((-?\d*)\)\//.exec(value);
        if (parsedDateString) {
            return new Date(+parsedDateString[1]);
        }
    }
    return value;
}
//wait for the document and elements to load before we do our thang.

$(document).ready(function () {
    var id = 0;
    var alarms = [];
    var user = null;
    //check if user is set to something first, if not, then we set the yellow and red alarms to their defaults.
    if (localStorage.getItem("user") == null) {
        var d = new Date(0, 0, 0, 8, 0, 0, 0);
        var d2 = new Date(0, 0, 0, 6, 0, 0, 0);
        var user = new User(0, "first", "last", "Default", d, d2, 0, 0, false);
    }
    else {
        user = JSON.parse(localStorage.getItem("user"));
        user.redAlarmTime = new Date(Date.parse(user.redAlarmTime));
        user.yellowAlarmTime = new Date(Date.parse(user.yellowAlarmTime));
        if (user.isAsleep === true) {
            changeButtonState("#sleepWake", "btn-success", "isAsleep", "btn-primary", "isAwake", "Wake up");
        }
    }
    console.log(user);
    $.get("/Home/readAlarms", function(data) {
        var readAlarms = JSON.parse(data, dateTimeReviver);
        readAlarms.forEach(alarm => {
            alarm.alarmDays = alarm.alarmDays.split(", ");
            alarms.push(new Alarm(setAlarmDate(alarm.alarmDateTime, alarm.alarmDays), false, false, false, alarm.alarmID, alarm.alarmName, alarm.alarmDays, alarm.isEnabled, alarm.userID))
            addAlarmToPage(alarm.alarmID, alarm.alarmName, setAlarmDate(alarm.alarmDateTime, alarm.alarmDays), alarm.isEnabled, alarm.userID);
            console.log(alarm);
            if (alarm.alarmID > id) {
                id = alarm.alarmID;
            }
        });
    });
    //clockUpdate is the main loop for the alarm clock. We need tocall it every second to update the clock.
    //we will also be checking if our alarms match the alarm clock time. If so, we should go into alarm!
    clockUpdate();
    function clockUpdate() {
        var now = new Date();
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var date = [now.getDate(),
        months[now.getMonth()],
        now.getFullYear()].join(' ');
        //setting up the date and time strings that are displayed on the screen.
        $('#date').text(date);
        var amOrPm = now.toLocaleTimeString().substring(now.toLocaleTimeString().length - 2, now.toLocaleTimeString().length);
        if (amOrPm === "AM") {
            $("#alarmTimeAM").css('color', 'white');
            $("#alarmTimePM").css('color', 'grey');
        }
        if (amOrPm === "PM") {
            $("#alarmTimeAM").css('color', 'grey');
            $("#alarmTimePM").css('color', 'white');
        }
        $('#time').text(now.toLocaleTimeString().substring(0, now.toLocaleTimeString().length - 2));

        //if we got some alarms, lets see if they should go off!
        if (alarms.length > 0) {
            for (var i = 0; i < alarms.length; i++) {
                //only check the alarm state if the alarm is enabled.
                if (alarms[i].isEnabled == true) {
                    if (!user.isAsleep) {
                        var yellowAlarmDateTime = new Date(alarms[i].alarmDateTime.getFullYear(), alarms[i].alarmDateTime.getMonth(), alarms[i].alarmDateTime.getDate(),
                            alarms[i].alarmDateTime.getHours(), alarms[i].alarmDateTime.getMinutes(), alarms[i].alarmDateTime.getSeconds(), 0);
                        yellowAlarmDateTime.setHours(alarms[i].alarmDateTime.getHours() - user.yellowAlarmTime.getHours());
                        yellowAlarmDateTime.setMinutes(alarms[i].alarmDateTime.getMinutes() - user.yellowAlarmTime.getMinutes());
                        yellowAlarmDateTime.setSeconds(alarms[i].alarmDateTime.getSeconds() - user.yellowAlarmTime.getSeconds());
                        var redAlarmDateTime = new Date(alarms[i].alarmDateTime.getFullYear(), alarms[i].alarmDateTime.getMonth(), alarms[i].alarmDateTime.getDate(),
                            alarms[i].alarmDateTime.getHours(), alarms[i].alarmDateTime.getMinutes(), alarms[i].alarmDateTime.getSeconds(), 0);
                        redAlarmDateTime.setHours(alarms[i].alarmDateTime.getHours() - user.redAlarmTime.getHours());
                        redAlarmDateTime.setMinutes(alarms[i].alarmDateTime.getMinutes() - user.redAlarmTime.getMinutes());
                        redAlarmDateTime.setSeconds(alarms[i].alarmDateTime.getSeconds() - user.redAlarmTime.getSeconds());
                        if (yellowAlarmDateTime.toLocaleTimeString() === now.toLocaleTimeString()) {
                            user.yellowAlarmCount++;
                            if (alarms[i].isInYellowAlert == false && alarms[i].isInRedAlert == false) {
                                changeButtonState(("#delete" + alarms[i].alarmId), "btn-success", "dismissAlarm", "btn-danger", "deleteAlarm", "Dismiss");
                                $("#update" + alarms[i].alarmId).prop("disabled", true);
                            }
                            alarms[i].isInYellowAlert = true;
                            //let's get this flashing started!
                            flashRowYellow($("#delete" + alarms[i].alarmId).parent().parent());
                            $.post("/Home/updateUser", {
                                userID: user.userId,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                username: user.username,
                                redAlarmDateTime: user.redAlarmTime.toLocaleDateString() + " " + user.redAlarmTime.toLocaleTimeString(),
                                yellowAlarmDateTime: user.yellowAlarmTime.toLocaleDateString() + " " + user.yellowAlarmTime.toLocaleTimeString(),
                                redAlarmCount: user.redAlarmCount,
                                yellowAlarmCount: user.yellowAlarmCount,
                                isAsleep: user.isAsleep
                            }, function (data) {
                                //something changed, set the user to it on the local storage.
                                if (data === "1") {
                                    localStorage.setItem("user", JSON.stringify(user));
                                }

                            });
                        }
                        if (redAlarmDateTime.toLocaleTimeString() === now.toLocaleTimeString()) {
                            user.redAlarmCount++;
                            if (alarms[i].isInYellowAlert == false && alarms[i].isInRedAlert == false) {
                                changeButtonState(("#delete" + alarms[i].alarmId), "btn-success", "dismissAlarm", "btn-danger", "deleteAlarm", "Dismiss");
                                $("#update" + alarms[i].alarmId).prop("disabled", true);
                            }
                            alarms[i].isInRedAlert = true;
                            alarms[i].isInYellowAlert = false;
                            //let's get this flashing started!
                            flashRowOrange($("#delete" + alarms[i].alarmId).parent().parent());
                            $.post("/Home/updateUser", {
                                userID: user.userId,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                username: user.username,
                                redAlarmDateTime: user.redAlarmTime.toLocaleDateString() + " " + user.redAlarmTime.toLocaleTimeString(),
                                yellowAlarmDateTime: user.yellowAlarmTime.toLocaleDateString() + " " + user.yellowAlarmTime.toLocaleTimeString(),
                                redAlarmCount: user.redAlarmCount,
                                yellowAlarmCount: user.yellowAlarmCount,
                                isAsleep: user.isAsleep
                            }, function (data) {
                                //something changed, set the user to it on the local storage.
                                if (data === "1") {
                                    localStorage.setItem("user", JSON.stringify(user));
                                }

                            });
                        }
                    }
                    if (alarms[i].isTriggered) {
                        //we need to grab the table row so we can make it flash red.
                        //we do that here becuase we need to get this specific alarm's row.
                        var tableRow = $("#delete" + alarms[i].alarmId).parent().parent();
                        //this is the function that flashes the rows. It has a setTimeout which is kinda like a sleep.
                        //because of this sleep, we have to do it in it's own function, otherwise the variable tableRow will be overridden.
                        //if you want to know more, ask Tyler.
                        flashRow(tableRow);
                    }
                    //Alarm hasn't fired, let's see if it should!
                    else if (alarms[i].alarmDateTime.toLocaleTimeString() === now.toLocaleTimeString() && alarms[i].alarmDateTime.toLocaleDateString() === now.toLocaleDateString()) {
                        //the alarm has triggered so it can flash red :)
                        alarms[i].isTriggered = true;
                        //we're changing the button and classes so we'll activate the dismiss button function, not the delete button fucntion!
                        changeButtonState(("#delete" + alarms[i].alarmId), "btn-success", "dismissAlarm", "btn-danger", "deleteAlarm", "Dismiss");
                        $("#update" + alarms[i].alarmId).prop("disabled", true);
                        //let's get this flashing started!
                        flashRow($("#delete" + alarms[i].alarmId).parent().parent());
                    }
                    else if (alarms[i].isInRedAlert && !user.isAsleep) {
                        //we need to grab the table row so we can make it flash red.
                        //we do that here becuase we need to get this specific alarm's row.
                        var tableRow = $("#delete" + alarms[i].alarmId).parent().parent();
                        //this is the function that flashes the rows. It has a setTimeout which is kinda like a sleep.
                        //because of this sleep, we have to do it in it's own function, otherwise the variable tableRow will be overridden.
                        //if you want to know more, ask Tyler.
                        flashRowOrange(tableRow);
                    }
                    else if (alarms[i].isInYellowAlert && !user.isAsleep) {
                        //we need to grab the table row so we can make it flash red.
                        //we do that here becuase we need to get this specific alarm's row.
                        var tableRow = $("#delete" + alarms[i].alarmId).parent().parent();
                        //this is the function that flashes the rows. It has a setTimeout which is kinda like a sleep.
                        //because of this sleep, we have to do it in it's own function, otherwise the variable tableRow will be overridden.
                        //if you want to know more, ask Tyler.
                        flashRowYellow(tableRow);
                    }
                }
            }
        }

        setTimeout(clockUpdate, 1000);
    }
    //this function will delete the table row and take the alarm out of the alarms array at the same time
    //when the delete button is clicked. Pretty slick.
    $(document).on('click', 'button.deleteAlarm', function () {
        for (var i = 0; i < alarms.length; i++) {
            //substring out the "delete" that is before the id number.
            console.log(this.id.substring(6));
            if (alarms[i].alarmId == this.id.substring(6)) {
                var alarm = alarms[i];
                alarms.splice(i, 1);
                $(this).parent().parent().remove();
                console.log(alarms[i]);
                daysString = getDaysString(alarm.alarmDays);
                $.post("/Home/deleteAlarm", {
                    alarmID: alarm.alarmId,
                    alarmDateTime: alarm.alarmDateTime.toLocaleDateString() + " " + alarm.alarmDateTime.toLocaleTimeString(),
                    isEnabled: alarm.isEnabled,
                    alarmName: alarm.alarmName,
                    alarmDays: daysString
                });
                break;
            }
        }
    });
    // when we click an enabled button we make sure to turn it's object enabled to false.
    $(document).on('change', 'input[name="enabledGroup"]', function () {
        for (var i = 0; i < alarms.length; i++) {
            //substring out the "delete" that is before the id number.
            if (alarms[i].alarmId == this.id.substring(9)) {
                if (this.checked) {
                    alarms[i].isEnabled = true;
                }
                else {
                    alarms[i].isEnabled = false;
                }
                console.log(alarms[i]);
                daysString = getDaysString(alarms[i].alarmDays);
                $.post("/Home/updateAlarm", {
                    alarmID: alarms[i].alarmId,
                    alarmDateTime: alarms[i].alarmDateTime.toLocaleDateString() + " " + alarms[i].alarmDateTime.toLocaleTimeString(),
                    isEnabled: alarms[i].isEnabled,
                    alarmName: alarms[i].alarmName,
                    alarmDays: daysString,
                    userId: alarms[i].userId
                });
                break;
            }
        }
    });
    //This function will reset the alarm back to it's delete state when the dismiss button is clicked.
    $(document).on('click', 'button.dismissAlarm', function () {
        for (var i = 0; i < alarms.length; i++) {
            //substring out the "delete" that is before the id number.
            if (alarms[i].alarmId == this.id.substring(6)) {
                alarms[i].isTriggered = false;
                alarms[i].isInYellowAlert = false;
                alarms[i].isInRedAlert = false;
                changeButtonState(this, "btn-danger", "deleteAlarm", "btn-success", "dismissAlarm", "Delete");
                $("#update" + alarms[i].alarmId).prop("disabled", false);

                alarms[i].alarmDateTime = setAlarmDate(alarms[i].alarmDateTime, alarms[i].alarmDays);

                $("#alarmTime" + this.id.substring(6)).html(alarms[i].alarmDateTime.toLocaleTimeString()
                    + " on " + alarms[i].alarmDateTime.toLocaleDateString());
                break;
            }
        }
    });
    //update alarm funciton
    //TYLER TODO: maybe change the button id's too to have them be "cancel" + id
    $(document).on('click', 'button.updateAlarm', function () {
        for (var i = 0; i < alarms.length; i++) {
            //we need to get the correct alarm from the alarm array
            //substring out the "update" before the id number.
            if (alarms[i].alarmId == this.id.substring(6)) {
                //setting up the inputs for updating data.
                $("#alarmName" + this.id.substring(6)).html("Name :<input id=\"newAlarmName" + alarms[i].alarmId + "\" type=\"text\" value=\"" + alarms[i].alarmName + "\">");
                $("#alarmTime" + this.id.substring(6)).html("Time :<input id=\"newAlarmTime" + alarms[i].alarmId + "\" type=\"time\" step=\"1\" value=\"" + giveSingleDigitTwoDigits(alarms[i].alarmDateTime.getHours()) +
                    ":" + giveSingleDigitTwoDigits(alarms[i].alarmDateTime.getMinutes()) + ":" + giveSingleDigitTwoDigits(alarms[i].alarmDateTime.getSeconds()) + "\"><br/>"
                    + "Days :<br/>" + "<input type=\"checkbox\" id=\"monday" + alarms[i].alarmId + "\" name=\"editBoxGroup" + alarms[i].alarmId + "\" value=\"1\"" + (alarms[i].alarmDays.includes("1") ? "checked" : "") + "> Mon <br/>"
                    + "<input type=\"checkbox\" id=\"tuesday" + alarms[i].alarmId + "\" name=\"editBoxGroup" + alarms[i].alarmId + "\" value=\"2\"" + (alarms[i].alarmDays.includes("2") ? "checked" : "") + "> Tue <br/>"
                    + "<input type=\"checkbox\" id=\"wednesday" + alarms[i].alarmId + "\" name=\"editBoxGroup" + alarms[i].alarmId + "\" value=\"3\"" + (alarms[i].alarmDays.includes("3") ? "checked" : "") + "> Wed <br/>"
                    + "<input type=\"checkbox\" id=\"thursday" + alarms[i].alarmId + "\" name=\"editBoxGroup" + alarms[i].alarmId + "\" value=\"4\"" + (alarms[i].alarmDays.includes("4") ? "checked" : "") + "> Thu <br/>"
                    + "<input type=\"checkbox\" id=\"friday" + alarms[i].alarmId + "\" name=\"editBoxGroup" + alarms[i].alarmId + "\" value=\"5\"" + (alarms[i].alarmDays.includes("5") ? "checked" : "") + "> Fri <br/>"
                    + "<input type=\"checkbox\" id=\"saturday" + alarms[i].alarmId + "\" name=\"editBoxGroup" + alarms[i].alarmId + "\" value=\"6\"" + (alarms[i].alarmDays.includes("6") ? "checked" : "") + "> Sat <br/>"
                    + "<input type=\"checkbox\" id=\"sunday" + alarms[i].alarmId + "\" name=\"editBoxGroup" + alarms[i].alarmId + "\" value=\"7\"" + (alarms[i].alarmDays.includes("7") ? "checked" : "") + "> Sun <br/>");
                //Changing the delete and update buttons to better suit updating
                changeButtonState(this, "btn-success", "confirmUpdate", "btn-primary", "updateAlarm", "Confirm");
                changeButtonState(("#delete" + alarms[i].alarmId), "btn-primary", "cancelUpdate", "btn-danger", "deleteAlarm", "Cancel");
                break;
            }
        }
    });
    //cancel the current update. Changes will not be saved.
    $(document).on('click', 'button.cancelUpdate', function () {
        for (var i = 0; i < alarms.length; i++) {
            //substring out the "delete" that is before the id number.
            if (alarms[i].alarmId == this.id.substring(6)) {
                $("#alarmName" + this.id.substring(6)).html(alarms[i].alarmName);
                $("#alarmTime" + this.id.substring(6)).html(alarms[i].alarmDateTime.toLocaleTimeString()
                    + " on " + alarms[i].alarmDateTime.toLocaleDateString());

                changeButtonState(this, "btn-danger", "deleteAlarm", "btn-primary", "cancelAlarm", "Delete");
                changeButtonState(("#update" + alarms[i].alarmId), "btn-primary", "updateAlarm", "btn-success", "confirmUpdate", "Update");
                break;
            }
        }
    });
    //
    $(document).on('click', 'button.confirmUpdate', function () {
        for (var i = 0; i < alarms.length; i++) {
            //substring out the "delete" that is before the id number.
            if (alarms[i].alarmId == this.id.substring(6)) {
                //grab values from the webpage and set the values on the alarm array
                alarms[i].alarmName = $("#newAlarmName" + alarms[i].alarmId).val();
                var time = $("#newAlarmTime" + alarms[i].alarmId).val();
                var hours = parseInt(time.substring(0, 2));
                var minutes = parseInt(time.substring(3, 5));
                var seconds = parseInt(time.substring(6, 8));

                var daysChecked = [];
                $('input[name=editBoxGroup' + alarms[i].alarmId +']').each(function () {
                    var thisVal = (this.checked ? $(this).val() : "0");
                    if (thisVal !== "0") {
                        daysChecked.push(thisVal);
                    }
                });
                var date = new Date();
                //passing in the time to the date
                date.setHours(hours);
                date.setMinutes(minutes);
                date.setSeconds(seconds);
                date = setAlarmDate(date, daysChecked);
                alarms[i].alarmDateTime = date;
                alarms[i].alarmDays = daysChecked;

                $("#alarmName" + this.id.substring(6)).html(alarms[i].alarmName);
                $("#alarmTime" + this.id.substring(6)).html(alarms[i].alarmDateTime.toLocaleTimeString()
                    + " on " + alarms[i].alarmDateTime.toLocaleDateString());

                changeButtonState(this, "btn-primary", "updateAlarm", "btn-success", "confirmUpdate", "Update");
                changeButtonState(("#delete" + alarms[i].alarmId), "btn-danger", "deleteAlarm", "btn-primary", "cancelAlarm", "Delete");

                daysString = getDaysString(alarms[i].alarmDays);
                $.post("/Home/updateAlarm", {
                    alarmID: alarms[i].alarmId,
                    alarmDateTime: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
                    isEnabled: alarms[i].isEnabled,
                    alarmName: alarms[i].alarmName,
                    alarmDays: daysString,
                    userId: alarms[i].userId
                });
                break;
            }
        }
    });
    //make the row red and then in 300ms make it white again.
    function flashRow(tableRow) {
        tableRow.css('background-color', "red");
        window.setTimeout(function () { tableRow.css('background-color', "#181818"); }, 300);
    }
    function flashRowYellow(tableRow) {
        tableRow.css('background-color', "yellow");
        window.setTimeout(function () { tableRow.css('background-color', "#181818"); }, 300);
    }
    function flashRowOrange(tableRow) {
        tableRow.css('background-color', "orange");
        window.setTimeout(function () { tableRow.css('background-color', "#181818"); }, 300);
    }
    //
    function changeButtonState(buttonSelector,
        addedButtonStyle,
        addedButtonSelectorClass,
        removedButtonStyle,
        removedButtonSelectorClass,
        buttonText) {
        $(buttonSelector).addClass(addedButtonStyle);
        $(buttonSelector).addClass(addedButtonSelectorClass);
        $(buttonSelector).removeClass(removedButtonStyle);
        $(buttonSelector).removeClass(removedButtonSelectorClass);
        $(buttonSelector).text(buttonText);
    }
    function giveSingleDigitTwoDigits(number) {
        if (number < 10) {
            return "0" + number;
        }
        else {
            return number;
        }
    }
    function addAlarmToPage(id, alarmName, date, isEnabled, userId) {
        if (userId == user.userId) {
            $("#alarms").append("<tr><td><input type=\"checkbox\" id=\"isEnabled" + id + "\" name=\"enabledGroup\" value=\"" + id + "\" " + (isEnabled ? "checked" : "") + "></td><td><span id=\"alarmName" + id + "\">" + alarmName
                + "</span></td><td><span id=\"alarmTime" + id + "\">" + date.toLocaleTimeString() + " on "
                + date.toLocaleDateString() + "</span></td>" + "<td> <button class=\"btn btn-primary updateAlarm\" id=\"update" + id + "\">Update</button></td>"
                + "<td> <button class=\"btn btn-danger deleteAlarm\" id=\"delete" + id + "\">Delete</button></td></tr>");
        }
    }
    function setAlarmDate(alarmTime, alarmDays){
        var date = new Date();

        var dateOurTime = new Date();

        dateOurTime.setHours(alarmTime.getHours());
        dateOurTime.setMinutes(alarmTime.getMinutes());
        dateOurTime.setSeconds(alarmTime.getSeconds());

        var day = date.getDay();

        var closestDay = 0;

        var nextAlarmDate = 0;

        for (var j = 0; j < alarmDays.length; j++) {
            var alarmDayInt = parseInt(alarmDays[j]);
            if (alarmDayInt < day) {
                closestDay = alarmDayInt;
            }
            else if (alarmDayInt == day && dateOurTime > date) {
                closestDay = alarmDayInt;
                nextAlarmDate = (alarmDayInt - day);
                break;
            }
            else if (alarmDayInt > day) {
                closestDay = alarmDayInt;
                nextAlarmDate = (alarmDayInt - day);
                break;
            }
        }

        if (closestDay < day) {
            nextAlarmDate = (parseInt(alarmDays[0]) + 7 - day);
        }

        date.setHours(alarmTime.getHours());
        date.setMinutes(alarmTime.getMinutes());
        date.setSeconds(alarmTime.getSeconds());

        date.setDate(date.getDate() + nextAlarmDate);
        return date;
    }
    function getDaysString(days) {
        var daysString = "";
        days.forEach((day, i, array) => {
            if (i === array.length - 1) {
                daysString += day;
            }
            else {
                daysString += day + ", ";
            }
        });
        return daysString;
    }
    //When the "set alarm" button is clicked we take the info off the page and set up an alarm with it.
    $('#createAlarm').click(function () {
        //most imput values come back as strings unless it's labed as a number
        //such as seconds.
        var alarmName = $("#alarmName").val();
        var time = $("#alarmTime").val();
        var hours = parseInt(time.substring(0, 2));
        var minutes = parseInt(time.substring(3, 5));
        var seconds = parseInt(time.substring(6, 8));
        if (isNaN(seconds)) {
            seconds = 0;
        }

        var daysChecked = [];
        $('input[name=boxGroup1]').each(function () {
            var thisVal = (this.checked ? $(this).val() : "0");
            if (thisVal !== "0") {
                daysChecked.push(thisVal);
            }
        });
        var date = new Date();

        //passing in the time to the date
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        date = setAlarmDate(date, daysChecked);
        var newAlarm = new Alarm(date, false, false, false, id, alarmName, daysChecked, true, user.userId);
        alarms.push(newAlarm);
        console.log(alarms);

        addAlarmToPage(id, alarmName, date, true, newAlarm.userId);
        console.log(daysChecked);
        var daysString = getDaysString(daysChecked);
        $.post("/Home/addAlarm", {
            alarmID: id,
            alarmDateTime: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
            isEnabled: true,
            alarmName: alarmName,
            alarmDays: daysString,
            userId: user.userId
        });
        id++;
    });


    $(document).on('click', 'button.isAwake', function(){
        user.isAsleep = true;
        $.post("/Home/updateUser", {
            userID: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            redAlarmDateTime: user.redAlarmTime.toLocaleDateString() + " " + user.redAlarmTime.toLocaleTimeString(),
            yellowAlarmDateTime: user.yellowAlarmTime.toLocaleDateString() + " " + user.yellowAlarmTime.toLocaleTimeString(),
            redAlarmCount: user.redAlarmCount,
            yellowAlarmCount: user.yellowAlarmCount,
            isAsleep: user.isAsleep
        }, function (data) {
            //something changed, set the user to it on the local storage.
            if (data === "1") {
                localStorage.setItem("user", JSON.stringify(user));
            }
            changeButtonState("#sleepWake", "btn-success", "isAsleep", "btn-primary", "isAwake", "Wake up");

        });
    });

    $(document).on('click', 'button.isAsleep', function () {
        user.isAsleep = false;
        $.post("/Home/updateUser", {
            userID: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            redAlarmDateTime: user.redAlarmTime.toLocaleDateString() + " " + user.redAlarmTime.toLocaleTimeString(),
            yellowAlarmDateTime: user.yellowAlarmTime.toLocaleDateString() + " " + user.yellowAlarmTime.toLocaleTimeString(),
            redAlarmCount: user.redAlarmCount,
            yellowAlarmCount: user.yellowAlarmCount,
            isAsleep: user.isAsleep
        }, function (data) {
            //something changed, set the user to it on the local storage.
            if (data === "1") {
                localStorage.setItem("user", JSON.stringify(user));
            }
            changeButtonState("#sleepWake", "btn-primary", "isAwake", "btn-success", "isAsleep", "Go To Sleep");
        });
    });
});