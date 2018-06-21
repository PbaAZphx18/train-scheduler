//having a hard time with APIs and figuring out how to use and what to look for within docs in order to understand better
//Had to copy most of this from net but have gone over to try and understand functionality.  Added comments and questions to 
//refer to and get help from my tutor.


$(document).ready(function(){

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDkVTZIgHbbWoyM2kbWsBIHR_odO88zoSU",
      authDomain: "trainscheduler-bf7d9.firebaseapp.com",
      databaseURL: "https://trainscheduler-bf7d9.firebaseio.com",
      projectId: "trainscheduler-bf7d9",
      storageBucket: "trainscheduler-bf7d9.appspot.com",
      messagingSenderId: "47781417486"
    };
    firebase.initializeApp(config);
    // A variable to reference the database.
    var database = firebase.database();

    // Variables for the onClick event
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;


    //targeting the submit button.  Once pressed, values from each line stored in firebase and 
    //shows under train schedule
    $("#add-train").on("click", function() {
        // prevent page from reloading
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // Pushing to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            //need to go over this as I am not sure how its created...??????????
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        //Need to have better explanation?????????
        $("form")[0].reset();
    });

        //not quite grasping this...how do you get or know to "child add" and not just append????????
    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minAway;
        // Change year so first train comes before now
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");


            //Appending tr/td tags onto HTML. ???????????
        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            // Handle the errors   ?????????
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });
        //adding all info into each cell w values from input on form and database
    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        // Change the HTML to reflect
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});