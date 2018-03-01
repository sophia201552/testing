export default class ErrorLog {
  constructor(option = {}) {
    this._option = option; //url,delay,userId,headers
    this._list = [];
    this._tempList = [];
    this._postTimer = undefined;
  }
  static getNavigatorInfo() {
    const appName = navigator.appName, //浏览器的正式名称
      appVersion = navigator.appVersion, //浏览器的版本号
      cookieEnabled = navigator.cookieEnabled, // 返回用户浏览器是否启用了cookie
      cpuClass = navigator.cpuClass, //返回用户计算机的cpu的型号，通常intel芯片返回"x86"（火狐没有）
      platform = navigator.platform, // 浏览器正在运行的操作系统平台，包括Win16(windows3.x)
      //   Win32(windows98,Me,NT,2000,xp),Mac68K(Macintosh 680x0)
      //     和ＭacPPC(Macintosh PowerPC)
      userLanguage = navigator.userLanguage, // 用户在自己的操作系统上设置的语言（火狐没有）
      userAgent = navigator.userAgent, //包含以下属性中所有或一部分的字符串：appCodeName,appName,appVersion,language,platform
      systemLanguage = navigator.systemLanguage, // 用户操作系统支持的默认语言（火狐没有）
      pluginsName = Array.from(navigator.plugins)
        .map(it => it.name)
        .join(';'); //插件名称
    return {
      appName,
      appVersion,
      cookieEnabled,
      cpuClass,
      platform,
      pluginsName,
      userLanguage,
      userAgent,
      systemLanguage
    };
  }
  get list() {
    return this._list;
  }
  error(item) {
    const { delay = 1000 } = this._option;
    this._list.push(item);
    this._tempList.push(item);
    if (this._postTimer) {
    } else {
      this._postTimer = setTimeout(() => {
        this._postTimer = undefined;
        this._save(this._tempList);
        this._tempList = [];
      }, delay);
    }
  }
  _save(data) {
    const defaultOption = {
      credentials: 'same-origin'
    };
    const navigatorInfo = ErrorLog.getNavigatorInfo();
    const _option = {
      ...this._option,
      method: 'POST'
    };

    const { url, method, userId, path } = _option;
    let body = {
      userId: userId,
      path: path,
      data,
      navigatorInfo
    };
    body = JSON.stringify(body);
    fetch(url, Object.assign(defaultOption, _option, { body })).then(
      response => {
        if (response.status >= 200 && response.status < 400) {
          return response.json().then(txt => {
            console.log('错误保存成功', txt);
          });
        } else {
          throw response;
        }
      }
    );
  }
}
