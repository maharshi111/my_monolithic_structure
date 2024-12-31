const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash= require('connect-flash');
const  mongoose  = require('mongoose');
const superAdminRoutes =  require('./routes/SuperAdmin');
const orgAdminRoutes = require('./routes/OrgAdmin');
const errorController = require('./controller/errorController');
const errorAuth = require('./middleware/error-auth');
const app = express();
//app.use(session({secret:'my secret'}));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use('/superAdmin',superAdminRoutes);
app.use('/orgAdmin',orgAdminRoutes);
app.use(errorAuth,errorController.get404);

mongoose.connect('mongodb://localhost:27017/OrgManagement')
        .then(()=>{
            app.listen(8080,()=>{ console.log('port 8080 connected')})
        })
        .catch((err)=>console.log(err));