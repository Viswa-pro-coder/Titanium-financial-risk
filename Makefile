.PHONY: install emulate deploy seed

install:
	npm install
	cd functions && pip install -r requirements.txt

emulate:
	firebase emulators:start

deploy:
	npm run build
	firebase deploy

seed:
	node scripts/seedB2C.js
	node scripts/seedB2B.js
	node scripts/seedB2Pro.js
