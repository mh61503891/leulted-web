function render(id, video, caption) {
	$.each(caption, function(index, caption) {
		$('table#captions tbody').append($('<tr>', {
			'data-index': index,
			'data-start-time': caption.startTime,
			'data-duration': caption.duration,
			'data-start-of-paragraph': caption.startOfParagraph,
			'class': 'caption',
			html: $('<td>', {
				text: caption.content
			})
		}))
	})
	$('#video source').attr('poster', video.meta.og.image)
	$('#video source').attr('src', video.details.htmlStreams[0].file)
	$('#video')[0].load()
	$('#video')[0].play()
	// controllers
	var seek = {
		time: 12000 / 1000,
		duration: 0,
		index: -1,
		offset: get_local_video_offset(id)
	}
	$('#video-offset-value').text(seek.offset / 1000)
	$('#video-offset-up').bind('click', function() {
		seek.offset = seek.offset + 500
		$('#video-offset-value').text(seek.offset / 1000)
		set_local_video_offset(id, seek.offset)
	})
	$('#video-offset-down').bind('click', function() {
		seek.offset = seek.offset - 500
		$('#video-offset-value').text(seek.offset / 1000)
		set_local_video_offset(id, seek.offset)
	})
	$(document).delegate('tr.caption', 'click', function() {
		seek.time = ($(this).data('start-time') + seek.offset) / 1000
		seek.duration = $(this).data('duration') / 1000
		seek.index = $(this).data('index')
		$('#video')[0].currentTime = seek.time
		$("tr.caption").removeClass('success')
		$("tr.caption[data-index='" + seek.index + "']").addClass('success')
		if ($('#video')[0].paused) {
			$('#video')[0].play()
		}
	})
	$('#video').bind('timeupdate', function() {
		if ($('#video')[0].currentTime > (seek.time + seek.duration)) {
			var current = $("tr.caption[data-index='" + seek.index + "']")
			var next = $("tr.caption[data-index='" + (seek.index + 1) + "']")
			seek.time = (next.data('start-time') + seek.offset) / 1000 // TODO change offset
			seek.duration = next.data('duration') / 1000
			seek.index = next.data('index')
			current.removeClass('success')
			next.addClass('success')
			$('html,body').animate({
				scrollTop: (next.offset().top - 140)
			}, 'fast');
			console.log(seek)
		}
	})
}

function get_video_id() {
	return location.search.replace('?', '')
}

$(function() {
	// $('body').modalmanager('loading')
	setTimeout(function() {
		var id = get_video_id()
		var video = get_video_by_id(id)
		var caption = get_video_caption(id, 'en')
		// $('body').modalmanager('removeLoading')
		render(id, video, caption)
	}, 1000)
})