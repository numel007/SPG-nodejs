$(document).ready(function () {
	let fieldCounter = 1;

	// Generate more input fields with autocomplete functionality
	$(".new-field").on("click", function (e) {
		e.preventDefault();

		let wrapper = `#artist-search-${fieldCounter}`;

		if (fieldCounter < 5) {
			$(".form").append(
				`<div><input type="text" id="artist-search-${fieldCounter}" class="artist-search focusedInput" placeholder="Artist ${
					fieldCounter + 1
				}"><a href="#" class="delete-field btn btn-danger btn-sm">X</a></div>`
			);
			fieldCounter++;
		}

		$("#artist-search-2, #artist-search-3, #artist-search-4, #artist-search-1").autocomplete({
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
									thumbnail: item.images[0],
								};
							})
						);
					},
				});
			},
		});

		$(wrapper).data("ui-autocomplete")._renderItem = function (ul, item) {
			let thumbnail = "";

			if (item.thumbnail) {
				thumbnail = item.thumbnail.url;
			} else {
				thumbnail = "https://i.imgur.com/KPquSAA.png";
			}

			return $("<li/>", { "data-value": item.label })
				.append(
					$("<a/>", { href: "#" })
						.append($("<img/>", { src: thumbnail, alt: item.label }))
						.append(item.label)
				)
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
								thumbnail: item.images[0],
							};
						})
					);
				},
			});
		},
	});

	// Add thumbnails to autocomplete results in the first input field
	$("#first-form").data("ui-autocomplete")._renderItem = function (ul, item) {
		let thumbnail = "";

		if (item.thumbnail) {
			thumbnail = item.thumbnail.url;
		} else {
			thumbnail = "https://i.imgur.com/KPquSAA.png";
		}

		return $("<li/>", { "data-value": item.label })
			.append($("<img/>", { src: thumbnail, alt: item.label }))
			.append(item.label)
			.appendTo(ul);
	};

	// Delete field
	$(".form").on("click", ".delete-field", function (e) {
		e.preventDefault();
		$(this).parent("div").remove();
		fieldCounter--;
	});

	// Submit artist queries
	$("#submit-button").on("click", function (e) {
		e.preventDefault();
		// Show loading gif
		$(".playlist-submission").append("<img src='/images/loading.gif' class='loading-gif' alt='loading' height='50px'/>")
		// $(".create-playlist-submit").append("<img src='/images/loading.gif' class='loading-gif' alt='loading' height='50px'/>")

		let playlistName = "";
		let playlistDescription = "";

		if ($(".playlist-name").val() == "") {
			playlistName = "null";
		} else {
			playlistName = $(".playlist-name").val();
		}

		if ($(".playlist-description").val() == "") {
			playlistDescription = "null";
		} else {
			playlistDescription = $(".playlist-description").val();
		}

		let artistNames = $(".artist-search")
			.map(function () {
				return this.value;
			})
			.get();

		if (artistNames[0] == "") {
			$(".jumbotron").append(
				"<p class='error-message'><span style='color: #ff0000'>You must enter at least one artist name!</span></p>"
			);
			return;
		}

		$.ajax({
			type: "POST",
			url: "/create_playlist",
			data: {
				artistNames: artistNames,
				playlistName: playlistName,
				playlistDescription: playlistDescription,
			},
			success: function (data) {
				// HIDE LOADING GIF
				$(".loading-gif").remove();
				// Delete old header + table
				$(".playlist-header").remove();
				$(".playlist-table-div").remove();
				$(".error-message").remove();

				if (data.error) {
					$(".jumbotron").append(
						"<p class='error-message'><span style='color: #ff0000'>Error generating playlist. Please try again!</span></p>"
					);
					$(".jumbotron").append(
						`<p class='error-message'><span style='color: #ff0000'>Error message: ${data.error}</span></p>`
					);
				} else {
					// Build new header + table
					let tableSetup =
						"<h1 class='playlist-header text-center'>Your new playlist</h1>" +
						"<div class='playlist-table-div'>" +
						"<table class='tracks-table'>" +
						"<thead>" +
						"<th></th>" +
						"<th>Name</th>" +
						"<th>Artist</th>" +
						"<th>Album</th>" +
						"</thead>" +
						"<tbody class='playlist-table-body'></tbody>" +
						"</table>" +
						"</div>";
					$(".playlist-column").append(tableSetup);

					$.each(data, function (index, value) {
						$(".playlist-table-body").append(
							$("<tr></tr>").html(
								`<td>
								<img src=${value.track.album.images[2].url}></img>
							</td>` +
									`<td class='table-data'>${value.track.name}</td>` +
									`<td class='table-data'>${value.track.artists[0].name}</td>` +
									`<td class='table-data'>${value.track.album.name}</td>`
							)
						);
					});
				}
			},
		});
	});
});
