$(document).ready(function(){

  tinymce.init({
  selector: 'textarea',
  height: 300,
  theme: 'modern',
  plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic sizeselect fontselect fontsizeselect strikethrough underline forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | link image',
  image_advtab: true,
  templates: [
    { title: 'Test template 1', content: 'Test 1' },
    { title: 'Test template 2', content: 'Test 2' }
  ],
  content_css: [
    'https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
    'https://www.tinymce.com/css/codepen.min.css'
  ]
 });

  $('#tags').tagsInput({
     'height': '38px',
     'width' :'100%',
     'defaultText':'Add tags',
     'interactive':true,
     'delimiter': [','],   // Or a string with a single delimiter. Ex: ';'
     'removeWithBackspace' : true,
     'minChars' : 0,
     'placeholderColor' : '#666666'
  });

  $('.articleForm').submit(function(){
    var title = $('input[name=articleTitle]').val();
    if(title.length == 0)
      return false;
    else{
      var bodyContent = tinymce.get('text').getContent();
      var visibility = $('.visibility').val();
      var tags = ($('#tags').val()).split(',');
      console.log("fuck you")
      $.ajax({
        type: 'POST',
        url: "/articles/edit",
        data:{
          title: title,
          content: bodyContent,
          visibility: visibility,
          tags: tags,
          id: id
        },
        success: function(result){
          window.location.href = "/articles/"
        }
      });
    }
    return false;
  });

});
