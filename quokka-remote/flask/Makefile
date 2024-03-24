start:
		flask --app app run --debug
setup:
		rm -rf ./.venv && \
		python3 -m venv .venv && \
		. .venv/bin/activate && \
		pip3 install -r requirements.txt
freeze:
		pip3 freeze > requirements.txt
demo:	
		echo "1"