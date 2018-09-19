$(document).ready(function(){

  $('.submissions').on('click', function(){
    $.ajax({
       type: "POST",
       url: "/practise/submissions",
       success: function(result){

         $('.tableHead').empty();
         var head = " <tr>\
              <th>Id</th>\
              <th>Date</th>\
              <th>Language</th>\
              <th>ProblemCode</th>\
              <th>Result</th>\
              <th>Time</th>\
          </tr>";

        $('.tableHead').append(head);

        $('.tableBody').empty();
         for(var i=0;i<result.length;i++)
         {
           var row = "<tr>\
             <td>" + result[i]['id'] + "</td>\
             <td>" + result[i]['date'] + "</td>\
             <td>" + result[i]['language'] + "</td>\
             <td><a href='https://www.codechef.com/problems/" + result[i]['problemCode'] +"' target='_blank'>" + result[i]['problemCode'] + "</a></td>\
             <td>" + result[i]['result'] + "</td>\
             <td>" + result[i]['time'] + "</td>\
             </a>\
           </tr>";
           $('.tableBody').append(row);
         }

         $('.preloader-background').fadeOut('slow');
         $('.preloader-wrapper').fadeOut();
       }

    });
  });

  $('.navigationIcon').on('click',function(){
    if($('.data').css('display') == "none")
    {
      $('.data').css('display','block');
      $('.navigationIcon').html("arrow_drop_up");
    }
    else
    {
      $('.data').css('display','none');
      $('.navigationIcon').html("arrow_drop_down_circle");
    }
  });


  $('.Easier').on('click', function(){
    recommend("easy");
  });
  $('.Harder').on('click', function(){
    recommend("hard");
  });
  
  function recommend(type){
    $('.question').css("display","none");
    $('.loading').css("display","block");
    $.ajax({
      type: "POST",
      url: "/practise/"+type,
      // data: {
      //   difficulty:type
      // },
      success: function(result){
      console.log(result);
      $('.questionName > h3').html(result['problemName']);
      $('.category').html(result['category']);
      $('.problemCode').html(result['problemCode']);
      $('.submissionDetails').html(result['successfulSubmissions']);
      $('.accuracyDetail').html(result['accuracy']);
      $('.link a').attr("href", "https://www.codechef.com/problems/" + result['problemCode']);
      $('.data').html(result['data']);
      $('.question').css("display","block");
      $('.loading').css("display","none");
      // problemData = result['data'];
      }
    });

  }
});

