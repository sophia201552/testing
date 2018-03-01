from mainService import app


def init():
    app.run('0.0.0.0', 5009, use_reloader=False, threaded=True, debug=False)


if __name__ == '__main__':
    init()
