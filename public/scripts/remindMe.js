$('#bell').on('click',function(){
	console.log("in bell");
	$.ajax({
		type: "POST",
		data: {
			do:true
		},
		url: "/contests/remind",
		success: function(msg){
			console.log(msg);
			if(msg == true)
			{
				$('#bell > i').css('color','blue');
			}
			else {
				$('#bell > i').css('color',"#ddd");
			}
		}
	});
})
