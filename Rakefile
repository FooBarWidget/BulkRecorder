task :default => :regenerate_words_datafile

desc "Regenerate words.js"
task :regenerate_words_datafile do
	sh "cd html && ../index_data.rb > js/words.js"
end

desc "Publish the 'html' dir"
task :publish do
	sh "cp -pR html/* site/"
	sh %Q{cd site && git add . && git commit -a -m "Publish #{Time.now}" && git push origin gh-pages}
end

desc "Start a web server for the 'html' dir"
task :server do
	puts "Starting server on http://127.0.0.1:9000/"
	sh "cd html && python -m SimpleHTTPServer 9000"
end
