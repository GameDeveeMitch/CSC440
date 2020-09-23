$(document).ready(function () {
    var id = 0;
    var alarms = [];
    clockUpdate();
    function clockUpdate() {
        var now = new Date();
        var months = ["January", "Jebruary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var date = [now.getDate(),
        months[now.getMonth()],
        now.getFullYear()].join(' ');

        $('#date').text(date);
        $('#time').text(now.toLocaleTimeString());

        if (alarms.length > 0) {
            for (var i = 0; i < alarms.length; i++) {
                if (alarms[i].isTriggered) {
                    var tableRow = $("#" + alarms[i].alarmId).parent().parent();
                    flashRow(tableRow);
                }
                else if (alarms[i].alarmDateTime.toLocaleTimeString() === now.toLocaleTimeString() && alarms[i].alarmDateTime.toLocaleDateString() === now.toLocaleDateString()) {
                    alarms[i].isTriggered = true;
                    $("#" + alarms[i].alarmId).addClass("btn-primary");
                    $("#" + alarms[i].alarmId).addClass("dismissAlarm");
                    $("#" + alarms[i].alarmId).removeClass("btn-danger");
                    $("#" + alarms[i].alarmId).removeClass("deleteAlarm");
                    $("#" + alarms[i].alarmId).text("Dismiss");
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

    function flashRow(tableRow) {
        tableRow.css('background-color', "red");
        window.setTimeout(function () { tableRow.css('background-color', "white"); }, 300);
    }


    $('#createAlarm').click(function () {
        var alarmName = $("#alarmName").val();
        var hours = $("#hour").val();
        var minutes = $("#minute").val();
        var seconds = $("#second").val();
        var amPm = $("#amPm").val();

        if (hours === "12") {
            hours = parseInt(hours) + 12;
        }

        if (amPm === "PM") {
            hours = parseInt(hours) + 12;
        }

        var date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        var newAlarm = new Alarm(date, false, id);
        alarms.push(newAlarm);
        console.log(alarms);

        $("#alarms").append("<tr><td>" + alarmName + "</td><td>" + date.toLocaleTimeString() + " on "
            + date.toLocaleDateString() + "</td>" + "<td> <button class=\"btn btn-danger deleteAlarm\" id=\"" + (id++) + "\">Delete</button></td></tr>");
    });

    class Alarm {
        constructor(alarmDateTime, isTriggered, alarmId) {
            this.alarmDateTime = alarmDateTime;
            this.isTriggered = isTriggered;
            this.alarmId = alarmId;
        }
    }
});