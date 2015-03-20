import os

bind = "127.0.0.1:8888"
workers = 9
# user = "www-data"
# group = "www-data"
logfile = os.path.join(os.path.dirname(__file__), "logs", "gunicorn.log")
loglevel = "debug"
proc_name = "tealeaf"
