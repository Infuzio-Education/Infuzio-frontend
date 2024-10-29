.PHONY: dev-pull dev-up dev-docdevup

# Pull the latest docker image (of backend's dev) from github registry and starts the container
dev-backend: 
	docker-compose -f development/docker/docker-compose-upon-dev-merge.yml pull infuzio
	docker-compose -f development/docker/docker-compose-upon-dev-merge.yml up

# Pull the latest docker image (of backend's beta) from github registry and starts the container
beta-backend:
	docker-compose -f development/docker/docker-compose-upon-beta-push.yml pull infuzio-beta
	docker-compose -f development/docker/docker-compose-upon-beta-push.yml up

docker-clean-up:
ifeq ($(OS),Linux)
	docker ps -a --format "{{.ID}} {{.Image}}" | grep "^.* ghcr.io/infuzio-education/infuzio" | awk '{print $$1}' | xargs -r docker rm -f
	docker images "ghcr.io/infuzio-education/infuzio*" -q | xargs -r docker rmi -f
	docker rmi $(docker images -f "dangling=true" -q)

else ifeq ($(OS),Darwin)
	docker ps -a --format "{{.ID}} {{.Image}}" | grep "^.* ghcr.io/infuzio-education/infuzio" | awk '{print $$1}' | xargs -r docker rm -f
	docker images "ghcr.io/infuzio-education/infuzio*" -q | xargs -r docker rmi -f
	docker rmi $(docker images -f "dangling=true" -q)

else ifeq ($(OS),Windows_NT)
	docker ps -a --format "{{.ID}} {{.Image}}" | findstr "ghcr.io/infuzio-education/infuzio" | for /F "tokens=1" %i in ('more') do docker rm -f %i
	docker images "ghcr.io/infuzio-education/infuzio*" -q | for /F "tokens=*" %i in ('more') do docker rmi -f %i
	for /F "tokens=*" %i in ('docker images -f "dangling=true" -q') do docker rmi %i

endif