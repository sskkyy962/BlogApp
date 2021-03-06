var express =   require("express"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
body_parser =   require("body-parser"),
mongoose =      require("mongoose"),
app =           express();

//app config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose/model/config
var BlogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default: Date.now}
});

var Blog =  mongoose.model("Blog", BlogSchema);

//RESTful Routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    //retrieve all the data from database
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log("ERROR");
        }
        else{
            res.render("index", {blogs:blogs});
        }
    });
    
});
//New Route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
             //then redirect to index
            res.redirect("/blogs");
        }
    });
   
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog:foundBlog});
        }
    });
});
//EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });

});
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
     req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER STARTED");
});

