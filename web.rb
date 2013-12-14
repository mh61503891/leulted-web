require 'sinatra'
require 'open-uri'
require 'nokogiri'
require 'json'
require 'tmp_cache'

get '/' do
	erb :index
end

get '/video.html?:id' do
	erb :video
end

get '/about.html' do
	erb :about
end



get '/video.js' do
	return not_found unless params[:id] || params[:url]
	path = 'http://www.ted.com/talks/view/lang/en/id/' + params[:id] if params[:id]
	path = params[:url] if params[:url]
	return not_found unless path =~ /^http\:\/\/www.ted.com\/talks\//

	get_javascript = lambda{ |url|
		js = TmpCache.get(url)
		if js
			return js
		else
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
			js = ''
			js << 'var video = {};'+ $/
			js << "video['meta'] = " + JSON.generate(meta) + ';'+ $/
			js << doc.xpath('//script').select{|e|e.text.include?('talkDetails')}.first.text + ';'+ $/
			js << "video['details'] = talkDetails" + ';'+ $/
			TmpCache.set(url, js, 1200)
			return js
		end
	}
	return get_javascript.call(path)
end

get '/captions.json' do
	return not_found unless params[:id] || params[:lang]
	id = params[:id]
	lang = params[:lang]
	url = 'http://www.ted.com/talks/subtitles/id/' + id + '/lang/' + lang + '/format/json'
	captions = open(url){ |input| input.read }
	return captions
end

helpers do
  def base_url
    @base_url ||= "#{request.env['rack.url_scheme']}://#{request.env['HTTP_HOST']}"
  end
end


