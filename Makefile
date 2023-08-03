install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint

test:
	npm run test
	
develop:
	npx webpack serve