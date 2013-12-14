function on_clock_video_append() {
	if ($('input#video-url').val().length > 0) {
		var url = $('input#video-url').val()
		$('input#video-url').button('loading')
		$('button#video-append').button('loading')
		setTimeout(function() {
			var video = get_remote_video_by_url(url)
			append_video(video)
			add_local_video(video)
			$('input#video-url').button('reset')
			$('button#video-append').button('reset')
		}, 1000)
	}
}

$(function() {
	append_videos(get_local_videos())
	if ($('table#videos tbody tr').size() == 0) {
		$.each([66, 848, 1042, 229], function(index, id) {
			var video = get_video_by_id(id)
			console.log(video)
			append_video(video)
		})
	}
	$('button#video-append').on('click', function() {
		on_clock_video_append()
	})
	$('input#video-url').on('keypress', function(e) {
		if (e.keyCode == 13) {
			on_clock_video_append()
		}
	})
	$('table#videos tbody').delegate('tr', 'click', function() {
		location.href = 'video.html?' + $(this).data('id')
	})
	$('table#videos tbody tr td').delegate('button', 'click', function(e) {
		e.stopPropagation()
		var id = $(this).parent().parent().data('id')
		$('table#videos tbody tr[data-id=' + id + ']').fadeOut(500)
		remove_local_video_by_id(id)
	})
})

function append_videos(videos) {
	$.each(videos, function(index, video) {
		append_video(video)
	})
}

function append_video(video) {
	if ($('table#videos tbody tr[data-id=' + video.details.id + ']')) {
		$('table#videos tbody tr[data-id=' + video.details.id + ']').remove()
	}
	var tr = $('<tr>', {
		'data-id': video.details.id,
		style: 'cursor:pointer;'
	})
	var td1 = $('<td>', {
		html: $('<img>', {
			src: video.meta.og.image,
			width: 200,
			height: 150,
			class: 'thumbnail'
		})
	})
	var td2 = $('<td>')
	td2.append($('<button>', {
		class: 'close',
		text: $('<div>').html('&times;').text()
	}))
	td2.append($('<p>', {
		style: 'padding-top: 5px',
		html: $('<strong>', {
			text: video.meta.og.title + ' (' + (parseInt(video.meta.video.duration / 60)) + 'm, ' + moment.unix(parseInt(video.meta.video.release_date)).format('YYYY-MM-DD') + ')'
		})
	}))
	td2.append($('<p>', {
		text: video.meta.og.description
	}))
	td2.append($('<p>', {
		html: $('<a>', {
			href: video.meta.og.url,
			text: video.meta.og.url
		})
	}))
	tr.append(td1)
	tr.append(td2)
	$('table#videos tbody').append(tr)
}