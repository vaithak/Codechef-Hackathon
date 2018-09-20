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

$('.searchFriend').submit(function(e){
  var userToAdd = $('input[name=friend]').val();
  $('.returnFriendStatus').css("display","none");
  var status = confirmed;

  $.ajax({
     type: "POST",
     url: "/friends/add",
     data:{
       friend: userToAdd,
       confirmed: status
     },
     success: function(result){
       // console.log(result);
       if(result['message']!="Confirm")
       {
          $('.returnFriendStatus').css("display","inline");
          $('.returnFriendStatus').html(result['message']);

          if(result['message']=="Added")
            location.reload();
       }
       else
       {
          $('.displaySearchResult').css("display","block");
          $('.displaySearchResult').find('.username').html("<b>Name: </b><span>" + result['content']['username'] + "</span>");
          $('.displaySearchResult').find('.ranking').html("<b>Global Ranking: </b><span>" + result['content']['ranking'] + "</span>");
          $('.displaySearchResult').find('.rating').html("<b>Codechef Rating: </b><span>" + result['content']['rating'] + "</span>");
          $('.displaySearchResult').find('.institute').html("<b>Institute: </b><span>" + result['content']['institute'] + "</span>");
       }

     }
  });

  confirmed=false; // for further adding of friends
  return false;
});

$('.confirmFriend').on('click',function(){
  confirmed = true;
  var userToAdd = $(this).siblings('.username').find('span').html();
  $('input[name=friend]').val(userToAdd);
  $('.searchFriend').submit();
  $('.displaySearchResult').css("display","none");
});
