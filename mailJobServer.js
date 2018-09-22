const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const MailList =require('./models/MailListModel');
const User=require('./models/userModel');
const refreshToken = require('./config/refreshToken2');
const nodemailer = require("nodemailer");
const request = require('request-promise');
const CronJob = require('cron').CronJob;

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
    job.start();
});

// Sending Mail to Users
const job = new CronJob('30 0 0 * * *', function(myUserRefreshToken) {
  var date= new Date();
	var day=parseInt(date.getDate());
	var month=parseInt(date.getMonth())+1;
	var year=parseInt(date.getFullYear());
	User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){

	MailList.find(function(err,docs){
		if(docs.length)
		{
	    refreshToken.refreshAccessToken(currentUser['refreshToken'],keys.codechef.username.toLowerCase()).then(function(accessToken){

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
      		// console.log(diff);
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
  				// console.log(mailOptions);
  				smtpTransport.sendMail(mailOptions, function(error, response){
     				if(error){
          		console.log(error);
     				}
            else{
            	console.log("Message sent: " + response.message);
         		}
				  });
      	}

       });
      })
      .catch(function(err){
        console.log(err);
      });
		}
	});
});
});
