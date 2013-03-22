task :default => :regenerate_words_datafile

task :regenerate_words_datafile do
	sh "cd html && ../index_data.rb > js/words.js"
end

task :publish do
	sh "cp -pR html/* site/"
	sh %Q{cd site && git add . && git commit -a -m "Publish #{Time.now}" && git push origin gh-pages}
end
