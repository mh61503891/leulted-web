function get_remote_video(url) {
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
	eval(js)
	return video
}

function get_local_video(id) {
	console.log(arguments)
	return JSON.parse(localStorage.getItem('video-' + id))
}

function get_local_videos() {
	console.log(arguments)
	var videos = $.map(get_local_video_ids(), function(id) {
		return get_local_video(id)
	})
	return videos
}

function add_local_video(video) {
	console.log(arguments)
	localStorage.setItem('video-' + video.details.id, JSON.stringify(video))
	return true
}

function remove_local_video(id) {
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

function set_local_video_offset(id, ms) {
	localStorage.setItem('offset-' + id, ms)
}

function get_local_video_offset(id) {
	var offset = localStorage.getItem('offset-' + id)
	return parseInt(offset ? offset : 12000)
}