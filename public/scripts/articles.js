	$(document).ready(function(){
	// This adds some nice ellipsis to the description:
	document.querySelectorAll(".projcard-description").forEach(function(box) {
		$clamp(box, {clamp: 6});
	});

	// function display(article)
	// {
	// 		$.ajax({
	// 	  		type: "POST",
	// 	  		url: "/articles/firstsearch",
	// 	  		data:{
	// 	  			type:article
	// 	  		},
	// 	  		success: function(result){
	// 	  			$('#'+article+'Articles').html("");
	// 				     	if(result.length)
	// 				     	{
	// 				     		console.log(result);
	// 				     		for(var i=0;i<result.length;i++)
	// 				     		{
	// 				     			$('#'+article+'Articles').append(
	// 				'<a href="#" style="color: inherit;">\
	// 			      <div class="card" data-card-selectable="true">\
	// 			        <div class="card-front">\
	// 			          <div class="card-content">\
	// 			            <h3>'+result[i].title+'</h3>\
	// 			            <p class="blog">'
	// 			            +result[i].content+				           
	// 			            '</p>\
	// 			          </div>\
	// 			        </div>\
	// 			      </div>\
	// 			  </a>'
	// 				     				)
	// 				     		}
	// 				     	}
	// 				     	else
	// 				     	{
	// 				     		$('#'+article+'Articles').append("<h3>Could not find anything</h3>");
	// 				     	}
	// 	  		}
	// 	  	});
	// }
		  // $('#searchbar-icon').click(function(){
		  //   $('#searchbar-input').animate({width: 'toggle'});
		  //   $("#searchbar-icon").toggle();
		  //   $("#searchbar-cross").toggle(500);
		  // });
		  
		  // $('#searchbar-cross').click(function(){
		  //   $('#searchbar-input').animate({width: 'toggle'});
		  //   $("#searchbar-cross").toggle();
		  //   $("#searchbar-icon").toggle(500);
		  // });
		  // var article="featured";
		  // $('#featuredArticlesbtn').click(function(){
		  // 	article="featured";
		  // 	display(article);
		  // });
		  // $('#yourArticlesbtn').click(function(){
		  // 	article="your";
		  // 	display(article);
		  // });
		  // $('#savedArticlesbtn').click(function(){
		  // 	article="saved";
		  // 	display(article);
		  // });
		 //  $("#searchbar-input").on('keyup', function (e) {
			//     if (e.keyCode == 13) {
			//         var searchquery=$('#searchbar-input').val().split(" ");
			//           $.ajax({
			// 		     type: "POST",
			// 		     url: "/articles/search",
			// 		     data:{
			// 		       searchquery: searchquery,
			// 		       type: article
			// 		     },
			// 		     success: function(result){
			// 		     		$('#'+article+'Articles').html("");
			// 		     	if(result.length)
			// 		     	{
			// 		     		console.log(result);
			// 		     		for(var i=0;i<result.length;i++)
			// 		     		{
			// 		     			$('#'+article+'Articles').append(
			// 		"<a href=# style=color: inherit;>\
			// 	      <div class=card data-card-selectable=true>\
			// 	        <div class=card-front>\
			// 	          <div class=card-content>\
			// 	            <h3>I am a card, and I can be selected</h3>\
			// 	            <p id=blog>\
			// 	            </p>\
			// 	          </div>\
			// 	        </div>\
			// 	      </div>\
			// 	  </a>"
			// 		     				)
			// 		     		}
			// 		     	}
			// 		     	else
			// 		     	{
			// 		     		$('#'+article+'Articles').append("<h3>Could not find anything</h3>");
			// 		     	}
			// 		     }
			// 		  });
			//     }
			// });
		});
