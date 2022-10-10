
$(document)['ready'](function () {
  
    $('#game-miniHoaqua')['draggable']({
        start: function () {
            $('.actigame')['removeClass']('actigame');
            $(this)['addClass']('actigame')
        },
        cancel: '.group-button',
        handle: '.move-here'
    });
})
