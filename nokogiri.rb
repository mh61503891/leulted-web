require 'nokogiri'
require 'open-uri'
require 'json'

path = 'janette_sadik_khan_new_york_s_streets_not_so_mean_any_more.html'

meta = {}
doc = Nokogiri::HTML(open(path))
doc.xpath('//meta').each{ |e|
	case e.attr('property')
	when 'og:title', 'og:description', 'og:image', 'og:image', 'og:url', 'og:type'
		meta['og'] ||= {}
		meta['og'][e.attr('property')] = e.attr('content') if e.attr('content')
	when 'video:tag', 'video:duration', 'video:release_date'
		meta['video'] ||= {}
		meta['video'][e.attr('property')] = e.attr('content') if e.attr('content')
	else
		# do noting
	end
}

javascript = ''
javascript << 'var meta = ' + JSON.generate(meta) + ';'+ $/
javascript << doc.xpath('//script').select{|e|e.text.include?('talkDetails')}.first.text + ';'+ $/
javascript << "meta['details'] = talkDetails" + ';'+ $/






# pp a = doc.xpath('id("videoHolder")').first.next.next.text


# require 'pp'
# pp meta

# doc.xpath('//h3/a').each do |link|
# puts link.content
# end

require 'pry'
binding.pry

