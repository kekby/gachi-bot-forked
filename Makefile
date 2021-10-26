install:
	docker build . -t gachi-bot
run:
	docker run -d --env-file .env gachi-bot 