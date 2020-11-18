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

$(document).ready(function () {
    var user = null;
    if (localStorage.getItem("user") == null) {
        var d = new Date(0, 0, 0, 8, 0, 0, 0);
        var d2 = new Date(0, 0, 0, 6, 0, 0, 0);
        user = new User(0, "first", "last", "Default", d, d2, 0, 0, false);
    }
    else {
        user = JSON.parse(localStorage.getItem("user"));
        user.redAlarmTime = new Date(Date.parse(user.redAlarmTime));
        user.yellowAlarmTime = new Date(Date.parse(user.yellowAlarmTime));
    }
    console.log(user);
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
        var userYellow = new Date(0, 0, 0, 8, 0, 0, 0);
        var userRed = new Date(0, 0, 0, 6, 0, 0, 0);
        $.post("/Home/addUser", {
            userID: "0",
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: userPass1,
            redAlarmDateTime: userRed.toLocaleDateString() + " " + userRed.toLocaleTimeString(),
            yellowAlarmDateTime: userYellow.toLocaleDateString() + " " + userYellow.toLocaleTimeString(),
            redAlarmCount: 0,
            yellowAlarmCount: 0,
            isAsleep: false
        }, function (data) {
            if (data == "") {
                $("#signupResult").removeClass("hidden");
                $("#signupResult").addClass("btn-danger");
                $("#signupResult").removeClass("btn-success");
                $("#signupResult").val("Username is already taken!");
            }
            else {
                parsedUser = JSON.parse(data, dateTimeReviver);
                var newUser = new User(parsedUser.userID, parsedUser.firstName, parsedUser.lastName, parsedUser.username,
                    parsedUser.yellowAlarmDateTime, parsedUser.redAlarmDateTime, parsedUser.redAlarmCount, parsedUser.yellowAlarmCount, parsedUser.isAsleep);
                user = newUser;

                localStorage.setItem("user", JSON.stringify(user));
                $("#signUp").addClass("hidden");
                $("#login").addClass("hidden");
                $("#account").removeClass("hidden");
                $("#account").html("<a href=\"/Home/Account\">" + user.username + "</a>");
                window.location.replace(window.location.protocol + "//" + window.location.host + "/Home/Account");
            }

            console.log(user);


        });
    });
    $("#submitLogin").click(function (e) {
        console.log("we here?");
        e.preventDefault();
        let username = $("#username").val();
        let userPass = $("#password").val();
        minlength = 3;
        maxlength = 24;
        //is input valid
        if (username != undefined) {
            if (username.length < minlength) {
                alert("Username is less than " + minlength + " characters");
                return false;
            }
            if (username.length > maxlength) {
                alert("Username name is greater than " + maxlength + " characters");
                return false;
            }
        }
        else {
            return false;
        }
        if (userPass != undefined) {
            if (userPass.length < minlength) {
                alert("Password is less than " + minlength + " characters");
                return false;
            }
            if (userPass.length > maxlength) {
                alert("Password is greater than " + maxlength + " characters");
                return false;
            }
        }
        else {
            return false;
        }
        $.post("/Home/loginUser", {
            username: username,
            userPass: userPass
        }, function (data) {
            if (data == "null") {
                $("#result").removeClass("hidden");
                $("#result").addClass("btn-danger");
                $("#result").removeClass("btn-success");
                $("#result").val("Username or Password does not match!");
            }
            else {
                $("#result").removeClass("hidden");
                $("#result").addClass("btn-success");
                $("#result").removeClass("btn-danger");
                $("#result").val("Login success!");
                $("#username").val("");
                $("#password").val("");
                parsedUser = JSON.parse(data, dateTimeReviver);
                var newUser = new User(parsedUser.userID, parsedUser.firstName, parsedUser.lastName, parsedUser.username,
                    parsedUser.yellowAlarmDateTime, parsedUser.redAlarmDateTime, parsedUser.redAlarmCount, parsedUser.yellowAlarmCount, parsedUser.isAsleep);
                user = newUser;

                localStorage.setItem("user", JSON.stringify(user));
                $("#signUp").addClass("hidden");
                $("#login").addClass("hidden");
                $("#account").removeClass("hidden");
                $("#account").html("<a href=\"/Home/Account\">" + user.username + "</a>");
            }

            console.log(user);
        });
    });
});