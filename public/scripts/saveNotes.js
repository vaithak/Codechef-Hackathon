var allNotes;

$('#save').on('click',function(){
  allNotes = [];
  $('.note_cnt').each(function(i, obj) {
    var title = $(obj).children('.title').val();
    var text = $(obj).children('.cnt').val();
    var notesObject = {
      'title': title,
      'text' : text
    };
    if(title.length!=0 || text.length!=0)
    {
      allNotes.push(notesObject);
    }
  });

  if(allNotes.length > 0)
  {
    $.ajax({
       type: "POST",
       data: {
         allNotes:allNotes,
       },
       url: "/notes/save",
       success: function(msg){
         console.log(msg);
       }
    });
  }

});
