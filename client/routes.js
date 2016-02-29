Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
    this.render("navBar",{
        to: "nav"
    });
    
    this.render("contentWrapper",{
        to: "content"
    });
});

Router.route('/website/:_id', function(){
    this.render("navBar",{
        to: "nav"
    });
    
    this.render("singleSite",{
        to: "content",
        data: function () {
            return Websites.findOne({_id: this.params._id})
        }
    });
});