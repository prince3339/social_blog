// Add new field (password field) to signup form
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});


/////
// template helpers 
/////

// helper function that returns all available websites
Template.website_list.helpers({
    websites:function(){
        return Websites.find({}, {sort : {upVote : -1}});
    }
});

Template.comments.helpers({
    Comments : function(){
        return Comments.find({site_id : Router.current().params._id});
    }
});
/////
// template events 
/////

Template.website_item.events({
    "click .js-upvote":function(event){
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Up voting website with id "+website_id);
        // put the code in here to add a vote to a website!
        var website = Websites.findOne({_id: website_id});
        var uVote = website.upVote;
        
        if(Meteor.user()){
            Websites.update({_id: website_id}, {$set: {upVote: uVote + 1}});
        }else{
            alert("Please login to vote");
        }
        
        return false;// prevent the button from reloading the page
    }, 
    "click .js-downvote":function(event){

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Down voting website with id "+website_id);
        
        var website = Websites.findOne({_id: website_id});
        var dVote = website.downVote;
        // put the code in here to remove a vote from a website!
        if(Meteor.user()){
            Websites.update({_id: website_id}, {$set: {downVote: dVote + 1}});
        }else{
            alert("Please login to vote");
        }
        console.log(dVote);

        return false;// prevent the button from reloading the page
    }
});

Meteor.methods({
    getWebsiteData: function (url) {
        this.unblock();
        return Meteor.http.call("GET", url, {"npmRequestOptions" : {"gzip" : true}});
    }
});


Template.website_form.events({
    "click .js-toggle-website-form":function(event){
        $("#website_form").toggle('slow');
    }, 
    
    
    
    "submit .js-save-website-form":function(event){

        // here is an example of how to get the url out of the form:
        var url = event.target.url.value;
        console.log("The url they entered is: "+url);

        //  put your website saving code in here!    
     /*   Meteor.call("getWebsiteData", url, function(error, results) {

            // Dump the markup into a dummy element for jQuery manipulation
            var el = $('');
            el.html(results.content);

            // Get the meta data
            var title = $('title', el).text();
            var description = $('meta[name="description"]', el).attr('content');

            // Add the new website in the Websites collection
            Websites.insert({
                title: title, 
                url: url, 
                description: description, 
                createdOn:new Date(),
                upVote: 0,
                downVote: 0,
                date: new Date(),
                })
        }); */
    
        return false; // stop the form submit from reloading the page
    },
    
    "click #spread": function(e){
        var async = require('async');

        var GoogleSpreadsheet = require("../lib/index.js");
        var doc = new GoogleSpreadsheet('1saRApLme-qgAH0nyfg2mqPcm980nzKDg5kES0tS90rg');

        // doc.getInfo(function(err, info){
        //   if (err) return console.log(err);
        //   console.log(info);
        // });
        // return;

        var sheet;

        async.waterfall([
          function connect(step){
            doc.useServiceAccountAuth(require('./test/test_creds'), step);
          },
          function info(step){
            doc.getInfo(step);
          },
          // function addSheet(info, step) {
            // console.log(info);
            // doc.addWorksheet({title: 'Cell Feed'}, step);
          // },

          // function cells(info, step) {
          //   console.log(info);
          //   doc.getCells(2, {}, step);
          // },
          // function updateCells(cells, step){
          //   console.log(cells);
          //   cells[0].value = 1000
          //   cells[2].value = 5000
          //   cells[1].inputValue = '=A3'

          //   // cells[0].setValueAndSave(500, step);
          //   // cells[2].setValue(800);
          //   doc.bulkUpdateCells(2, cells, step);
          // }

          // function rows(info, step) {
          //   doc.getRows(1, step);
          // },
          // function update(rows, step) {
          //   rows[1].test = 'blueberries 44';
          //   rows[1].save(step)
          // }

          function cells(info, step) {
            doc.getCells(1, {
              'min-row': 1,
              'max-row': 3,
              'min-col': 1,
              'max-col': 2,
              'return-empty': true
            }, step)
          },
          function update(cells, step) {
            console.log(cells);
            cells[3].setValue('moo', step);
          }

        ], function(err, result){
          if (err) {
            console.log(err)
          }
          console.log('DONE');
          process.exit(0);
        });


    }
    
});


Template.singleSite.events({
    "click #comment_btn" : function (e){
        e.preventDefault();
    
        if(Meteor.user()){
            var site_id = this._id;
            var userName = Meteor.user().username;  //take username
            
            var comment = document.getElementById('comment_box').value; //take comment from the comment box
            
            /*
            Websites.update({_id: site_id}, {$set : {
                comments : [{
                    comment : comment,
                    user : userName
            }]}});
            */
            
            Comments.insert({
                site_id : Router.current().params._id, // get id from the current url
                comment : comment,
                user : userName,
                time : new Date()
            });
            
            var tp = Router.current().params._id;
            console.log("test:" + tp);
        }else{
            alert("Please login to comment.");
        }
        
        return false;

    }
});

