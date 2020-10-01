//wait for the document and elements to load before we do our thang.
$(document).ready(function () {
    var id = 0;
    var alarms = [];
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
        $('#time').text(now.toLocaleTimeString());

        //if we got some alarms, lets see if they should go off!
        if (alarms.length > 0) {
            for (var i = 0; i < alarms.length; i++) {
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
            }
        }

        setTimeout(clockUpdate, 1000);
    }
    //this function will delete the table row and take the alarm out of the alarms array at the same time
    //when the delete button is clicked. Pretty slick.
    $(document).on('click', 'button.deleteAlarm', function () {
        for (var i = 0; i < alarms.length; i++) {
            //substring out the "delete" that is before the id number.
            if (alarms[i].alarmId == this.id.substring(6)) {
                alarms.splice(i, 1);
                $(this).parent().parent().remove();
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
                changeButtonState(this, "btn-danger", "deleteAlarm", "btn-success", "dismissAlarm", "Delete");
                $("#update" + alarms[i].alarmId).prop("disabled", false);
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
                $("#alarmTime" + this.id.substring(6)).html("Time :<input id=\"newAlarmTime" + alarms[i].alarmId + "\" type=\"time\" step=\"1\" value=\"" + alarms[i].alarmDateTime.getHours() +
                    ":" + alarms[i].alarmDateTime.getMinutes() + ":" + alarms[i].alarmDateTime.getSeconds() + "\"><br/>"
                    + "Date :<input id=\"newAlarmDate" + alarms[i].alarmId + "\" type=\"date\" value=\"" + alarms[i].alarmDateTime.getFullYear() + "-" + (alarms[i].alarmDateTime.getMonth() + 1) + "-"
                    + alarms[i].alarmDateTime.getDate() + "\">");
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

                var date = $("#newAlarmDate" + alarms[i].alarmId).val();

                if (date == "") {
                    date = new Date();
                }
                else {
                    //parsing ints here because they're strings currently.
                    var year = parseInt(date.substring(0, 4));
                    var month = parseInt(date.substring(5, 7));
                    var day = parseInt(date.substring(8, 10));

                    date = new Date(year, (month - 1), day, 0, 0, 0, 0);
                }

                date.setHours(hours);
                date.setMinutes(minutes);
                date.setSeconds(seconds);
                alarms[i].alarmDateTime = date;

                $("#alarmName" + this.id.substring(6)).html(alarms[i].alarmName);
                $("#alarmTime" + this.id.substring(6)).html(alarms[i].alarmDateTime.toLocaleTimeString()
                    + " on " + alarms[i].alarmDateTime.toLocaleDateString());

                changeButtonState(this, "btn-primary", "updateAlarm", "btn-success", "confirmUpdate", "Update");
                changeButtonState(("#delete" + alarms[i].alarmId), "btn-danger", "deleteAlarm", "btn-primary", "cancelAlarm", "Delete");
                break;
            }
        }
    });
    //make the row red and then in 300ms make it white again.
    function flashRow(tableRow) {
        tableRow.css('background-color', "red");
        window.setTimeout(function () { tableRow.css('background-color', "white"); }, 300);
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

        var date = $("#alarmDate").val();

        if (date == "") {
            date = new Date();
        }
        else {
            //parsing ints here because they're strings currently.
            var year = parseInt(date.substring(0, 4));
            var month = parseInt(date.substring(5, 7));
            var day = parseInt(date.substring(8, 10));

            date = new Date(year, (month - 1), day, 0, 0, 0, 0);
        }
        //passing in the time to the date
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        var newAlarm = new Alarm(date, false, id, alarmName);
        alarms.push(newAlarm);
        console.log(alarms);

        $("#alarms").append("<tr><td><span id=\"alarmName" + id + "\">" + alarmName
            + "</span></td><td><span id=\"alarmTime"+ id + "\">" + date.toLocaleTimeString() + " on "
            + date.toLocaleDateString() + "</span></td>" + "<td> <button class=\"btn btn-primary updateAlarm\" id=\"update" + id + "\">Update</button></td>"
            + "<td> <button class=\"btn btn-danger deleteAlarm\" id=\"delete" + id + "\">Delete</button></td></tr>");
        id++;
    });
    //let's make some alarm objects so we can track if it's triggered and it's alarm id.
    class Alarm {
        constructor(alarmDateTime, isTriggered, alarmId, alarmName) {
            this.alarmDateTime = alarmDateTime;
            this.isTriggered = isTriggered;
            this.alarmId = alarmId;
            this.alarmName = alarmName;
        }
    }
});