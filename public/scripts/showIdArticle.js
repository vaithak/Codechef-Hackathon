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
             window.location.reload();
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


  // Feature of bookmarking an article
  $('#bookmark').click(function(){
    $.ajax({
       type: "POST",
       url: "/articles/bookmark",
       data:{
         id: id
       },
       success: function(result){
         if(result['message'] === "Added"){
           $('#bookmark').attr('class','fa fa-2x fa-bookmark');
           $('#bookmark').css('color','blue');
         }
         else if(result['message'] === "Removed"){
           $('#bookmark').attr('class','fa fa-2x fa-bookmark-o');
           $('#bookmark').css('color','black');
         }
       }
     });
  });

});
