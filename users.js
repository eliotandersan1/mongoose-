var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

var newUser = new User({
    name: 'Simon Holmes',
    email: 'simon@theholmesoffice.com',
    lastLogin : Date.now()
});
newUser.save( function( err,user){
    if(!err){
        console.log('saved user name'+user.name);
        console.log('id of the user'+user._id);
    }
});
// GET user creation form
exports.create = function(req, res){
    res.render('user-form', {
        title: 'Create user',
        buttonText: "Join!"
    });
};
// POST new user creation form
exports.doCreate = function(req, res){
  User.findOne({email:req.body.Email},function (err,exdata) {
    if(!exdata){
        User.create({
            name: req.body.FullName,
            email: req.body.Email,
            modifiedOn : Date.now(),
            lastLogin : Date.now()
        },function (err,data) {
            if(!err){
                console.log("User created and saved: " + data);

                req.session.user = { "name" : data.name, "email": data.email, "_id":
                data._id };
                //console.log("User :"+req.session.user.name);
                req.session.loggedIn = true;
                //res.redirect( '/' );
                res.render('index',{head:data.name});

            }else{
              console.log(err);
            }
        })
    }else{
        console.log("User created and saved: " + exdata);

        req.session.user = { "name" : exdata.name, "email": exdata.email, "_id":
        exdata._id };
        //console.log("User :"+req.session.user.name);
        req.session.loggedIn = true;
       // res.redirect( '/');
        res.render('index',{head:exdata.name});

    }

  });
}

//GET logged in user page
exports.index = function(req,res) {
    if (req.session.loggedIn === true) {
        res.render('user-page', {
            title: req.session.user.name,
            name: req.session.user.name,
            email: req.session.user.email,
            userID:req.session.user._id
        })
    }else
        {
            res.redirect('/login');
        }

      }