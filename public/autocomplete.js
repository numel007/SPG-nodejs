$(document).ready(function () {
	let fieldCounter = 1;

	// Generate more input fields with autocomplete functionality
	$(".new-field").on("click", function (e) {
		e.preventDefault();

		if (fieldCounter < 5) {
			$(".form").append(
				'<div><input type="text" id="artist-search" class="artist-search" placeholder="Enter artist"><a href="#" class="delete-field btn btn-danger btn-sm">Remove</a></div>'
			);
			fieldCounter ++
		}

		$(".artist-search").autocomplete({
			source: function (req, res) {
				$.ajax({
					type: "GET",
					url: "https://api.spotify.com/v1/search",
					headers: {
						Authorization: "Bearer " + accessToken,
					},
					data: {
						type: "artist",
						limit: 20,
						contentType: "application/json; charset=utf-8",
						format: "json",
						q: req.term,
					},
					success: function (data) {
						res(
							$.map(data.artists.items, function (item) {
								return {
									label: item.name,
									value: item.name,
									thumbnail: item.images[0]
								};
							})
						);
					},
				});
			},
		});

		$("#artist-search").data("ui-autocomplete")._renderItem = function (ul, item) {
			let thumbnail = ''
	
			if (item.thumbnail) {
				thumbnail = item.thumbnail.url
			} else {
				thumbnail = 'https://i.imgur.com/KPquSAA.png'
			}
	
			return $('<li/>', {'data-value': item.label})
					.append($('<a/>', {href: "#"})
					.append($('<img/>', {src: thumbnail, alt: item.label}))
					.append(item.label))
					.appendTo(ul);
		};
	});

	// Autocomplete for first input field
	$("#first-form").autocomplete({
		source: function (req, res) {
			$.ajax({
				type: "GET",
				url: "https://api.spotify.com/v1/search",
				headers: {
					Authorization: "Bearer " + accessToken,
				},
				data: {
					type: "artist",
					limit: 20,
					contentType: "application/json; charset=utf-8",
					format: "json",
					q: req.term,
				},
				success: function (data) {
					res(
						$.map(data.artists.items, function (item) {
							return {
								label: item.name,
								value: item.name,
								thumbnail: item.images[0]
							};
						})
					);
				},
			});
		},
	});

	// Add thumbnails to autocomplete results in the first input field
	$("#first-form").data("ui-autocomplete")._renderItem = function (ul, item) {
		let thumbnail = ''

		if (item.thumbnail) {
			thumbnail = item.thumbnail.url
		} else {
			thumbnail = 'https://i.imgur.com/KPquSAA.png'
		}

		return $('<li/>', {'data-value': item.label})
				.append($('<img/>', {src: thumbnail, alt: item.label}))
				.append(item.label)
				.appendTo(ul);
	};

	// Delete field
	$(".form").on("click", ".delete-field", function (e) {
		e.preventDefault();
		$(this).parent("div").remove();
		fieldCounter --
	});

	// Submit artist queries
	$("#submit-button").on("click", function (e) {
		e.preventDefault();
		let playlistName = ''
		let playlistDescription = ''

		if ($(".playlist-name").val() == '') {
			playlistName = 'null'
		} else {
			playlistName = $(".playlist-name").val()
		}

		if ($(".playlist-description").val() == '') {
			playlistDescription = 'null'
		} else {
			playlistDescription = $(".playlist-description").val()
		}

		let artistNames = $(".artist-search")
			.map(function () {
				return this.value;
			})
			.get();
		console.log(artistNames);
		$.ajax({
			type: "POST",
			url: "/create_playlist",
			data: {
				artistNames: artistNames,
				playlistName: playlistName,
				playlistDescription: playlistDescription,
			},
		});
	});
});
