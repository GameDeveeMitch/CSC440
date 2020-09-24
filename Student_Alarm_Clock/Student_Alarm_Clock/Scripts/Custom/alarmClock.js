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
                    var tableRow = $("#" + alarms[i].alarmId).parent().parent();
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
                    $("#" + alarms[i].alarmId).addClass("btn-primary");
                    $("#" + alarms[i].alarmId).addClass("dismissAlarm");
                    $("#" + alarms[i].alarmId).removeClass("btn-danger");
                    $("#" + alarms[i].alarmId).removeClass("deleteAlarm");
                    $("#" + alarms[i].alarmId).text("Dismiss");
                    //let's get this flashing started!
                    flashRow($("#" + alarms[i].alarmId).parent().parent());
                }
            }
        }

        setTimeout(clockUpdate, 1000);
    }
    //this function will delete the table row and take the alarm out of the alarms array at the same time
    //when the delete button is clicked. Pretty slick.
    $(document).on('click', 'button.deleteAlarm', function () {
        for (var i = 0; i < alarms.length; i++) {
            if (alarms[i].alarmId == this.id) {
                alarms.splice(i, 1);
                $(this).parent().parent().remove();
            }
        }
    });
    //This function will reset the alarm back to it's delete state when the dismiss button is clicked.
    $(document).on('click', 'button.dismissAlarm', function () {
        for (var i = 0; i < alarms.length; i++) {
            if (alarms[i].alarmId == this.id) {
                alarms[i].isTriggered = false;
                $(this).parent().parent().css('background-color', "white");
                $(this).removeClass("btn-primary");
                $(this).removeClass("dismissAlarm");
                $(this).addClass("btn-danger");
                $(this).addClass("deleteAlarm");
                $(this).text("Delete");
                break;
            }
        }
    });
    //make the row red and then in 300ms make it white again.
    function flashRow(tableRow) {
        tableRow.css('background-color', "red");
        window.setTimeout(function () { tableRow.css('background-color', "white"); }, 300);
    }
    //When the "set alarm" button is clicked we take the info off the page and set up an alarm with it.
    $('#createAlarm').click(function () {
        //most imput values come back as strings unless it's labed as a number
        //such as seconds.
        var alarmName = $("#alarmName").val();
        var time = $("#alarmTime").val();
        var hours = parseInt(time.substring(0, 2));
        var minutes = parseInt(time.substring(3, 5));
        var seconds = $("#seconds").val();

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
        var newAlarm = new Alarm(date, false, id);
        alarms.push(newAlarm);
        console.log(alarms);

        $("#alarms").append("<tr><td>" + alarmName + "</td><td>" + date.toLocaleTimeString() + " on "
            + date.toLocaleDateString() + "</td>" + "<td> <button class=\"btn btn-danger deleteAlarm\" id=\"" + (id++) + "\">Delete</button></td></tr>");
    });
    //let's make some alarm objects so we can track if it's triggered and it's alarm id.
    class Alarm {
        constructor(alarmDateTime, isTriggered, alarmId) {
            this.alarmDateTime = alarmDateTime;
            this.isTriggered = isTriggered;
            this.alarmId = alarmId;
        }
    }
});