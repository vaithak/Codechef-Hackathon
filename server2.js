const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const MailList =require('./models/MailListModel');
const refreshToken = require('./config/refreshToken');
var nodemailer = require("nodemailer");

const app = express()

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "",
        pass: ""
    }
});
var date= new Date();
day=parseInt(date.getDate());
month=parseInt(date.getMonth())+1;
year=parseInt(date.getFullYear());
while(true)
{
	var message=[];
	var datenow=new Date();
	daynow=parseInt(date.getDate());
	monthnow=parseInt(date.getMonth())+1;
	yearnow=parseInt(date.getFullYear());
	if((daynow!=day)||(monthnow!=month)||(yearnow!=year))
	{
		day=daynow;
		month=monthnow;
		year=yearnow;
		//error line
	    refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){
		    var options = {
		      method: 'GET',
		      uri: 'https://api.codechef.com/contests?status=future',
		      headers: {
		         'Accept': 'application/json',
		         'Authorization': 'Bearer ' + req.user.accessToken
		      },
		      json: true // Automatically parses the JSON string in the response
		    };
	        request(options)
	        .then(function (result) {
	        	var events=result['result']['data']['content']['contestList'];
	        	for(var i=0;i<events.length;i++)
	        	{
	        		var date2=events[i].startDate;
	        		var year2=parseInt(date2.substring(0,4));
	        		var month2=parseInt(date2.substring(5,7));
	        		var day2=parseInt(date2.substring(8,10));
	        		var diff=(year2-year)*365+(month2-month)*30+(day2-day);
	        		if(diff<3)
	        		{
	        			message.push({name:events[i].name,start:events[i].startDate,end:events[i].endDate});
	        		}
	        	}
	        	MailList.find(function(err,docs){
	        		for(var i=0;i<docs.length;i++)
	        		{
	        			var to=docs[i].Id;
	        			var subject="Conntest Reminder";
	        			var text="This is a system generated mail please do not reply.\n"
	        			for(var j=0;j<message.length;j++)
	        			{
	        				text+=message[j].name+"\tstarts at"+message[j].start+"\n";
	        			}
	        			var mailOptions={
	        				to : to,
	        				subject : subject,
	        				text : text
	    				}
	    				console.log(mailOptions);
	    				smtpTransport.sendMail(mailOptions, function(error, response){
	     				if(error){
	            			console.log(error);
	        				res.end("error");
	     				}else{
	            			console.log("Message sent: " + response.message);
	        				res.end("sent");
	         			}
						});
	        		}
	        	});
	         })
	    });
	}
}
const port = process.env.port || 8080;

app.listen(port, function(){
  console.log("App listening on port " + port);
})