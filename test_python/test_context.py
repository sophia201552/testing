from flask import current_app
#导入上下文语句,模拟上下文环境
if not current_app:
    app_ctx = app.app_context()
    app_ctx.push()