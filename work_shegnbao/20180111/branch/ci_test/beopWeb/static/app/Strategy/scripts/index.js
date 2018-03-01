(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React',
            'ReactDOM',
            './core/store'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React'),
            require('ReactDOM'),
            require('./core/store')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('ReactDOM'),
            namespace('ReactRedux'),
            namespace('beop.strategy.core.store'),
            namespace('beop.strategy.core.history'),
            namespace('beop.strategy.components.App'),
            namespace('beop.strategy.containers.Painter'),
            namespace('beop.strategy.components.FaultManage')
        );
    }
}(namespace('beop.strategy'), function(exports, React, ReactDOM, ReactRedux, store, history, App, Painter, FaultManage) {
    const h = React.h;

    window.AppConfig = window.AppConfig || {};

    var auth = function (){
        var token = document.querySelector('#hidToken').value;
        if (token !== '') {
            return WebAPI.post("/login", {
                token: token
            }).then(function (login_result){
                if (login_result.status != undefined && login_result.status == true) {
                    if (login_result.projects && login_result.projects.length > 0) {
                        AppConfig.userId = login_result.id;
                        AppConfig.projectList = login_result.projects;
                        AppConfig.userProfile = login_result.userProfile;
                        if (!AppConfig.projectId) {
                            AppConfig.projectId = AppConfig.projectList[0].id;
                        }
                        return login_result;
                    } else {

                    }
                } else {

                }
            })
        }
        return null;
    };

    var renderComponent = function(component, onRender) {
        ReactDOM.render(
            h(ReactRedux.Provider, {
                store: store
            }, [component]),
            document.querySelector('#mainframe')
        );
        typeof onRender === 'function' && onRender();
    };

    var render = function(location) {
        var match, component, onRender;

        if (location.match(/^\/strategy(?:\/app)?\/?$/)) {
            component = h(App);
            let indexToFactoryId = localStorage.getItem('indexToFactoryId');
            if(indexToFactoryId){
                onRender = function() {
                    store.dispatch(namespace('beop.strategy.modules.EquipTree.actions').changeProjTree(indexToFactoryId));
                    localStorage.removeItem('indexToFactoryId');
                }
            }
        } else if (match = location.match(/^\/strategy\/painter\/([a-zA-z0-9]{24})\/?$/)) {
            component = h(Painter);
            onRender = function() {
                store.dispatch(namespace('beop.strategy.modules.Sketchpad.actions').initData(match[1]));
                store.dispatch(namespace('beop.strategy.modules.EquipTree.actions').onSelectTreeNode(match[1]));
            }
        } else if (match = location.match(/^\/strategy\/faultManage\/?$/)){
            component = h(FaultManage);
            onRender = function() {
                store.dispatch(namespace('beop.strategy.modules.FaultInfo.actions').initData(match[1]));
            }
        }
        renderComponent(component, onRender);
    };

    $.when(auth()).then((login_result) => {
        var promise = $.Deferred();
        promise.done(function() {
            window.onpopstate = function(event) {
                render(window.location.pathname);
            };
            history.onpushstate = function(data) {
                render(data.url);
            };
            // render current url
            if (login_result) {
                store.dispatch(namespace('beop.strategy.modules.EquipTree').actions.changeState(login_result));
            }
            render(window.location.pathname);
        });
        window.initI18n(navigator.language.split('-')[0], false, promise);
    });

    // 兼容一下 tag 树的 bootstrap tooltip
    $.fn.tooltip = () => {}
}));