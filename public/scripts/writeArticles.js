$(document).ready(function(){

  tinymce.init({
  selector: 'textarea',
  height: 300,
  theme: 'modern',
  plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | link image',
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


  $('#submit').on('click',function(){
    console.log(tinymce.get('text').getContent());
  });

  $('#tags').tagsInput({
     'height': '38px',
     'width' :'100%',
     'defaultText':'Add tags',
     'interactive':true,
     'delimiter': [',',';'],   // Or a string with a single delimiter. Ex: ';'
     'removeWithBackspace' : true,
     'minChars' : 0,
     'placeholderColor' : '#666666'
  });
});
