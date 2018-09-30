const request   = require('request-promise');
const Questions = require('./../models/QuestionsModel');
const User      = require('./../models/userModel');

// Generates a random number from [min,max]
function random(min,max){
  return min + Math.floor(Math.random() * (max-min));
}

// For getting the incremental value for practise rating according to level and problem solved
function increasePractiseScore(problemCategory, practiseLevel){

  var incrementScore = [
    {
      'school'    : 50,
      'easy'      : 100,
      'medium'    : 200,
      'hard'      : 300,
      'challenge' : 500
    },
    {
      'school'    : 20,
      'easy'      : 80,
      'medium'    : 150,
      'hard'      : 250,
      'challenge' : 400
    },
    {
      'school'    : 0,
      'easy'      : 50,
      'medium'    : 100,
      'hard'      : 200,
      'challenge' : 300
    },
    {
      'school'    : -50,
      'easy'      : 0,
      'medium'    : 50,
      'hard'      : 150,
      'challenge' : 200
    },
    {
      'school'    : -100,
      'easy'      : -50,
      'medium'    : 10,
      'hard'      : 100,
      'challenge' : 150
    },
    {
      'school'    : -200,
      'easy'      : -100,
      'medium'    : -50,
      'hard'      : 10,
      'challenge' : 50
    }
  ];

  var levelIndex = Math.min(Math.floor(practiseLevel/600) , 5);
  return incrementScore[levelIndex][problemCategory];
}

// Function to return problem from given questionLevel
function getProblemFromQuestionLevel(questionLevel){
  return new Promise(function(resolve, reject){

    if(questionLevel<100){
      Questions.find().then(function(questionData){
        var problem = questionData[0]['school'][questionLevel];
        problem['category'] = 'school';
        resolve(problem);
      });
    }
    else if(questionLevel<200){
      Questions.find().then(function(questionData){
        var problem = questionData[0]['easy'][questionLevel-100];
        problem['category'] = 'easy';
        resolve(problem);
      });
    }
    else if(questionLevel<300){
      Questions.find().then(function(questionData){
        var problem = questionData[0]['medium'][questionLevel-200];
        problem['category'] = 'medium';
        resolve(problem);
      });
    }
    else if(questionLevel<400){
      Questions.find().then(function(questionData){
        var problem = questionData[0]['hard'][random(0,100)];
        problem['category'] = 'hard';
        resolve(problem);
      });
    }
    else{
      Questions.find().then(function(questionData){
        var problem = questionData[0]['challenge'][random(0,100)];
        problem['category'] = 'challenge';
        resolve(problem);
      });
    }

  });
}


// For displaying problem when page is loaded
function reloadProblem(currentUser, accessToken){
  return new Promise(function(resolve,reject){

    // First time recommending a problem
    if(Object.keys(currentUser['lastRecommended']).length === 0){
      recommendDifferentProblem(currentUser,accessToken,"firstTime").then(function(problem){
        resolve(problem);
      });
    }
    // Returning the previously recommended problem
    else{
      resolve(currentUser['lastRecommended']);
    }
  });
}

// Recommending an easier, harder or problem for firstTime
function recommendDifferentProblem(currentUser,accessToken,generateType)
{
  return new Promise(function(resolve, reject){
    if(generateType === "firstTime"){
      var questionLevel = 45*(Math.floor(currentUser['rating']['allContest']/500) + 1);

      getProblemFromQuestionLevel(questionLevel).then(function(problem){
        User.findOneAndUpdate({codechefId: currentUser['codechefId']}, {questionLevel: questionLevel, lastRecommended: problem}).then(function(currentUser){
          resolve(problem);
        });
      })
      .catch(function(err){
        reject(err);
      });
    }
    // Recommending an easier problem
    else if(generateType === "easier"){
      var questionLevel = Math.max(0, currentUser['questionLevel'] - 3);
      // Checking if person has solved the last recommended problem

      var options = {
         method: 'GET',
         uri: 'https://api.codechef.com/submissions/?result=AC&username=' + currentUser['codechefId'] + '&problemCode=' + currentUser['lastRecommended']['problemCode'],
         headers: {
             'Accept': 'application/json',
             'Authorization': 'Bearer ' + accessToken
         },
         json: true
      };

     request(options)
     .then(function (result) {
       // Person hast solved the last problem
       if(result['result']['data']['content'])
       {
        var practiseLength=currentUser['practiseLevel'].length;
        if(practiseLength>=20)
        {
          currentUser['practiseLevel'].shift();
          practiseLength--;
        }
          currentUser['practiseLevel'].push(currentUser['practiseLevel'][practiseLength-1] + increasePractiseScore(currentUser['lastRecommended']['category'], currentUser['practiseLevel'][practiseLength-1]));
       }
       getProblemFromQuestionLevel(questionLevel).then(function(problem){
         User.findOneAndUpdate({codechefId: currentUser['codechefId']}, {questionLevel: questionLevel, lastRecommended: problem, practiseLevel: currentUser['practiseLevel']}).then(function(currentUser){
           resolve(problem);
         });
       });
     })
     .catch(function(err){
       reject(err);
     });

    }
    // Recommend a harder problem
    else{
      var questionLevel = Math.min(500, currentUser['questionLevel'] + 17);

      // Checking if person has solved the last recommended problem
      var options = {
         method: 'GET',
         uri: 'https://api.codechef.com/submissions/?result=AC&username=' + currentUser['codechefId'] + '&problemCode=' + currentUser['lastRecommended']['problemCode'],
         headers: {
             'Accept': 'application/json',
             'Authorization': 'Bearer ' + accessToken
         },
         json: true
      };

     request(options)
     .then(function (result) {
       // Person hast solved the last problem
       if(result['result']['data']['content'])
       {
        var practiseLength=currentUser['practiseLevel'].length;
        if(practiseLength>=20)
        {
          currentUser['practiseLevel'].shift();
          practiseLength--;
        }
          currentUser['practiseLevel'].push(currentUser['practiseLevel'][practiseLength-1]  + increasePractiseScore(currentUser['lastRecommended']['category'], currentUser['practiseLevel'][practiseLength-1]));
       }
       getProblemFromQuestionLevel(questionLevel).then(function(problem){
         User.findOneAndUpdate({codechefId: currentUser['codechefId']}, {questionLevel: questionLevel, lastRecommended: problem, practiseLevel: currentUser['practiseLevel']}).then(function(currentUser){
           resolve(problem);
         });
       });
     })
     .catch(function(err){
       reject(err);
     });
    }
  });
}

module.exports.reloadProblem             = reloadProblem;
module.exports.recommendDifferentProblem = recommendDifferentProblem;
