import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AjaxError } from 'rxjs/observable/dom/AjaxObservable';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { headers2Object } from './utils'

class HttpErrorMessage {
  constructor({method, url, error, body}) {
    this.method = method;
    this.url = url;
    this.error = error;
    this.body = body;
  }
}

export const httpError$ = new Subject();

const createMethod = method => params => {
  const { url, body, _opts, errorAdapter$, includeHeaders } = params;

  return Observable.create(observer => {
    const _options = {
      ..._opts,
      method: method
    };
    if (body) {
      let type = Object.prototype.toString.call(body);
      _options.body = type === '[object Object]' || type === '[object Array]' ? JSON.stringify(body) : body;
    }
    let headers;
    fetch(url, _options)
      .then(response => {
        if (response.status >= 200 && response.status < 400) {
          headers = response.headers;
          return response.text();
        } else {
          throw response;
        }
      })
      .then(respText => {
        let result;
        try {
          const respBody = JSON.parse(respText);
          result = !includeHeaders ? respBody : { headers: headers2Object(headers), body: respBody }
        } catch (e) {
          result = respText;
        }
        observer.next(result);
        observer.complete();
      })
      .catch(e => {
        const httpErrMsg = new HttpErrorMessage({
          error: e,
          method, url, body
        });

        setTimeout(() => {
          errorAdapter$.next(httpErrMsg);
        }, 10);
        observer.error(httpErrMsg);
      });
  });
};

const _methods = {
  get: createMethod('get'),
  post: createMethod('post')
}

export const getHttpWithResponseHeaders = (url, errorAdapter$=null) => {
  return new Http(url, errorAdapter$, true);
}

export class Http {
  static get defaultOpts() {
    return {
      credentials: 'same-origin'
    }
  }
  static get get() {
    return _methods['get'];
  }
  static get post() {
    return _methods['post'];
  }
  constructor(url='', errorAdapter$=null, includeHeaders=false) {
    this.url = url;
    this.errorAdapter$ = errorAdapter$ ? errorAdapter$ : httpError$;

    this._opts = Http.defaultOpts;
    this.mapFn = $v => $v;
    this.request = null;
  }
  map(fn) {
    this.mapFn = fn;
    return this;
  }
  setUrl(url) {
    this.url = url;
    return this;
  }
  setHeaders(headers) {
    this._opts.headers = { ...this._opts.headers, ...headers };
    return this;
  }
  setOpts(opts) {
    this._opts = { ...this._opts, ...opts };
    return this;
  }
  restore() {
    this._opts = Http.defaultOpts;
    return this;
  }
  get() {
    this.request = Http.get(this._params());
    return this;
  }
  post(body) {
    this.request = Http.post({ ...this._params(), body });
  }
  send() {
    return this.mapFn(this.request);
  }
  _params() {
    return {
      url: this.url,
      _opts: this._opts,
      errorAdapter$: this.errorAdapter$,
      includeHeaders: this.includeHeaders
    }
  }

}
