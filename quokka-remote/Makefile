start:
		flask --app app run --debug
setup:
		upgrade python3 -m pip install --upgrade pip && \
		rm -rf ./.venv && \
		python3 -m venv .venv && \
		. .venv/bin/activate && \
		pip install -r requirements.txt
freeze:
		pip3 freeze > requirements.txt
demo:	
		echo "1"