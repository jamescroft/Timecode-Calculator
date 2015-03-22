$('#calculate').click(function () {
    var timecodeText = $('#textarea-timecodes').val();
    //timecodeText = timecodeText.replace(/\s+/g, '');
    if (validateTextInput(timecodeText)) {
        var timecode = createTimecodeArray(timecodeText);
        convertToSeconds(timecode);
        calculateTimeCode(timecode);
    } else {
        $('.panel-answer').removeClass("panel-default hide").addClass("panel-danger show");
        $('#answer').html("Total: Sorry, please input valid timecodes in hours, minutes and seconds (eg. 0:22, 3:26, 15:26, 4:23:59), and only one kind of seperator.");
        $('#timecodes-answer').html("");
    };

    //detect delimiters and split timecodes into array
    function createTimecodeArray(timecodeText) {
        var delimiter = ["\n", ",", ";"];
        for (i = 0; i < delimiter.length; i++) {
            if (timecodeText.indexOf(delimiter[i]) > -1) {
                return timecodeText.split(delimiter[i]);
                break;
            }
        }
    };

    //validating all text input before processing
    function validateTextInput(timecodeText) {

        // input is empty or zero
        if (timecodeText == "" || timecodeText == 0) {
            return false;
        };

        // input has only one type of delimiter
        var delimiter = ["\n", ",", ";"];
        var numberOfDelimiters = 0;
        for (i = 0; i < delimiter.length; i++) {
            if (timecodeText.indexOf(delimiter[i]) > -1) {
                numberOfDelimiters++;
            }
        }

        if (numberOfDelimiters > 1) {
            return false;
        };

        // break down timecode for valid hours, minutes, seconds
        for (i = 0; i < delimiter.length; i++) {
            console.log(timecodeText);
            if (timecodeText.indexOf(delimiter[i]) > -1) {
                var timecodeValidate = timecodeText.split(delimiter[i]);
            }
        }
        console.log(timecodeValidate);
        for (j = 0; j < timecodeValidate.length; j++) {

            //remove leading zero
            if (timecodeValidate[j].charAt(0) == 0) {

                timecodeValidate[j] = timecodeValidate[j].substring(1);

            }

            console.log(timecodeValidate[j]);
            // time is a 4 character string with a colon in the 2nd position
            if ((timecodeValidate[j].length) <= 5 && (timecodeValidate[j].charAt(timecodeValidate[j].length - 2) == ":")) {

                console.log(timecodeValidate[j]);
                console.log("detected an invalid 4 char string");
                return false
            }

            // time is a 7 character string with a colon in the 2nd and 5th position
            if ((timecodeValidate[j].length == 7) && (timecodeValidate[j].charAt(timecodeValidate.length - 2)) == ":" && (timecodeValidate[j].charAt(timecodeValidate.length - 4) == ":")) {

                console.log(timecodeValidate[j]);
                console.log("detected an invalid 7 char string");
                return false;
            }

        }

        return true;

    };

    //take timecodes and convert into seconds integer, print string of timecodes
    function convertToSeconds(timecode) {
        var timecodesEquation = "";
        for (i = 0; i < timecode.length; i++) {

            // create the string for timecodes back to the interface
            timecodesEquation = timecodesEquation + timecode[i];
            if (i < (timecode.length - 1)) {
                timecodesEquation = timecodesEquation + " + ";
            };

            // split the timecodes, convert them into seconds
            //if (timecode[i].indexOf(":") > -1) {

            if (timecode[i].charAt(0) == 0) {
                timecode[i] = timecode[i].substring(1);
            }

            if (timecode[i].length == 3 && timecode[i].charAt(0) == ":") {
                timecode[i] = timecode[i].substring(1);
                var timeArray = timecode[i].split(":", 2);
                timecode[i] = parseInt(timeArray[0]);
            }
            if (timecode[i].length == 4 || timecode[i].length == 5) {
                var timeArray = timecode[i].split(":", 2);
                timecode[i] = (parseInt(timeArray[0]) * 60) + (parseInt(timeArray[1]));
            }
            if (timecode[i].length >= 7) {
                var timeArray = timecode[i].split(":", 3);
                timecode[i] = (parseInt(timeArray[0]) * 3600) + (parseInt(timeArray[1]) * 60) + (parseInt(timeArray[2]));
            }
        };

        // print 
        $('#timecodes-answer').html("<b>Timecodes:</b> " + timecodesEquation);
    };

    //sum all timecodes together, convert back into minutes & seconds, print answer
    function calculateTimeCode(timecode) {
        var addTimecodes = timecode.reduce(function (a, b) {
            return a + b;
        });
        var addTimecodesHours = Math.floor(addTimecodes / 3600);
        var addTimecodesMinutes = Math.floor((addTimecodes / 60) - (addTimecodesHours * 60));
        var addTimescodesSeconds = Math.floor((addTimecodes - ((addTimecodesHours * 3600) + (addTimecodesMinutes * 60))));
        if (addTimescodesSeconds.toString().length < 2) {
            addTimescodesSeconds = "0" + addTimescodesSeconds;
        };
        if ((addTimecodesHours > 0) && (addTimecodesMinutes.toString().length < 2)) {
            addTimecodesMinutes = "0" + addTimecodesMinutes;
        };
        $('.panel-answer').removeClass("panel-default hide").addClass("panel-success show");
        $('#answer').html(
            function () {
                if (addTimecodesHours > 0) {
                    return "<b>Total:</b> " + addTimecodesHours + ":" + addTimecodesMinutes + ":" + addTimescodesSeconds;
                } else {
                    return "<b>Total:</b> " + addTimecodesMinutes + ":" + addTimescodesSeconds;
                }
            });
    }
});