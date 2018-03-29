from flask import current_app
import datetime
#导入上下文语句,模拟上下文环境
# if not current_app:
#     app_ctx = app.app_context()
#     app_ctx.push()

class Test:
    def decorate(funciton):
        def wrapper(*args,**kargs):
            print("start")
            start=datetime.datetime.now()
            funciton()
            print("end")
            total=datetime.datetime.now()-start
            return total
        return wrapper
