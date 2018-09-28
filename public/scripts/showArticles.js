$(document).ready(function() {
  
  let linksParent = $('.ctn-tabs-links'),
      items = $('.ctn-tabs-contents-item');
  
  $('.ctn-icons-tabs').on('click', function() {
    $(this).addClass('active').siblings('.ctn-icons-tabs').removeClass('active');
    items.eq($(this).index()).removeClass('hide').siblings('.ctn-tabs-contents-item').addClass('hide');
  });
  
});