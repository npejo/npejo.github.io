source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']

gem "jekyll-assets"
gem "uglifier"      # And we want our javascripts to be minified with UglifyJS
gem "sass"          # And we want to write our stylesheets using SCSS/SASS