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
    $("#accountMessage").html((user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)) + " " + (user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)) + "'s page");

    $("#numOfYellow").html("Total number of Yellow Alarms: " + user.yellowAlarmCount);

    $("#numOfRed").html("Total number of Red Alarms: " + user.redAlarmCount);

    $("#yellowAlarmTime").html(user.yellowAlarmTime.toTimeString().substring(0, 8));

    $("#yellowAlarmDescription").html("In " + user.yellowAlarmTime.getHours() + " hours, " + user.yellowAlarmTime.getMinutes() +
        " mintues, and " + user.yellowAlarmTime.getSeconds() +
        " seconds before any alarm goes off, the user will recieve a yellow alert unless they have hit the \"Going to Sleep\" button on the homepage.");

    $("#redAlarmTime").html(user.redAlarmTime.toTimeString().substring(0, 8));

    $("#redAlarmDescription").html("In " + user.redAlarmTime.getHours() + " hours, " + user.redAlarmTime.getMinutes() +
        " mintues, and " + user.redAlarmTime.getSeconds() +
        " seconds before any alarm goes off, the user will recieve a red alert unless they have hit the \"Going to Sleep\" button on the homepage.");

    $(document).on('click', 'button.editUser', function () {
        changeButtonState("#edit", "btn-success", "updateUser", "btn-primary", "editUser", "Update");
        changeButtonState("#logout", "btn-primary", "cancelUser", "btn-danger", "logoutUser", "Cancel");

        $("#yellowAlarmTime").addClass("hidden");
        $("#redAlarmTime").addClass("hidden");
        $("#yellowAlarmDescription").addClass("hidden");
        $("#redAlarmDescription").addClass("hidden");
        $(".yellowAlarmSetup").each(function () {
            $(this).removeClass("hidden");
        });
        $(".redAlarmSetup").each(function () {
            $(this).removeClass("hidden");
        });

        $('#yellowAlarmTimeHours option[value="' + user.yellowAlarmTime.getHours() + '"]').prop('selected', true);
        $('#yellowAlarmTimeMinutes option[value="' + user.yellowAlarmTime.getMinutes() + '"]').prop('selected', true);
        $('#yellowAlarmTimeSeconds option[value="' + user.yellowAlarmTime.getSeconds() + '"]').prop('selected', true);
        $('#redAlarmTimeHours option[value="' + user.redAlarmTime.getHours() + '"]').prop('selected', true);
        $('#redAlarmTimeMinutes option[value="' + user.redAlarmTime.getMinutes() + '"]').prop('selected', true);
        $('#redAlarmTimeSeconds option[value="' + user.redAlarmTime.getSeconds() + '"]').prop('selected', true);
    });

    $(document).on('click', 'button.updateUser', function () {
        var yellowHours = parseInt($("#yellowAlarmTimeHours").val());
        var yellowMinutes = parseInt($("#yellowAlarmTimeMinutes").val());
        var yellowSeconds = parseInt($("#yellowAlarmTimeSeconds").val());
        var redHours = parseInt($("#redAlarmTimeHours").val());
        var redMinutes = parseInt($("#redAlarmTimeMinutes").val());
        var redSeconds = parseInt($("#redAlarmTimeSeconds").val());

        d = new Date(0, 0, 0, yellowHours, yellowMinutes, yellowSeconds, 0);
        d2 = new Date(0, 0, 0, redHours, redMinutes, redSeconds, 0);

        user.yellowAlarmTime = d;
        user.redAlarmTime = d2;
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
                    //change the times and decriptions to have the proper new times.
                    $("#yellowAlarmTime").html(user.yellowAlarmTime.toTimeString().substring(0, 8));

                    $("#yellowAlarmDescription").html("In " + user.yellowAlarmTime.getHours() + " hours, " + user.yellowAlarmTime.getMinutes() +
                        " mintues, and " + user.yellowAlarmTime.getSeconds() +
                        " seconds before any alarm goes off, the user will recieve a yellow alert unless they have hit the \"Going to Sleep\" button on the homepage.");

                    $("#redAlarmTime").html(user.redAlarmTime.toTimeString().substring(0, 8));

                    $("#redAlarmDescription").html("In " + user.redAlarmTime.getHours() + " hours, " + user.redAlarmTime.getMinutes() +
                        " mintues, and " + user.redAlarmTime.getSeconds() +
                        " seconds before any alarm goes off, the user will recieve a red alert unless they have hit the \"Going to Sleep\" button on the homepage.");
                }
                //we're done editing, switch everything back.
                changeButtonState("#edit", "btn-primary", "editUser", "btn-success", "updateUser", "Edit");
                changeButtonState("#logout", "btn-danger", "logoutUser", "btn-primary", "cancelUser", "Logout");

                $("#yellowAlarmTime").removeClass("hidden");
                $("#redAlarmTime").removeClass("hidden");
                $("#yellowAlarmDescription").removeClass("hidden");
                $("#redAlarmDescription").removeClass("hidden");
                $(".yellowAlarmSetup").each(function () {
                    $(this).addClass("hidden");
                });
                $(".redAlarmSetup").each(function () {
                    $(this).addClass("hidden");
                });
                
        });
    });

    $(document).on('click', 'button.cancelUser', function () {
        //we're done editing, switch everything back.
        changeButtonState("#edit", "btn-primary", "editUser", "btn-success", "updateUser", "Edit");
        changeButtonState("#logout", "btn-danger", "logoutUser", "btn-primary", "cancelUser", "Logout");

        $("#yellowAlarmTime").removeClass("hidden");
        $("#redAlarmTime").removeClass("hidden");
        $("#yellowAlarmDescription").removeClass("hidden");
        $("#redAlarmDescription").removeClass("hidden");
        $(".yellowAlarmSetup").each(function () {
            $(this).addClass("hidden");
        });
        $(".redAlarmSetup").each(function () {
            $(this).addClass("hidden");
        });
    });

    $(document).on('click', 'button.logoutUser', function () {
        $("#account").addClass("hidden");
        $("#signUp").removeClass("hidden");
        $("#login").removeClass("hidden");
        d = new Date(0, 0, 0, 8, 0, 0, 0);
        d2 = new Date(0, 0, 0, 6, 0, 0, 0);
        user = new User(0, "first", "last", "Default", d, d2, 0, 0, false);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.replace(window.location.protocol + "//" + window.location.host + "/Home/AccountLogin");
    });

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
});