NAME	= qwest
VERSION	= grep -m 1 Version src/${NAME}.js | cut -c19-

all: lint minify

lint:
    # Disabled since a bug into jshint...
    #jshint src/${NAME}.js --config config/jshint.json

minify:
	rm -f ${NAME}*
	uglifyjs src/${NAME}.js > ${NAME}-`${VERSION}`.min.js

instdeps:
	npm install jshint -g
	npm install uglify-js -g
