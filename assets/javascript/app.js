var pokemon = ["Psyduck", "Mewtwo", "Pikachu", "Suicune", "Charizard", "Rayquaza", "Gengar", "Blaziken", "Pokeball", "Mimikyu"];
var currentTopic = "";
var loadMore = false;
var offset = 0;

$(document).ready(function() {
    function displayTopics() {
        $("#topics").empty();
        for (var i = 0; pokemon[i]; i++) {
            $("#topics").append($("<button>").addClass("topic").text(pokemon[i]));
        };
    }

    // Title flair
    function titleBackground() {
        var random = Math.floor((Math.random() * 100));
        $.ajax({
                url: "https://api.giphy.com/v1/gifs/search?api_key=X2pzCnYBHgSnhsVAJTqXkkU1HIOsdjRx&q=pokemon&limit=5&offset=" + random + "&rating=G&lang=en",
                method: "GET"
            })
            .then(function(response) {
                var results = response.data;
                var imageURLs = "";
                var imagePositions = "0vw,";
                var posNumber = 0;

                for (var i = 0; i < results.length; i++) {
                    imageURLs += "url(\"" + results[i].images.fixed_height_still.url + "\")";
                    posNumber += ((results[i].images.fixed_height_still.width / results[i].images.fixed_height_still.height - 0.01) * 15);
                    imagePositions += posNumber + "vw";
                    if (i !== (results.length - 1)) {
                        imageURLs += ",";
                        imagePositions += ",";
                    }
                }
                $("div.title").css("background-image", imageURLs);
                $("div.title").css("background-position", imagePositions);
            });
    };

    function displayGifs() {
        console.log(currentTopic);
        if (currentTopic !== $(this).text() && $(this).text() !== "Load 10 More Gifs") {
            $("#gifs-appear-here").empty();
            offset = 0;
        }
        if (!(loadMore)) {
            $("body").append($("<button>").attr("id", "load").text("Load 10 More Gifs"));
            loadMore = true;
        }
        if ($(this).text() !== "Load 10 More Gifs") {
            currentTopic = $(this).text();
        }
        offset += 10;
        console.log(offset);
        console.log(currentTopic);
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            currentTopic + "&api_key=dc6zaTOxFJmzC&limit=10&offset=" + offset + "&rating=PG&lang=en";

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                var results = response.data;

                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div class='pokemon-gif'>");

                    var rating = results[i].rating;

                    var p = $("<p>").text("Rating: " + rating);

                    var pokemonImage = $("<img>");
                    pokemonImage.attr("src", results[i].images.fixed_height.url);

                    gifDiv.prepend(p);
                    gifDiv.prepend(pokemonImage);

                    $("#gifs-appear-here").append(gifDiv);
                };
            });
        $("div.title").css("display", "none");
    };

    // Takes the user input and adds it to the list of pokemon.
    $("#add-pokemon").on("click", function(event) {
        event.preventDefault();
        var pokeInput = $("#poke-input").val().trim();
        pokemon.push(pokeInput);

        $("#poke-input").val("");
        displayTopics();

    });

    $(document).on("click", ".topic", displayGifs);
    $(document).on("click", "#load", displayGifs);

    titleBackground();
    displayTopics();
});