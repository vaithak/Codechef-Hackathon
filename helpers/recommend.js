function algo(username){
  return Math.floor(Math.random() * 101);
}

function recommendProblem(username,accessToken){
  return new Promise(function(resolve,reject){
    var problem = {};
    // Algo


    // Algo end

    // For testing
    problem['category'] = "Easy";
    problem['problemCode'] = "HACKFU" ;
    problem['problemName'] = "Hack Fulu";
    problem['successfulSubmissions'] = 9;
    problem['accuracy'] = 19.80392186275;

    resolve(problem);
  });
}

module.exports.recommendProblem = recommendProblem;
