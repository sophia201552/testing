/**
 * Created by win7 on 2016/2/23.
 */


var Permission = (function () {

    Permission = {
        addPermission: function (permission) {
            if (permission && permission.trim()) {
                AppConfig.permission[permission.trim()] = true;
            }
        },
        deletePermission: function (permission) {
            if (permission && permission.trim()) {
                AppConfig.permission[permission.trim()] = false;
            }
        },

        setPermission: function (permissionList) {
            AppConfig.permission = {};
            if (permissionList && permissionList.length) {
                for (var m = 0, n = permissionList.length; m < n; m++) {
                    if (permissionList[m]) {
                        AppConfig.permission[permissionList[m].trim()] = true;
                    }
                }
            }
        },

        hasPermission: function (permission) {
            if (AppConfig.userId == 1 || AppConfig.permission['BRoot'] || AppConfig.permission['all']) {
                return true;
            }
            if (/\d+/.test(permission)) {//判断是否为用户ID
                return parseInt(permission) === AppConfig.userId;
            }
            return AppConfig.permission && permission && AppConfig.permission[permission.trim()];
        },

        applyPermissionStyle: function ($dom, addStyle) {
            if (!addStyle || !$dom || !$dom.length) {
                return;
            }
            var styleKey = addStyle.split(':')[0];
            if (styleKey) {
                $dom.css(styleKey, '');
            }

            var style = $dom.attr('style');
            if (style && !style.endsWith(';')) {
                style += ';';
            }

            $dom.attr('style', style ? (style + addStyle) : addStyle);
        },
        /***
         * 用法:
         * 一个权限 permission="p12"
         * 多个权限 permission="p1;p2;68" p1,p2为权限名, 68为用户ID
         * 对点击事件限制 permission="click:p1,p2;p3" p3权限显示 p1,p2可点击
         * permission-style:用于拥有权限都元素怎么显示. 默认增加block.
         */
        permissionStrategy: function ($dom, permissionsToCheck) {
            var permissionItem, clickPermissions, canClick = false, shouldRemove = true;
            var style = $dom.attr('permission-style') ? $dom.attr('permission-style').trim() : 'block';
            for (var m = 0, n = permissionsToCheck.length; m < n; m++) {
                permissionItem = permissionsToCheck[m].trim();

                if (permissionItem.startsWith('click')) {//click权限
                    permissionItem = permissionItem.split(/\s*:\s*/);
                    if (permissionItem.length = 2) {
                        clickPermissions = permissionItem[1].split(/\s*,\s*/);
                    }
                    for (var i = 0, j = clickPermissions.length; i < j; i++) {
                        if (this.hasPermission(clickPermissions[i])) {
                            canClick = true;
                        }
                    }
                    if (!canClick) {//没有点击权限
                        $dom.attr('href', '').attr('disabled', true).addClass('disabled');
                        $dom.off('click').click(function (e) {
                            e.stopPropagation();
                            return false;
                        })
                    }
                    this.applyPermissionStyle($dom, 'display:' + style + " !important");
                } else {
                    if (this.hasPermission(permissionItem)) {
                        this.applyPermissionStyle($dom, 'display:' + style + " !important");
                        shouldRemove = false;
                        break;
                    }
                }
            }
            if (shouldRemove) {
                $dom.remove();
            }
            return false;
        },

        check: function (area) {
            try {
                if (!AppConfig.permission) {
                    return false;
                }
            } catch (e) {
                console.error('AppConfig.permission未定义');
            }
            if (!area) {
                return false;
            }
            if (!(area instanceof jQuery)) {
                area = $(area);
            }

            area.find('[permission]').each(function (index, item) {
                var $item = $(item), permissions;
                permissions = $item.attr('permission').split(/\s*;\s*/);
                Permission.permissionStrategy($item, permissions);
            })
        }
    };
    return Permission;
})();