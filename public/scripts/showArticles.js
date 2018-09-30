// Feature of bookmarking an article
$('.bookmark').click(function(e){

  $.ajax({
     type: "POST",
     url: "/articles/bookmark",
     data:{
       id: $(this).parent().next('.theArticle').attr('href')
     },
     context: this,
     success: function(result){

       if(result['message'] === "Added"){
         $(this).attr('class','fa fa-2x fa-bookmark bookmark');
         $(this).css('color','blue');
       }
       else if(result['message'] === "Removed"){
         $(this).attr('class','fa fa-2x fa-bookmark-o bookmark');
         $(this).css('color','black');
       }
     }
   });
});
