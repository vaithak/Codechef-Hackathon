$(document).ready(function(){
  $('.followLink').click(function(){
    var id = $(this).attr('id');
    if(id!="alreadyFollowing"){
      $.ajax({
         type: "POST",
         url: "/following/add",
         data:{
           follow: id,
           confirmed: true
         },
         success: function(result){
           if(result == "Login"){
             window.location.href = "/";
           }
           else{
             $(this).attr('id', "alreadyFollowing");
             $(this).attr('class',"btn btn-sm btn-basic");
             $(this > 'button').html("Following");
           }
         }
      });
    }
  });

  // Increment Like
  $('#like').click(function(){
    $.ajax({
       type: "POST",
       url: "/articles/like",
       data:{
         id: id
       },
       success: function(result){
         if(result['message'] === "Added"){
           $('#like').css('color','blue');
           $('#dislike').css('color','black');
           $('#like > span').html(result['likes']);
           $('#dislike > span').html(result['dislikes']);
         }
         else if(result['message'] === "Removed"){
           $('#like').css('color','black');
           $('#dislike').css('color','black');
           $('#like > span').html(result['likes']);
           $('#dislike > span').html(result['dislikes']);
         }
       }
     });
  });

  // Increment dislike
  $('#dislike').click(function(){
    $.ajax({
       type: "POST",
       url: "/articles/dislike",
       data:{
         id: id
       },
       success: function(result){
         if(result['message'] === "Added"){
           $('#like').css('color','black');
           $('#dislike').css('color','red');
           $('#like > span').html(result['likes']);
           $('#dislike > span').html(result['dislikes']);
         }
         else if(result['message'] === "Removed"){
           $('#like').css('color','black');
           $('#dislike').css('color','black');
           $('#like > span').html(result['likes']);
           $('#dislike > span').html(result['dislikes']);
         }
       }
     });
  });

});
