;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    enums
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const MyTag = antd.Tag;
    const Pagination = antd.Pagination;
    
    var theme = {
        classificationLayout: function (classNameArr, selectedClassName, selectedConsequence, selectedGrade, selectItem, showMore) {
            var consequence = [
                enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.ENERGY_WASTE],
                enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.COMFORT_ISSUE],
                enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.EQUIPMENT_HEALTH],
                enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.OTHER]
            ];
            var grade = [
                enums.faultGradeName[enums.faultGrade.ABNORMAL],
                enums.faultGradeName[enums.faultGrade.FAULT]
            ];
            var checkConsequence = [];
            for (var i in selectedConsequence) {
                var selectConsequenceName;
                switch(selectedConsequence[i])
                    {
                    case 'Energy waste':
                        selectConsequenceName = enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.ENERGY_WASTE];
                        break;
                    case 'Comfort issue':
                        selectConsequenceName = enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.COMFORT_ISSUE];
                        break;
                    case 'Equipment Health':
                        selectConsequenceName = enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.EQUIPMENT_HEALTH];
                        break;
                    case 'Other':
                        selectConsequenceName = enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.OTHER];
                        break;
                }
                checkConsequence.push(selectConsequenceName);
            }
            var checkedGrade = [];
            for (var i in selectedGrade){
                checkedGrade.push(enums.faultGradeName[selectedGrade[i]]);
            }
            var realWidth = 'calc(100% - 100px)';
            var moreDom = '';
            if (!classNameArr.length < 8){
                moreDom = h('div.showMore', {
                    style: {
                        width: '100px',
                        display: 'inline-block',
                        cursor: 'pointer'
                    },
                    onClick: showMore
                }, [
                    h('span'), ['更多'],
                    h('i.glyphicon.glyphicon-menu-down')
                ])
                realWidth = 'calc(100% - 200px)';
            }
            var classNameChildren = theme.childrenLayout(classNameArr, selectedClassName, 'className', selectItem),
                consequenceChildren = theme.childrenLayout(consequence, checkConsequence,'consequence', selectItem),
                gradeChildren = theme.childrenLayout(grade, checkedGrade, 'grade', selectItem);
            
            return h('div', [
                        h('div', [
                            h('label', {
                                style: {
                                    width: '100px'
                                }
                            }, ['className:']),
                            h('div.classNameCtn',{
                                style: {
                                    width: realWidth,
                                    display: 'inline-block',
                                    marginLeft: '100px'
                                }
                            }, classNameChildren),
                            moreDom
                        ]),h('div', [
                            h('label', {
                                style: {
                                    width: '100px'
                                }
                            },['consequence:']),
                            h('div.consequenceCtn',{
                                style: {
                                    width: realWidth,
                                    display: 'inline-block',
                                    marginLeft: '100px'
                                }
                            }, consequenceChildren)
                        ]),h('div', [
                            h('label', {
                                style: {
                                    width: '100px'
                                }
                            },['grade:']),
                            h('div.gradeCtn',{
                                style: {
                                    width: realWidth,
                                    display: 'inline-block',
                                    marginLeft: '100px'
                                }
                            }, gradeChildren)
                        ])
                    ])
        },
        childrenLayout: function (allArr, selectArr, categoryName, selectItem) {
            var domArr = [];
            for (var i = 0, length = allArr.length; i < length; i++){
                var hasSelected = selectArr.find(function (a) { return a == allArr[i]; });
                var className = 'uncheckButton';
                if (hasSelected){
                    className = 'checkButton';
                }
                domArr.push(
                    h('span.classificationTag', {
                        className: className,
                        onClick: linkEvent({
                            selectName: allArr[i],
                            categoryName: categoryName,
                            checkedStatus: className
                        }, selectItem)
                    }, [allArr[i]])
                );
            }
            return domArr;
        },
        faultInfo: function (items, searchKey, changeSearchKey) {
            var itemsChildren = [];
            for (var i = 0, length = items.length; i < length;i++){
                itemsChildren.push(
                    h('div.singleFault', {
                        'data-isPublic': items[i].isPublic
                    }, [
                        h('div.faultDetail', {
                            'data_id': items[i].id,
                            style: {
                                width:'calc(100% - 160px)'
                            }
                        },[
                            h('span.faultName', [items[i].name]),
                            h('span.faultDescription', [items[i].description]),
                            h('div.lastModifyInfo', [
                                h('span.lastModifyUser', [items[i].lastModifyUser]),
                                h('span.lastModifyTime', [items[i].lastModifyTime.substring(0,16)])
                            ])
                        ]),
                        h('div.userFaultButton', {
                                style: {
                                    width: '40px'
                                }
                            }, [
                            h('span', ['使用'])
                        ]),
                        h('div.copyFaultButton', {
                                style: {
                                    width: '80px'
                                }
                            }, [
                            h('span', ['复制为新的'])
                        ]),
                        h('div.removeFaultButton', {
                                style: {
                                    width: '40px'
                                }
                            }, [
                            h('span', ['删除'])
                        ])
                    ])
                )
            }
            return h('div', [
                h('.input-group', [
                    h('input', {
                        className: 'form-control',
                        type:'text',
                        value: searchKey || '',
                        style: {
                            height: '26px',
                            borderRadius: '4px',
                            padding: '6px 24px 6px 12px',
                            color:'#ffffff'
                        },
                        onInput: changeSearchKey
                    }),
                    h('span.spanSearch', {
                        style: {
                            position: 'absolute',
                            top: '4px',
                            right: '12px'
                        }
                    }, [
                        h('span',{
                            className: 'glyphicon glyphicon-search'
                        })
                    ])
                ]),
                h('.faultsList.gray-scrollbar', {
                    style: {
                        overflow: 'auto',
                        height: '100%'
                    }
                }, [
                    itemsChildren
                ])
            ])
        }
    };

    function FaultInfo(props) {
        const {
            children,
            classNameArr,
            items,
            searchKey,
            selectedClassName,
            selectedConsequence,
            selectedGrade,
            page,
            totalNum,
            isShowMore,
            //actions
            selectItem,
            changeSearchKey,
            changePageNum,
            showMore
        } = props;
        return (
            h('div', {
                id: 'faultManage'
            }, [h('div', {
                    style: {
                        height: '30px'
                    }    
                }, [h('span.glyphicon.glyphicon-remove', {
                        style: {
                            float: 'right',
                            marginRight: '15px',
                            lineHeight: '30px'
                    }    
                })]),
                h('div', {
                    style: {
                        height: 'calc(100% - 90px)',
                        overflow: 'hidden'
                    }
                }, [h('.classificationCtn', [
                        theme.classificationLayout(classNameArr, selectedClassName, selectedConsequence, selectedGrade, selectItem, showMore)
                    ]),
                        h('.faultDetailCtn', {
                            style: {
                                height: 'calc(100% - 133px)'
                            }
                        }, [
                        theme.faultInfo(items, searchKey, changeSearchKey)
                    ]), 
                ]),h(Pagination, {
                    defaultCurrent: page,
                    pageSize: 20,
                    total: totalNum,
                    onChange: changePageNum,
                    style: {
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                })
            ])
        );
    }
    exports.FaultInfo = FaultInfo;
}));