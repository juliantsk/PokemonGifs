var pokemon = ["Psyduck", "Mewtwo", "Pikachu", "Suicune", "Charizard", "Rayquaza", "Gengar", "Blaziken", "Pokeball", "Mimikyu"];
var currentTopic = "";
var loadMore = false;
var offset = 0;
var favoritesArray = [];
var favoritesDisplayed = false;

$(document).ready(function() {
    // Displays the default topics, as well as any topics that the user enters.
    function displayTopics() {
        $("#topics").empty();
        for (var i = 0; pokemon[i]; i++) {
            $("#topics").append($("<button>").addClass("topic").text(pokemon[i]));
        };
    }

    // Title flair
    function titleBackground() {
        // Picks a random number from 0 to 100.
        var random = Math.floor((Math.random() * 100));
        // Makes a call to Giphy's API.
        $.ajax({
                // Uses the random number to display a different set of five still gifs related to the "pokemon" search term on Giphy every time the website is loaded.
                url: "https://api.giphy.com/v1/gifs/search?api_key=X2pzCnYBHgSnhsVAJTqXkkU1HIOsdjRx&q=pokemon&limit=5&offset=" + random + "&rating=G&lang=en",
                method: "GET"
            })
            .then(function(response) {
                var results = response.data;
                var imageURLs = "";
                var imagePositions = "0vw,";
                var posNumber = 0;

                // For each object related to a gif called from the API...
                for (var i = 0; i < results.length; i++) {
                    // ...add the url for the still gif into the imageURLs string...
                    imageURLs += "url(\"" + results[i].images.fixed_height_still.url + "\")";
                    // ...and use the current gif's width to determine the next gif's horizontal position.
                    posNumber += ((results[i].images.fixed_height_still.width / results[i].images.fixed_height_still.height - 0.01) * 15);
                    imagePositions += posNumber + "vw";
                    // If this gif is not the last one in the list...
                    if (i !== (results.length - 1)) {
                        // ...add a comma to the strings.
                        imageURLs += ",";
                        imagePositions += ",";
                    }
                }
                // Add the constructed strings to the styling for the background of the title div.
                $("div.title").css("background-image", imageURLs);
                $("div.title").css("background-position", imagePositions);
            });
    };

    function displayGifs() {
        // If the the topic clicked is different from the current topic saved, and isn't the button to load more gifs from the same topic...
        if (currentTopic !== $(this).text() && $(this).text() !== "Load 10 More Gifs") {
            // ...empty the div of gifs...
            $("#gifs-appear-here").empty();
            // ...update the current topic...
            currentTopic = $(this).text();
            // ...and reset the offset variable.
            offset = 0
        }
        if (favoritesDisplayed) {
            $("#gifs-appear-here").empty();
            favoritesDisplayed = false;
        }
        // If the load more button has not been appended to the screen...
        if (!(loadMore)) {
            // ...append the load more button...
            $("body").append($("<button>").attr("id", "load").text("Load 10 More Gifs"));
            // ...and update the loadMore variable.
            loadMore = true;
        }

        // Update the offset variable, so that loading more gifs of the same topic will show new gifs.
        offset += 10;

        // Construct a URL for the giphy API using the current topic and current offset.
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            currentTopic + "&api_key=dc6zaTOxFJmzC&limit=10&offset=" + offset + "&rating=PG&lang=en";

        // Makes a call to Giphy's API.
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                var results = response.data;
                // For each object related to a gif...
                for (var i = 0; i < results.length; i++) {
                    // Initiate a new div of class "pokemon-gif".
                    var gifDiv = $("<div class='pokemon-gif'>");
                    // Store the rating of the gif.
                    var rating = results[i].rating;

                    // Store necessary data in the attributes of the gif.
                    gifDiv.attr({
                        "data-still": results[i].images.fixed_height_still.url,
                        "data-animate": results[i].images.fixed_height.url,
                        "data-state": "still",
                        "data-rating": rating
                    })

                    // Initiate a new p tag to display the rating
                    var p = $("<p>").text("Rating: " + rating);

                    // Initiate a new img tag...
                    var pokemonImage = $("<img>");
                    pokemonImage.attr({
                        // ...with a class of "pokemon-img"...
                        class: "pokemon-img",
                        // ...and a source of the current gif's still image. 
                        src: results[i].images.fixed_height_still.url
                    });

                    // Initiate a download link.
                    var pokemonLink = $("<a href=" + results[i].images.fixed_height_still.url + " download>")

                    // Initiate a new image tag...
                    var downloadImage = $("<img>");
                    // ...that uses our download icon...
                    downloadImage.attr({ src: "assets/images/download.png", class: "download" });
                    // ...and add it to our download link.
                    pokemonLink.prepend(downloadImage);

                    // Initiate a new image tag...
                    var favImage = $("<img>");
                    // ...with our star icon.
                    favImage.attr({ src: "assets/images/star.png", class: "favorite" });

                    // Add all of the above to the div we created.
                    gifDiv.prepend(pokemonLink);
                    gifDiv.prepend(favImage);
                    gifDiv.prepend(p);
                    gifDiv.prepend(pokemonImage);

                    // Add the div we created to the gif containing div.
                    $("#gifs-appear-here").append(gifDiv);
                };
            });
        // Change the title display to "none" to make room for displaying gifs.
        $("div.title").css("display", "none");
    };

    // Toggles the gifs from still to animated.
    function animate() {
        // Sets variables for the state, and the URLs for the animated and still versions of the gifs.
        var state = $(this).parent().attr("data-state");
        var animate = $(this).parent().attr("data-animate");
        var still = $(this).parent().attr("data-still");
        // If the state variable is "still"...
        if (state === "still") {
            // ...set the image src to the animated URL for this gif...
            $(this).attr("src", animate);
            // ...and change the state variable to "animate".
            $(this).parent().attr("data-state", "animate");
        } else {
            // Else, set the image src to the still URL for this gif...
            $(this).attr("src", still);
            // ...and set the state variable to "still".
            $(this).parent().attr("data-state", "still");
        };
    }

    // Checks if there is a local array of favorites...
    if (localStorage.getItem("Favorite Pokemon") === null) {
        // ...and makes one if there isn't one.
        localStorage.setItem("Favorite Pokemon", JSON.stringify(favoritesArray));
    };

    // Adds a gif to the user's favorites list, which is stored locally.
    function addFavorite() {
        // Creates an object which holds the information to store for the gif...
        var item = { still: $(this).parent().attr("data-still"), animate: $(this).parent().attr("data-animate"), rating: $(this).parent().attr("data-rating") };
        // ...pushes that object to our array variable...
        favoritesArray.push(item);
        // ...and updates the local storage with the newly updated array.
        localStorage.setItem("Favorite Pokemon", JSON.stringify(favoritesArray));
    }


    // Displays favorites stored in the user's local storage.
    function displayFavorites() {
        // Empties the div containing divs...
        $("#gifs-appear-here").empty();
        // ...removes the load more button, if it is on the page...
        $("#load").remove();
        // ...resets the loadMoare variable to false...
        loadMore = false;
        // ...and sets the favorites variable to true.
        favoritesDisplayed = true;

        // Grabs the "Favorite Pokemon" array from the user's local storage and stores it in the favoriteArray variable.
        favoritesArray = JSON.parse(localStorage.getItem("Favorite Pokemon"));

        // For every item in the array...
        for (i = 0; favoritesArray[i]; i++) {
            // ...create a div...
            var gifDiv = $("<div class='pokemon-gif'>");

            // When mousing over this div...
            gifDiv.mouseover(function() {
                // ...show the button to remove this gif from the user's favorites.
                $(this).children(".remove").show();
            });

            // When the user's mouse leaves this div...
            gifDiv.mouseout(function() {
                // ...hide the "remove" button again.
                $(this).children(".remove").hide();
            });

            // Set the div attributes.
            gifDiv.attr({
                "data-still": favoritesArray[i].still,
                "data-animate": favoritesArray[i].animate,
                "data-state": "still",
                "index": i
            });

            // Initiate a new p tag to display the rating
            var p = $("<p>").text("Rating: " + favoritesArray[i].rating);

            // Initiate a new img tag...
            var pokemonImage = $("<img>");
            // ...with a class of "pokemon-img" and a src pulled from the array.
            pokemonImage.attr({
                class: "pokemon-img",
                src: favoritesArray[i].still,
            });

            // Initiate a download link.
            var pokemonLink = $("<a href=" + favoritesArray[i].animate + " download>")

            // Initiate a new image tag...
            var downloadImage = $("<img>");
            // ...that uses our download icon...
            downloadImage.attr({ src: "assets/images/download.png", class: "download" });
            // ...and add it to our download link.
            pokemonLink.prepend(downloadImage);

            // Initiate a new p tag...
            var remove = $("<p>");
            // ...with the text "remove".
            remove.addClass("remove").text("remove");

            // Add all of the above to the div we created.
            gifDiv.prepend(pokemonLink);
            gifDiv.prepend(remove);
            gifDiv.prepend(p);
            gifDiv.prepend(pokemonImage);

            // Add the div we created to the gif containing div.
            $("#gifs-appear-here").append(gifDiv);

            // Hide the remove button.
            $(".remove").hide();
        }

    }

    // Removes gifs from the user's local storage.
    function removeFavorite() {
        // Finds the gif's index stored in the div's attributes, and sets it to a variable, "index"...
        var index = $(this).parent().attr("index");

        // ...uses that index to remove the gif from the favoritesArray...
        favoritesArray.splice(index, 1);

        // ...and updates the "Favorite Pokemon" array in the user's local storage.
        localStorage.setItem("Favorite Pokemon", JSON.stringify(favoritesArray));
        // Re-displays the list of Favorites.
        displayFavorites();
    }

    // Takes the user input and adds it to the list of pokemon.
    $("#add-pokemon").on("click", function(event) {
        event.preventDefault();
        // Takes the user input...
        var pokeInput = $("#poke-input").val().trim();
        // ...adds it to the list of pokemon topics...
        if (pokeInput !== "") {
            pokemon.push(pokeInput);
        }
        // ...then resets the input field...
        $("#poke-input").val("");
        // ...and re-displays the topics on the page.
        displayTopics();

    });

    $(document).on("click", ".topic", displayGifs);
    $(document).on("click", "#load", displayGifs);
    $(document).on("click", ".pokemon-img", animate);
    $(document).on("click", ".favorite", addFavorite);
    $(document).on("click", "#favorites", displayFavorites);
    $(document).on("click", ".remove", removeFavorite);

    titleBackground();
    displayTopics();
});