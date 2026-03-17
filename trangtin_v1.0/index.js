var express = require('express');
var app = express();
var mongoose = require('mongoose');
const multer = require('multer');
app.use(express.static('public'));


//Bổ sung các router
var indexRouter = require('./routers/index'); 
var chudeRouter = require('./routers/chude'); 
var taikhoanRouter = require('./routers/taikhoan'); 
var baivietRouter = require('./routers/baiviet'); 

var uri = 'mongodb://admin:admin123@ac-exoafeo-shard-00-02.dmubves.mongodb.net:27017/trangtin?ssl=true&authSource=admin';
mongoose.connect(uri)
 .then(() => console.log('Đã kết nối thành công tới MongoDB.'))
 .catch(err => console.log(err))

// sử dụng view engine EJS và thư mục views
app.set('views', './views'); 
app.set('view engine', 'ejs'); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// sử dụng các router
app.use('/', indexRouter); 
app.use('/chude', chudeRouter); 
app.use('/taikhoan', taikhoanRouter); 
app.use('/baiviet', baivietRouter); 

app.get('/', (req, res) => {
  res.render('index', { 
        title: 'Trang chủ' 
    });
});

app.listen(3000, () => {
  console.log('Ứng dụng đang chạy tại http://localhost:3000');
});