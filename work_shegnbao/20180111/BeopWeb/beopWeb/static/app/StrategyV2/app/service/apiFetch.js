import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import { Http, getHttpWithResponseHeaders } from '../common/http';
import { API_HOST } from '../appConfig';

export const defaultFetchHeaders = () => ({
  'Content-Type': 'application/json',
  token: 'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'
});

const getUnnamedOptions = options => {
  const { apiHost, headers, includeHeaders, ...unnamed } = options;
  return unnamed;
};

const _fetchStack = new Map();

export class ApiFetch {
  static get fetchStack() {
    return _fetchStack;
  }
  constructor(
    apiHost = API_HOST,
    headers = defaultFetchHeaders(),
    options = {}
  ) {
    this._apiHost = apiHost;
    this._headers = headers;
    this._options = options;
  }
  getAPIHost() {
    return this._apiHost;
  }
  setAPIHost(host) {
    this._apiHost = host;
    return this;
  }
  getHeaders() {
    return this._headers;
  }
  setHeaders(headers) {
    this._headers = headers;
    return this;
  }
  getOptions() {
    return this._options;
  }
  setOptions(options) {
    this._options = options;
    return this;
  }
  get(path, query = {}, options = {}) {
    const url = this._urlWithPath(path, options.apiHost);
    const urlWithQuery = query ? this._buildQuery(url, query) : url;
    const http = options.includeHeaders
      ? getHttpWithResponseHeaders()
      : new Http();
    let dist$;

    this._setOptionsPerRequest(http, options);

    if (!ApiFetch.fetchStack.has(urlWithQuery)) {
      dist$ = Observable.defer(() =>
        http
          .setUrl(urlWithQuery)
          .get()
          .send()
          .publishReplay(1)
          .refCount()
      ).finally(() => {
        ApiFetch.fetchStack.delete(urlWithQuery);
      });

      ApiFetch.fetchStack.set(urlWithQuery, dist$);
      return dist$;
    }

    return ApiFetch.fetchStack.get(urlWithQuery);
  }
  post(path, body = {}, options = {}) {
    const http = options.includeHeaders
      ? getHttpWithResponseHeaders()
      : new Http();
    const url = this._urlWithPath(path, options.apiHost);

    this._setOptionsPerRequest(http, options);
    http.setUrl(url).post(body);

    return http.request;
  }
  _urlWithPath(path, apiHost) {
    const host = typeof apiHost === 'undefined' ? this._apiHost : apiHost;
    return `${host}/${path}`;
  }
  _setOptionsPerRequest(http, fetchOptions) {
    let headers;

    if (fetchOptions.headers) {
      const { merge, ...hdrs } = fetchOptions.headers;
      headers = merge ? { ...this._headers, ...hdrs } : hdrs;
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          if (headers[key] === false) {
            delete headers[key];
          }
        }
      }
    } else {
      headers = this._headers;
    }
    http.setHeaders(headers);

    let options = getUnnamedOptions(fetchOptions);
    if (Object.keys(options).length === 0) {
      options = this._options;
    }
    if (Object.keys(options).length > 0) {
      http.setOpts(options);
    }
  }
  _buildQuery(url, query) {
    if (!query || typeof query !== 'object') {
      return url;
    }
    const result = [];
    Object.keys(query).forEach(key => {
      let val;
      val = query[key];
      if (key === '_') {
        logger.warn("query key should not equal to '_', it will be ignored");
        return;
      }
      if (Array.isArray(val)) {
        val.forEach(_val => {
          if (typeof _val !== 'undefined') {
            result.push(`${key}=${encodeURIComponent(_val)}`);
          }
        });
      } else {
        if (typeof val !== 'undefined') {
          result.push(`${key}=${encodeURIComponent(val)}`);
        }
      }
    });

    let _query;
    if (url.indexOf('?') !== -1) {
      _query = result.length ? '&' + result.join('&') : '';
    } else {
      _query = result.length ? '?' + result.join('&') : '';
    }

    return url + _query;
  }
}
