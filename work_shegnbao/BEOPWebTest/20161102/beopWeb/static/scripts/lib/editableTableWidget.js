/*global $, window*/
$.fn.editableTableWidget = function (options) {
    'use strict';
    return $(this).each(function () {
        var buildDefaultOptions = function () {
                var opts = $.extend({}, $.fn.editableTableWidget.defaultOptions);
                opts.editor = opts.editor.clone();
                return opts;
            },
            activeOptions = $.extend(buildDefaultOptions(), options),
            ARROW_LEFT = 37, ARROW_UP = 38, ARROW_RIGHT = 39, ARROW_DOWN = 40,
            ENTER = 13, ESC = 27, TAB = 9, DELETE = 46, CTRL = 17, V = 86, C = 67, X = 88,
            is_CTRL_Down = false,
            element = $(this),
            editor = activeOptions.editor.css('position', 'absolute').hide().appendTo(element.parent()),
            active,
            showEditor = function (select) {
                active = element.find('td:focus');
                if (active.attr('readonly')) {
                    return;
                }
                if (active.length) {
                    editor.val(active.text())
                        .removeClass('error')
                        .show()
                        .offset(active.offset())
                        .css(active.css(activeOptions.cloneProperties))
                        .width(active.width())
                        .height(active.height())
                        .focus();
                    if (select) {
                        editor.select();
                    }
                }
            },
            setActiveText = function () {
                var text = editor.val(),
                    evt = $.Event('change'),
                    originalContent;
                if (active.text() === text || editor.hasClass('error')) {
                    return true;
                }
                originalContent = active.html();
                active.text(text).trigger(evt, text);
                if (evt.result === false) {
                    active.html(originalContent);
                }
            }, clearActiveText = function () {
                element.find('td.selected').html('');
            },
            movement = function (element, keycode) {
                if (keycode === ARROW_RIGHT) {
                    return element.next('td');
                } else if (keycode === ARROW_LEFT) {
                    return element.prev('td');
                } else if (keycode === ARROW_UP) {
                    return element.parent().prev().children().eq(element.index());
                } else if (keycode === ARROW_DOWN) {
                    return element.parent().next().children().eq(element.index());
                }
                return [];
            };
        editor.blur(function () {
            setActiveText();
            editor.hide();
        }).keydown(function (e) {
            if (e.keyCode === ENTER) {
                setActiveText();
                editor.hide();
                active.focus();
                e.preventDefault();
                e.stopPropagation();
            } else if (e.keyCode === ESC) {
                editor.val(active.text());
                e.preventDefault();
                e.stopPropagation();
                editor.hide();
                active.focus();
            } else if (e.keyCode === TAB) {
                active.focus();
            } else if (this.selectionEnd - this.selectionStart === this.value.length) {
                var possibleMove = movement(active, e.keyCode);
                if (possibleMove.length > 0) {
                    possibleMove.focus();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }).on('input paste', function () {
            var evt = $.Event('validate');
            active.trigger(evt, editor.val());
            if (evt.result === false) {
                editor.addClass('error');
            } else {
                editor.removeClass('error');
            }
        });
        element.on('keypress dblclick', showEditor)
            .css('cursor', 'pointer')
            .keydown(function (e) {
                var prevent = true, _this = this,
                    possibleMove = movement($(e.target), e.keyCode);
                if (possibleMove.length > 0) {
                    possibleMove.focus();
                } else if (e.keyCode === ENTER) {
                    showEditor(false);
                } else if (is_CTRL_Down && e.keyCode === V) {
                    prevent = false;
                } else if (is_CTRL_Down && e.keyCode === C) {
                    prevent = false;
                } else if (is_CTRL_Down && e.keyCode === X) {
                    prevent = false;
                } else if (e.keyCode === DELETE) {
                    clearActiveText();
                } else {
                    prevent = false;
                }
                if (prevent) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });
        var shouldCopy = true;
        $(document).off('copy.editableTable').on('copy.editableTable', function (e) {
            if (!element.find('.selected').length) {
                return;
            }

            if (!shouldCopy) {
                shouldCopy = true;
                return;
            }

            var text = '';
            element.find('td.selected').each(function (index, item) {
                text += $(item).text() + '\n';
            });
            copyToClipboard(text);
        });

        $(document).off('cut.editableTable').on('cut.editableTable', function (e) {
            if (!element.find('.selected').length) {
                return;
            }

            if (!shouldCopy) {
                shouldCopy = true;
                return;
            }

            var text = '';
            element.find('td.selected').each(function (index, item) {
                text += $(item).text() + '\n';
            });
            element.find('td.selected').text('');
            copyToClipboard(text);
        });

        $(document).off('paste.editableTable').on('paste.editableTable', function (e) {
            if (!element.find('.selected').length) {
                return;
            }
            var clipboardData, pastedData, pastedEvent = e.originalEvent;
            clipboardData = pastedEvent.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData('text');
            var pastedDataList = pastedData.split('\n');
            pastedDataList = removeListEmptyElement(pastedDataList);
            var selectedTD = element.find('td.selected');
            if (pastedDataList.length === 1) {
                selectedTD.each(function (index, item) {
                    $(item).text(pastedDataList[0].trim());
                })
            } else {
                for (var m = 0; m < pastedDataList.length; m++) {
                    if (!selectedTD.get(m)) {
                        continue;
                    }
                    var $td = $(selectedTD.get(m));
                    $td.text(pastedDataList[m].trim());
                }
            }
        });

        var removeListEmptyElement = function (list) {
            if (!list || !list.length) {
                return [];
            }
            var newList = [];
            list.forEach(function (element) {
                if (!!element) {
                    newList.push(element);
                }
            });
            return newList;
        };

        element.find('td').prop('tabindex', 1);

        element.addClass('editableTableWidget');

        $(document).keydown(function (e) {
            if (e.keyCode == CTRL) is_CTRL_Down = true;
        }).keyup(function (e) {
            if (e.keyCode == CTRL) is_CTRL_Down = false;
        });

        $(window).on('resize', function () {
            if (editor.is(':visible')) {
                editor.offset(active.offset())
                    .width(active.width())
                    .height(active.height());
            }
        });
        var allCells = element.find('td');
        allCells.mousedown(rangeMouseDown)
            .mouseup(rangeMouseUp)
            .mousemove(rangeMouseMove);

        var dragStart = 0;
        var dragEnd = 0;
        var isDragging = false;
        var columnNum = element.find('th').length;

        function rangeMouseDown(e) {
            if (isRightClick(e)) {
                return false;
            } else {
                var $this = $(this);
                dragStart = allCells.index($this);
                isDragging = true;
                allCells.removeClass('selected');
                $this.addClass('selected');

                document.documentElement.onselectstart = function () {
                    return false;
                };
            }
        }

        function rangeMouseUp(e) {
            if (isRightClick(e)) {
                return false;
            } else {
                dragEnd = allCells.index($(this));

                isDragging = false;
                if (dragEnd != 0) {
                    selectRange();
                }

                document.documentElement.onselectstart = function () {
                    return true;
                };
            }
        }

        function rangeMouseMove(e) {
            if (isDragging) {
                dragEnd = allCells.index($(this));
                selectRange();
            }
        }

        function isSameColumn(start, end) {
            return (start % columnNum) === (end % columnNum);
        }

        function isSameRow(start, end) {
            return Math.floor(start / columnNum) === Math.floor(end / columnNum);
        }

        function makeCellSelected(cell) {
            if (cell) {
                var $cell = $(cell);
                if (!$cell.attr('readonly')) {
                    $cell.addClass('selected');
                }
            }
        }

        function selectRange() {
            allCells.removeClass('selected');
            var start = 0, end = 0;
            if (dragEnd + 1 < dragStart) { // reverse select
                start = dragEnd;
                end = dragStart;
            } else {
                start = dragStart;
                end = dragEnd;
            }

            if (isSameColumn(start, end)) {
                var endCeil = Math.ceil(end / columnNum);
                for (var c_index = start; c_index < (endCeil * columnNum + 1); c_index = c_index + columnNum) {
                    makeCellSelected(allCells[c_index]);
                }
                return;
            }
            if (isSameRow(start, end)) {
                for (var r_index = start; r_index < end + 1; r_index++) {
                    makeCellSelected(allCells[r_index]);
                }
                return;
            }

            var minColumn = Math.min(start % columnNum, end % columnNum),
                maxColumn = Math.max(start % columnNum, end % columnNum),
                minRow = Math.min(Math.floor(start / columnNum), Math.floor(end / columnNum)),
                maxRow = Math.max(Math.floor(start / columnNum), Math.floor(end / columnNum));

            for (var i = minRow; i < maxRow + 1; i++) {
                for (var j = minColumn; j < maxColumn + 1; j++) {
                    makeCellSelected(allCells[i * columnNum + j]);
                }
            }
        }

        function isRightClick(e) {
            if (e.keyCode) {
                return (e.keyCode == 3);
            } else if (e.button) {
                return (e.button == 2);
            }
            return false;
        }

        function copyToClipboard(text) {
            if (!text) {
                return;
            }
            var success = true,
                range = document.createRange(),
                selection;

            // For IE.
            if (window.clipboardData) {
                window.clipboardData.setData("Text", text);
            } else {
                // Create a temporary element off screen.
                var tmpElem = $('<pre>');
                tmpElem.css({
                    position: "absolute",
                    left: "-1000px",
                    top: "-1000px"
                });
                // Add the input value to the temp element.
                tmpElem.text(text);
                $("body").append(tmpElem);
                // Select temp element.
                range.selectNodeContents(tmpElem.get(0));
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                try {
                    shouldCopy = false;
                    success = document.execCommand("copy", false, null);
                }
                catch (e) {
                    shouldCopy = true;
                }
                if (success) {
                    tmpElem.remove();
                }
            }
        }
    });

};
$.fn.editableTableWidget.defaultOptions = {
    cloneProperties: ['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
        'text-align', 'font', 'font-size', 'font-family', 'font-weight',
        'border', 'border-top', 'border-bottom', 'border-left', 'border-right'],
    editor: $('<input>')
};
