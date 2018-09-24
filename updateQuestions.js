const mongoose = require('mongoose');
const keys = require('./config/keys');
const User=require('./models/userModel');
const refreshToken = require('./config/refreshToken2');
const request = require('request-promise');
const Questions = require('./models/QuestionsModel');
const CronJob = require('cron').CronJob;

mongoose.connect(keys.mongodb.dbURI,{ useNewUrlParser: true }, function() {
    console.log('connected to mongodb');
    job.start();
});

// Updating Question Database
function createOptions(type,accessToken)
{
	var options	={
		      method: 'GET',
		      uri: 'https://api.codechef.com/problems/'+type+'?limit=100&sortOrder=desc',
		      headers: {
		         'Accept': 'application/json',
		         'Authorization': 'Bearer ' + accessToken
		      },
		      json: true // Automatically parses the JSON string in the response
		    };
	return options;
}


const job = new CronJob('0 0 1 */2 * *', function() {
  var school,easy,medium,hard,challenge;
	User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){
		refreshToken.refreshAccessToken(currentUser['refreshToken'],keys.codechef.username.toLowerCase()).then(function(accessToken){
			var options =createOptions("school",accessToken);
		    request(options)
	      .then(function (result) {
	       school=result['result']['data']['content'];

			    var options2 = createOptions("easy",accessToken);
		      request(options2)
	        .then(function (result2) {
	        easy=result2['result']['data']['content'];

				  var options3 = createOptions("medium",accessToken);
			    request(options3)
	        .then(function (result3) {
        	medium=result3['result']['data']['content'];

          var options4 = createOptions("hard",accessToken);
			    request(options4)
	        .then(function (result4) {
        	hard=result4['result']['data']['content'];

          var options5 = createOptions("challenge",accessToken);
			    request(options5)
	        .then(function (result5) {
        	challenge=result5['result']['data']['content'];

	        Questions.remove({},function(){
  	        var QuestionVar=new Questions({school:school,easy:easy,medium:medium,hard:hard,challenge:challenge});
  					QuestionVar.save();
            console.log("Updated");
					});
				});
	     });
 			});
	   });
    });
	 });
 })
 .catch(function(err){
   console.log(err);
 });

});
