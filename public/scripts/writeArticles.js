$(document).ready(function(){

  var unSaved = true;
  window.onbeforeunload = function() {
    return unSaved ? "If you leave this page you will lose your unsaved changes." : null;
  }

  tinymce.init({
  selector: 'textarea',
  height: 300,
  theme: 'modern',
  plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic sizeselect fontselect fontsizeselect strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | link image',
  image_advtab: true,
  imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
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
      unSaved = false;

      $.ajax({
        type: 'POST',
        url: "/articles/save",
        data:{
          title: title,
          bodyContent: bodyContent,
          visibility: visibility,
          tags: tags
        },
        success: function(result){
          window.location.href = "/articles/"
        }
      });
    }
    return false;
  });

});
