require 'sinatra'
require 'open-uri'
require 'nokogiri'
require 'json'

get '/' do
	erb :index
end

get '/video.js' do
	# TODO sec
	path = params[:url]
	# path = 'janette_sadik_khan_new_york_s_streets_not_so_mean_any_more.html'
	meta = {}
	doc = Nokogiri::HTML(open(path))
	doc.xpath('//meta').each{ |e|
		case e.attr('property')
		when 'og:title', 'og:description', 'og:image', 'og:image', 'og:url', 'og:type'
			meta['og'] ||= {}
			meta['og'][e.attr('property').sub(/^og:/, '')] = e.attr('content') if e.attr('content')
		when 'video:tag', 'video:duration', 'video:release_date'
			meta['video'] ||= {}
			meta['video'][e.attr('property').sub(/^video:/, '')] = e.attr('content') if e.attr('content')
		else
			# do noting
		end
	}
	javascript = ''
	javascript << 'var video = {};'+ $/
	javascript << "video['meta'] = " + JSON.generate(meta) + ';'+ $/
	javascript << doc.xpath('//script').select{|e|e.text.include?('talkDetails')}.first.text + ';'+ $/
	javascript << "video['details'] = talkDetails" + ';'+ $/
	javascript
end

get '/captions.json' do
	id = params[:id]
	lang = params[:lang]
	url = 'http://www.ted.com/talks/subtitles/id/' + id + '/lang/' + lang + '/format/json'
	captions = open(url){ |input| input.read }
	captions
end

get '/video.html' do
	erb :video
end

get '/about.html' do
	erb :about
end


