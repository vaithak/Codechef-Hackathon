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

  $(".selfUser").parent().siblings('.unFollow').remove();
});


$('.unFollow').on('click',function(){
  var userToDelete = $(this).parent().find('.username').html();

  if(userToDelete !== currUser)
  {
    $(this).parent().remove();

    $.ajax({
       type: "POST",
       url: "/following/remove",
       data:{
         unFollow: userToDelete
       },
       success: function(result){
         if(result == "Login"){
           window.location.href = "/";
         }
         else{
           console.log(result);
         }
       }
    });
  }
});

$('.searchFollow').submit(function(e){
  var userToAdd = $('input[name=follow]').val();
  $('input[name=follow]').val("");
  $('.returnFollowStatus').css("display","none");
  var status = confirmed;

  $.ajax({
     type: "POST",
     url: "/following/add",
     data:{
       follow: userToAdd,
       confirmed: status
     },
     success: function(result){
       // console.log(result);
       if(result==="Login"){
         window.location.href = "/";
       }
       else if(result['message']!="Confirm")
       {
          $('.returnFollowStatus').css("display","inline");
          $('.returnFollowStatus').html(result['message']);

          if(result['message']=="Added")
            window.location.reload();
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

  confirmed=false; // for further following persons
  return false;
});

$('.confirmFollow').on('click',function(){
  confirmed = true;
  var userToAdd = $(this).siblings('.username').find('span').html();
  $('input[name=follow]').val(userToAdd);
  $('.searchFollow').submit();
  $('.displaySearchResult').css("display","none");
});
