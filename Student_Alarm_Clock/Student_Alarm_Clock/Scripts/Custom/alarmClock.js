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
    //this function will delete the table row and take the alarm out of the alarms array at the same time
    //when the delete button is clicked. Pretty slick.
    $(document).on('click', 'button.deleteAlarm' , function () {
        alarms.splice(this.id, 1);
        $(this).parent().parent().remove();
    });

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
        alarms.push(date);
        console.log(alarms);

        $("#alarms").append("<tr><td>" + alarmName + "</td><td>" + date.toLocaleTimeString() + " on "
            + date.toLocaleDateString() + "</td>" + "<td> <button class=\"btn btn-danger deleteAlarm\" id=\"" + (alarms.length - 1) + "\">Delete</button></td></tr>");
    });
});