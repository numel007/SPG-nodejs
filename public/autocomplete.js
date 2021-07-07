$(document).ready(function () {
    // Generate more input fields with autocomplete functionality
    $('.new-field').on('click', function (e) {
        e.preventDefault()
        $('.form').append('<div><input type="text" class="artist-search" placeholder="Enter artist"><a href="#" class="delete-field">Remove</a></div>');
        $('.artist-search').autocomplete({
            source: function (req, res) {
            $.ajax({
                type: "GET",
                url: "https://api.spotify.com/v1/search",
                headers: {
                    Authorization: "Bearer " + "{{ accessToken }}"
                },
                data: {
                    type: "artist",
                    limit: 20,
                    contentType: "application/json; charset=utf-8",
                    format: "json",
                    q: req.term
                },
                success: function (data) {
                    res($.map(data.artists.items, function (item) {
                        return {
                            label: item.name,
                            value: item.name
                        }
                    }))
                }
            })
        },
        });
    })

    // Autocomplete for first input field
    $("#first-form").autocomplete({
        source: function (req, res) {
            $.ajax({
                type: "GET",
                url: "https://api.spotify.com/v1/search",
                headers: {
                    Authorization: "Bearer " + "{{ accessToken }}"
                },
                data: {
                    type: "artist",
                    limit: 20,
                    contentType: "application/json; charset=utf-8",
                    format: "json",
                    q: req.term
                },
                success: function (data) {
                    res($.map(data.artists.items, function (item) {
                        return {
                            label: item.name,
                            value: item.name
                        }
                    }))
                }
            })
        },
    })

    // Delete field
    $(".form").on("click", ".delete-field", function (e) {
        e.preventDefault();
        $(this).parent('div').remove();
    })

    // Submit artist queries
    $("#submit-button").on("click", function (e) {
        e.preventDefault()
        let artistNames = $('.artist-search').map(function() {
            return this.value;
        }).get();
        console.log(artistNames)
        $.ajax({
            type: "POST",
            url: "/search_autocomplete",
            data: {
                name: artistNames
            }
        })
    })


})