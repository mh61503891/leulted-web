function get_remote_video_by_url(url) {
	var js = $.ajax({
		async: false,
		type: 'GET',
		dataType: 'text',
		timeout: 1000,
		url: '/video.js',
		data: {
			url: url
		},
		success: function(data, status) {},
		error: function() {}
	}).responseText
	var video = {}
	eval(js)
	return video
}

function get_remote_video_by_id(id) {
	var js = $.ajax({
		async: false,
		type: 'GET',
		dataType: 'text',
		timeout: 1000,
		url: '/video.js',
		data: {
			id: id
		},
		success: function(data, status) {},
		error: function() {}
	}).responseText
	var video = {}
	eval(js)
	return video
}

function get_local_video_by_id(id) {
	return JSON.parse(localStorage.getItem('video-' + id))
}

function get_video_by_id(id) {
	var video = get_local_video_by_id(id)
	if (video) {
		return video
	} else {
		video = get_remote_video_by_id(id)
		add_local_video(video)
		return video
	}
}

function get_local_videos() {
	console.log(arguments)
	var videos = $.map(get_local_video_ids(), function(id) {
		return get_local_video_by_id(id)
	})
	return videos
}

function add_local_video(video) {
	localStorage.setItem('video-' + video.details.id, JSON.stringify(video))
	return true
}

function remove_local_video_by_id(id) {
	console.log(arguments)
	localStorage.removeItem('video-' + id)
}

function get_local_video_ids() {
	console.log(arguments)
	var keys = $.grep(Object.keys(localStorage), function(key) {
		return key.match(/video-\d+/)
	})
	var ids = $.map(keys, function(key) {
		return key.replace('video-', '')
	})
	return ids
}

function get_remote_video_caption(id, lang) {
	return $.ajax({
		async: false,
		type: 'GET',
		dataType: 'json',
		timeout: 1000,
		url: 'captions.json',
		data: {
			id: id,
			lang: lang
		},
		success: function(data, status) {},
		error: function() {}
	}).responseJSON.captions
}

function get_local_video_caption(id, lang) {
	return JSON.parse(localStorage.getItem('caption-' + id + '-' + lang))
}

function set_local_video_caption(id, lang, caption) {
	localStorage.setItem('caption-' + id + '-' + lang, JSON.stringify(caption))
}

function get_video_caption(id, lang) {
	var caption = get_local_video_caption(id, lang)
	if (caption) {
		return caption
	} else {
		caption = get_remote_video_caption(id, lang)
		set_local_video_caption(id, lang, caption)
		return caption
	}
}

function set_local_video_offset(id, ms) {
	localStorage.setItem('offset-' + id, ms)
}

function get_local_video_offset(id) {
	var offset = localStorage.getItem('offset-' + id)
	return parseInt(offset ? offset : 12000)
}