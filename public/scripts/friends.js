$(function() {
  $('.search-input input').blur(function() {
    if ($(this).val())
    {
      $(this)
        .find('~ label, ~ span:nth-of-type(n+3)')
        .addClass('not-empty');
    }
    else
    {
      $(this)
        .find('~ label, ~ span:nth-of-type(n+3)')
        .removeClass('not-empty');
    }
  });

  $('.search-input input ~ span:nth-of-type(4)').click(function(){
    $('.search-input input').val('');
    $('.search-input input')
      .find('~ label, ~ span:nth-of-type(n+3)')
      .removeClass('not-empty');
  });

  $(".username").filter(function () {
    var text = $(this).text();
    return text === currUser;
  }).addClass("selfUser");

  $(".selfUser").parent().siblings('.removeFriend').remove();
});


$('.removeFriend').on('click',function(){
  var userToDelete = $(this).parent().find('.username').html();

  if(userToDelete !== currUser)
  {
    $(this).parent().remove();

    $.ajax({
       type: "POST",
       url: "/friends/remove",
       data:{
         friend: userToDelete
       },
       success: function(result){
         console.log(result);
       }
    });
  }
});
