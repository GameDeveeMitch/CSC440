// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {
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
                if (alarms[i].toLocaleTimeString() === now.toLocaleTimeString() && alarms[i].toLocaleDateString() === now.toLocaleDateString()) {
                    alarms.splice(i, 1);
                    console.log(alarms);
                    alert("ahhhhhhhhhhh ALARM IS GOING OFF");
                }
            }
        }

        setTimeout(clockUpdate, 1000);

    }

    function numberWithLeadingZeros(num) {
        if (num < 10) {
            return '0' + num;
        }
        else {
            return num;
        }
    }

    function formatHours(hours) {
        if (hours < 12) {
            return hours;
        }
        else {
            return hours - 12;
        }
    }

    function getAMPM(hours) {
        if (hours < 12) {
            return "AM";
        }
        else {
            return "PM";
        }
    }

    $('#createAlarm').click(function () {
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

        console.log(hours);

        var date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        alarms.push(date);
        console.log(alarms);
    });

});