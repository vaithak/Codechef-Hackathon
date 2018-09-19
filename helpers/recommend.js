const request = require('request-promise');
const questions=require('./../models/QuestionsModel');
function random(min,max){
  return min + Math.floor(Math.random() * (max-min));
}

function algo(username,accessToken){
  return Math.floor(Math.random() * 100);
}

function recommendProblem(username,accessToken){
  return new Promise(function(resolve,reject){
    // Algo
    var customRating = algo(username,accessToken);
    var categories = ["school", "easy","medium","hard"];

    var userCategory = categories[Math.floor(customRating/25)];
    var sortBy="successfulSubmissions";
    var sortOrder="desc";
    var limit=100;
    var problemNumber = random(25*Math.floor(customRating/25) , 25*(Math.floor(customRating/25) + 1));
    // Algo end

    // Send request
    var options = {
      method: 'GET',
      uri: 'https://api.codechef.com/problems/' + userCategory + "?limit=" + limit + "&sortBy=" + sortBy + "&sortOrder=" + sortOrder,
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + accessToken
      },
      json: true // Automatically parses the JSON string in the response
    };

    request(options)
      .then(function(result) {
        // console.log(result);
        var problem = result['result']['data']['content'][problemNumber];
        // console.log(problem);
        problem['category']=userCategory;
        resolve(problem);
      })
      .catch(function(err){
        console.log("Request error" + err);
        reject(err);
      });

  });
}

function recommend(user,isHard)
{
  //update questionLevel
  //base case
  var level,type,level2;
  if(isHard)
  {
    level=user['questionLevel']+12;
  }
  else
  {
    level=user['questionLevel']-30;
  }
  if(level<0)
    level=200
  level2=level;
  level/=600;
  level=parseInt(level);
  switch(level)
  {
    case 0:type="school";
    break;
    case 1:type="easy";
    break;
    case 2:type="medium";
    break;
    case 3:type="hard";
    break;
    case 4:type="challenge";
    break;
    case 5:type="extcontest";
    break;
    default:type="school";
    break;
  }
  return new Promise(function(resolve,reject){
    level2=level2/6;
    level2=parseInt(level2);
    level2%=100;
    questions.find({},function(err,docs){
      if(docs.length)
      {
        var problem=docs[0][type][level2];
        problem['category']=type;
        resolve(problem);
      }
      else
      {
        reject("Failed");
      }
    });
  });
}

module.exports.recommendProblem = recommendProblem;
module.exports.recommend=recommend;
