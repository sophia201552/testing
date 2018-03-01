import ErrorLog from './errorLog';
const auth = function() {
  let deferred = $.Deferred();
  deferred.done(login_result => {
    //先手动添加默认项目:
    let userDefaultProject = {
        id: Number('9999' + login_result.id),
        name_cn: login_result.id + '_Default',
        name_en: login_result.id + '_Default',
        name_english: login_result.id + '_Default',
        time_format: 0,
        isStrategyDefault: true
    };

    login_result.projects.unshift(userDefaultProject);

    window.appConfig.project ={};
    window.appConfig.user.id = login_result.id;
    window.appConfig.projectList = login_result.projects;
    window.appConfig.language = localStorage.getItem('language')||'zh';
    window.appConfig.userProfile = login_result.userProfile;
    
    window.errorLog = new ErrorLog({url:'/strategyV2/writeErrorLog',headers:{
      token: 'eyJhbGciOiJIUzI1NiIsImV4cCI6MT',
      'Content-Type': 'application/json'
    },userId:login_result.id,path:'strategyV2'});
  });
  if (process.env.NODE_ENV === 'production') {
    const token = document.querySelector('#hidToken').value;
    if (token !== '') {
      apiFetch.login({ token }).subscribe({
        fail: rs => {},
        next: login_result => {
          if (login_result.status != undefined && login_result.status == true) {
            if (login_result.projects && login_result.projects.length > 0) {
              deferred.resolve(login_result);
            } else {
              deferred.reject();
            }
          } else {
            deferred.reject();
          }
        }
      });
    } else {
      deferred.resolve({});
    }
  } else {
    let temp_login_result = localStorage.getItem(
      'strategyV2_temp_login_result'
    );
    if (temp_login_result) {
      deferred.resolve(JSON.parse(temp_login_result));
    } else {
      apiFetch
        .login({
          name: 'amy.zhou@rnbtech.com.hk',
          pwd: 'zhouzhou'
        })
        .subscribe({
          fail: rs => {},
          next: login_result => {
            if (login_result.status) {
              deferred.resolve(login_result);
              localStorage.setItem(
                'strategyV2_temp_login_result',
                JSON.stringify(login_result)
              );
            } else {
              deferred.reject();
            }
          }
        });
    }
  }

  return deferred;
};
export default auth;
