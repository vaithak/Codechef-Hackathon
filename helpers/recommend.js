const request = require('request-promise');
const questions=require('./../models/QuestionsModel');
const User=require('./../models/userModel');
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

function getLevel(user,isHard)
{
  var level;
  if(isHard)
  {
    level=user['questionLevel']+14;
  }
  else
  {
    level=user['questionLevel']-30;
  }
  if(level<0)
  {
    level=0;
  }
  else if(level>=3600)
  {
    level=3599;
  }
  return level;
}

function getType(level){
  var type;
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
  return type;
}

function recommend(user,isHard)
{
  //base case
  //setupquestionlevel in begining;
  var level,type;
  level=getLevel(user,isHard);
  User.findOneAndUpdate({codechefId:user['codechefId']},{$set:{'questionLevel':level}},function(err){
    console.log("Success");
  });
  level=(level+user['rating']['allContest'])/2;
  type=getType(level,user);

  return new Promise(function(resolve,reject){
    level=level/6;
    level=parseInt(level);
    level%=100;
    questions.find({},function(err,docs){
      if(docs.length)
      {
        var problem=docs[0][type][level];
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
