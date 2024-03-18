import json

def formatJson(obj):
    return json.loads(obj.model_dump_json())

def RES(obj = None, message = "", status = 200):

    response = {'data': None, "message" : message}

    if type(list()) == type(obj): response['data'] = list(obj)
    elif obj is not None: response['data'] = formatJson(obj);


    return response, status
