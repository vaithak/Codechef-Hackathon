const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const MailList =require('./models/MailListModel');
const User=require('./models/userModel');
const refreshToken = require('./config/refreshToken2');
const nodemailer = require("nodemailer");
const request = require('request-promise');
const questions = require('./models/QuestionsModel');

const app = express()

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: keys.gmail.user,
        pass: keys.gmail.password
    }
});

mongoose.connect(keys.mongodb.dbURI,{ useNewUrlParser: true }, function() {
    console.log('connected to mongodb');
});

// Sending Mail to Users
setInterval(function(){
	var date= new Date();
	var day=parseInt(date.getDate());
	var month=parseInt(date.getMonth())+1;
	var year=parseInt(date.getFullYear());
	User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){

	MailList.find(function(err,docs){
		if(docs.length)
		{
	    refreshToken.refreshAccessToken(currentUser.refreshToken,keys.codechef.username.toLowerCase()).then(function(accessToken){
		    var options = {
		      method: 'GET',
		      uri: 'https://api.codechef.com/contests?status=future',
		      headers: {
		         'Accept': 'application/json',
		         'Authorization': 'Bearer ' + accessToken
		      },
		      json: true // Automatically parses the JSON string in the response
		    };
	        request(options)
	        .then(function (result) {
	        	var message=[];
	        	var events=result['result']['data']['content']['contestList'];
	        	for(var i=0;i<events.length;i++)
	        	{
	        		var date2=events[i].startDate;
	        		var year2=parseInt(date2.substring(0,4));
	        		var month2=parseInt(date2.substring(5,7));
	        		var day2=parseInt(date2.substring(8,10));
	        		var diff=(year2-year)*365+(month2-month)*30+(day2-day);
	        		console.log(diff);
	        		if(diff<3)
	        		{
	        			message.push({name:events[i].name,start:events[i].startDate,end:events[i].endDate,link:"www.codechef.com/"+events[i].code});
	        		}
	        	}
	        		for(var i=0;i<docs.length;i++)
	        		{
	        			var to=docs[i].Id;
	        			var subject="Contest Reminder";
	        			var text="This is a system generated mail please do not reply.<br>"
	        			for(var j=0;j<message.length;j++)
	        			{
	        				text+="<h3>"+message[j].name+"</h3><br>\
	        				Starts at &nbsp;&nbsp;"+message[j].start+"<br>\
	        				Ends at &nbsp;&nbsp;"+message[j].end+"<br>\
	        				<a href='"+message[j].link+"'>Go to contest</a><br>\
	        				<br>";
	        			}
	        			var mailOptions={
	        				to : to,
	        				subject : subject,
	        				html : text
	    				}
	    				console.log(mailOptions);
	    				smtpTransport.sendMail(mailOptions, function(error, response){
	     				if(error){
	            			console.log(error);
	     				}else{
	            			console.log("Message sent: " + response.message);
	         			}
						});
	        		}
	         })
	    });
		}
	});
	});

},1000*60*60*24);


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

setInterval(function(){
	var school,easy,medium,hard,challenge,extcontest;
	User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){
		refreshToken.refreshAccessToken(currentUser.refreshToken,keys.codechef.username.toLowerCase()).then(function(accessToken){
			var options =createOptions("school",accessToken);
		    request(options)
	        .then(function (result) {
	        	school=result['result']['data']['content'];
				var options2 =createOptions("easy",accessToken);
			    request(options2)
		        .then(function (result2) {
		        	easy=result2['result']['data']['content'];
					var options3 =createOptions("medium",accessToken);
				    request(options3)
			        .then(function (result3) {
			        	medium=result3['result']['data']['content'];
			        		var options4 =createOptions("hard",accessToken);
						    request(options4)
					        .then(function (result4) {
					        	hard=result4['result']['data']['content'];
								var options5 =createOptions("challenge",accessToken);
							    request(options5)
						        .then(function (result5) {
						        	challenge=result5['result']['data']['content'];
									var options6 =createOptions("extcontest",accessToken);
								    request(options6)
							        .then(function (result6) {
							        	extcontest=result6['result']['data']['content'];
							        	questions.remove({},function(){
							        		var Questionvar=new questions({school:school,easy:easy,medium:medium,hard:hard,challenge:challenge,extcontest:extcontest});
							        		Questionvar.save();
							        	});
							        });
						        });
	       					});
			        });
	        	});
	        });
		});
	});
},1000*60*60*48);

const port = process.env.port || 8080;

app.listen(port, function(){
  console.log("App listening on port " + port);
})
