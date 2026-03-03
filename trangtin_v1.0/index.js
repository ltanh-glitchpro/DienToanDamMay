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

var uri = 'mongodb+srv://admin:admin123@cluster0.dmubves.mongodb.net/trangtin';
mongoose.connect(uri)
.then(async () => {
  console.log('Kết nối MongoDB thành công');

  console.log('Đã thêm dữ liệu mẫu vào DB');
})
.catch((err) => {
  console.error('Lỗi kết nối MongoDB:', err);
});

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
