const request = require('request-promise');

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

module.exports.recommendProblem = recommendProblem;
