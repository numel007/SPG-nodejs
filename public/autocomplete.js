$(document).ready(function () {
	let fieldCounter = 1;

	// Generate more input fields with autocomplete functionality
	$(".new-field").on("click", function (e) {
		e.preventDefault();

		if (fieldCounter < 5) {
			$(".form").append(
				'<div><input type="text" class="artist-search" placeholder="Enter artist"><a href="#" class="delete-field">Remove</a></div>'
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
								};
							})
						);
					},
				});
			},
		});
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
							};
						})
					);
				},
			});
		},
	});

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
