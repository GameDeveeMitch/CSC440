class UserSetup {
    constructor(yellowAlarmTime, redAlarmTime) {
        this.yellowAlarmTime = yellowAlarmTime;
        this.redAlarmTime = redAlarmTime;
    }
}

$(document).ready(function () {
    var d = new Date(0, 0, 0, 8, 0, 0, 0);
    var d2 = new Date(0, 0, 0, 6, 0, 0, 0);
    var user = new UserSetup(d, d2);
    //temp function for alarm time submission. TODO Tyler remove this when we have this in users
    $("#submitAlarmTimes").click(function () {
        var hours = parseInt($("#yellowAlarmTimeHours").val());
        var minutes = parseInt($("#yellowAlarmTimeMinutes").val());
        var seconds = parseInt($("#yellowAlarmTimeSeconds").val());
        if (isNaN(seconds)) {
            seconds = 0;
        }
        d.setHours(hours);
        d.setMinutes(minutes);
        d.setSeconds(seconds);
        user.yellowAlarmTime = d;
        var hours = parseInt($("#redAlarmTimeHours").val());
        var minutes = parseInt($("#redAlarmTimeMinutes").val());
        var seconds = parseInt($("#redAlarmTimeSeconds").val());
        if (isNaN(seconds)) {
            seconds = 0;
        }
        d.setHours(hours);
        d.setMinutes(minutes);
        d.setSeconds(seconds);
        user.redAlarmTime = d;
        console.log(user);
    });

    $("#submitUser").click(function () {
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();
        var username = $("#username").val();
        var userPass1 = $('#userPass1').val();

        $.post("/Home/addUser", {
            //this userID isn't used but is required.
            userID: "0",
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: userPass1
        });


    });
});