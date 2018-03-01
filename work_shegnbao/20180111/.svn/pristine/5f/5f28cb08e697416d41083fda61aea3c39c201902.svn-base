const LEVEL = {
  LOG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  EXCEPTION: 5
};

const envify = () => {
  const env = (process && process.env && process.env.NODE_ENV) || 'production';
  switch (env) {
    case 'production':
      return LEVEL.ERROR;
    case 'development':
      return LEVEL.LOG;
    default:
      return LEVEL.ERROR;
  }
};

class Logger {
  constructor(level=LEVEL.ERROR) {
    this._level = level;
  }
  log() {
    if (this._level > LEVEL.LOG) return;
    this._out('log', arguments);
  }
  info() {
    if (this._level > LEVEL.INFO) return;
    this._out('info', arguments);
  }
  warn() {
    if (this._level > LEVEL.WARN) return;
    this._out('warn', arguments);
  }
  error() {
    if (this._level > LEVEL.ERROR) return;
    this._out('error', arguments);
  }
  exception(message, exception) {
    if (this._level > LEVEL.EXCEPTION) return;
    if (exception) {
      this.error('Exception: ', message, exception.stack || exception);
    } else {
      this.error('Exception: ', message);
    }
  }
  _out(type, args) {
    if (args) {
      args = Array.prototype.slice.call(args);
    }
    console[type].apply(console, args);
  }
}

export default new Logger(envify())
