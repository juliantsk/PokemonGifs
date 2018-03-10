var pokemon = ["Psyduck", "Mewtwo", "Pikachu", "Suicune", "Charizard", "Rayquaza", "Gengar", "Blaziken", "Pokeball", "Mimikyu"];

$(document).ready(function() {
    function displayTopics() {
        $("topics").empty();
        for (var i = 0; pokemon[i]; i++) {
            $("#topics").append($("<button>").addClass("topic").text(pokemon[i]));
            console.log(pokemon[i]);
        };
    }

    function displayGifs() {
        var poke = $(this).text();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            poke + "&api_key=dc6zaTOxFJmzC&limit=10&rating=PG&lang=en";

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                var results = response.data;

                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div class='item'>");

                    var rating = results[i].rating;

                    var p = $("<p>").text("Rating: " + rating);

                    var personImage = $("<img>");
                    personImage.attr("src", results[i].images.fixed_height.url);

                    gifDiv.prepend(p);
                    gifDiv.prepend(personImage);

                    $("#gifs-appear-here").prepend(gifDiv);
                }
            });
    }

    $("#add-pokemon").on("click", function(event) {
        event.preventDefault();
        var pokeInput = $("#poke-input").val().trim();

        pokemon.push(pokeInput);

        displayTopics();

    });

    $(document).on("click", ".topic", displayGifs);

    displayTopics();
});