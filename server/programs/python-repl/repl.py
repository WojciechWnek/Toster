#!/usr/bin/env python

# This script acts as a simple json based repl.
# Input code needs to be inside "code" field.
# Output code sets success and result field.
# Json data needs to be newline terminated.

import json

while True:
    text_input = input() 
    str_input = json.loads(text_input, strict=False)["code"] 
    __repl_result = None
    try:
        if "=" in str_input or "import" in str_input or "for" in str_input:
            exec(str_input)
        else:
            exec("__repl_result = {}".format(str(str_input)))

        result = { 'success' : True }
        if __repl_result != None:
            result["result"] = __repl_result
    except:
        # TODO: Be more verbose
        result = { 'success' : False }
     
    print(json.dumps(result))
