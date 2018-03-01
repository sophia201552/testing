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
            return AppConfig.permission && permission && AppConfig.permission[permission.trim()];
        },

        permissionStrategy: function ($dom, permissionsToCheck) {
            var permissionItem, clickPermissions, canClick = false, shouldRemove = true;
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
                    if (!canClick) {
                        $dom.attr('href', '').attr('disabled', true).addClass('disabled');
                        $dom.click(function (e) {
                            e.stopPropagation();
                            return false;
                        })
                    }
                    $dom.attr("style", "display: block !important");
                } else {
                    if (this.hasPermission(permissionItem)) {
                        $dom.attr("style", "display: block !important");
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