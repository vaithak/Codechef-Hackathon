const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const MailList =require('./models/MailListModel');
const User=require('./models/userModel');
const refreshToken = require('./config/refreshToken');
var nodemailer = require("nodemailer");
const request = require('request-promise');

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

setInterval(function(){
	User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){
		if(currentUser)
		{
			refreshToken.refreshAccessToken(currentUser.refreshToken,keys.codechef.username.toLowerCase() ,"" ,"").then(function(accessToken){
			});
		}
		else
		{
			console.log("Found Nothing");
		}
	});	
},1000*60*5*60);
setInterval(function(){
	var date= new Date();
	var day=parseInt(date.getDate());
	var month=parseInt(date.getMonth())+1;
	var year=parseInt(date.getFullYear());
	console.log("in1");
	User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){

	MailList.find(function(err,docs){
		if(docs.length)
		{
			console.log("in2");
	    refreshToken.refreshAccessToken(currentUser.refreshToken,keys.codechef.username.toLowerCase() ,"" ,"").then(function(accessToken){
		    console.log("in4");
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
	        	console.log("in3");
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
	        		// if(diff<5)
	        		{
	        			message.push({name:events[i].name,start:events[i].startDate,end:events[i].endDate});
	        		}
	        	}
	        		for(var i=0;i<docs.length;i++)
	        		{
	        			var to=docs[i].Id;
	        			var subject="Contest Reminder";
	        			var text="This is a system generated mail please do not reply.<br>"
	        			for(var j=0;j<message.length;j++)
	        			{
	        				text+=message[j].name+"  starts at   "+message[j].start+"<br>";
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
const port = process.env.port || 8080;

app.listen(port, function(){
  console.log("App listening on port " + port);
})