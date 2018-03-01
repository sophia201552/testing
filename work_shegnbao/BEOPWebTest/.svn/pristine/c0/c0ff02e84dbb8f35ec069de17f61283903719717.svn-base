/**
Copyright 2016 Chris Brantley (https://github.com/chrisbrantley)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
**/

(function ( $ ) {
    $.fn.fixedHeaderTable = function() {
        return this.each(function() {
            var instance = $(this);
            var headers = $(this).find('.table-header th:not(:last-child)');
            var $tableHeader = $(this).find('.table-header');
            var cells = $(this).find('.table-body tr:first td:not(:last-child)');

            function setPixelWidths(i, pixelWidth) {
                headers.eq(i).css('width', pixelWidth);
                cells.eq(i).css('width', pixelWidth);
            }

            function setPercentageWidths(i, pixelWidth) {
                var percentWidth = (pixelWidth / instance.outerWidth()) * 100;

                headers.eq(i).css('width', percentWidth + '%');
                cells.eq(i).css('width', percentWidth + '%');
                headers.eq(i).data('width',percentWidth);
                headers.eq(i).attr('data-width',percentWidth);
            }

            headers.each(function(idx) {
                var header = $(this);
                var startX = null;
                var resizeHandle = $("<div class='resize-handle'></div>");

                // Initialize widths to percentages
                if(header.data('width')){
                    setPercentageWidths(idx, header.data('width')*$tableHeader.width()/100);
                }else{
                    setPercentageWidths(idx, header.outerWidth());
                }


                // Add resize handle with drag handler
                $(this).append(resizeHandle.on('mousedown', onDragStart));

                function adjustWidth(offset) {
                    var column_width = header.outerWidth() - offset;
                    if (column_width <= 8)
                        return;

                    setPixelWidths(idx, column_width);
                }

                function onDragStart(e) {
                    resizeHandle.addClass('dragging');
                    startX = e.screenX;

                    $(window).on('mousemove', onDrag);
                    $(window).on('mouseup', onDragEnd);

                    return false;
                }

                function onDrag(e) {
                    var endX = e.screenX;

                    adjustWidth(startX - endX);

                    startX = endX;
                }

                function onDragEnd(e) {
                    resizeHandle.removeClass('dragging');

                    setPercentageWidths(idx, header.outerWidth());
                    $(window).off('mousemove', onDrag);
                    $(window).off('mouseup', onDragEnd);
                }
            });

            return this;
        });
    };
}( jQuery ));