var express = require('express'); 
var multer = require('multer');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var path = require('path');
var router = express.Router(); 
var TaiKhoan = require('../models/taikhoan'); 

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        // Lấy userID từ params (cho route sửa) hoặc tạo mới (cho route thêm)
        var userId = req.params.id || Date.now();
        var ext = path.extname(file.originalname);
        cb(null, userId + ext);
    }
});

const upload = multer({
    storage: storage
});
 
// GET: Danh sách tài khoản 
router.get('/', async (req, res) => { 
     var tk = await TaiKhoan.find();
    res.render ('taikhoan', {
        title: 'Danh sách tài khoản',
        taikhoan: tk
});
}); 
 
// GET: Thêm tài khoản 
router.get('/them', async (req, res) => { 
     res.render('taikhoan_them', {
        title: 'Thêm tài khoản'
    });
}); 
 
// POST: Thêm tài khoản 
router.post('/them', upload.single('HinhAnh'), async (req, res) => {

    var salt = bcrypt.genSaltSync(10);   

    var data = {
        HoVaTen: req.body.HoVaTen,
        Email: req.body.Email,
        HinhAnh: null,  // Tạm thời để null
        TenDangNhap: req.body.TenDangNhap,
        MatKhau: bcrypt.hashSync(req.body.MatKhau, salt)
    };

    var taiKhoan = await TaiKhoan.create(data);
    
    // Nếu có upload ảnh, rename file với userID
    if (req.file) {
        var userId = taiKhoan._id.toString();
        var ext = path.extname(req.file.filename);
        var newFileName = userId + ext;
        var oldPath = path.join("public/uploads", req.file.filename);
        var newPath = path.join("public/uploads", newFileName);
        
        fs.renameSync(oldPath, newPath);
        
        // Cập nhật tên ảnh trong DB
        taiKhoan.HinhAnh = newFileName;
        await taiKhoan.save();
    }
    
    res.redirect('/taikhoan');
}); 
 
// GET: Sửa tài khoản 
router.get('/sua/:id', async (req, res) => { 
     var id = req.params.id;
     var tk = await TaiKhoan.findById(id);
        res.render('taikhoan_sua', {
            title: 'Sửa tài khoản',
            taikhoan: tk
        });
}); 
 
// POST: Sửa tài khoản 
router.post('/sua/:id', upload.single('HinhAnh'), async (req, res) => {
    var id = req.params.id;
    var tk = await TaiKhoan.findById(id);

    var data = {
        HoVaTen: req.body.HoVaTen,
        Email: req.body.Email,
        TenDangNhap: req.body.TenDangNhap,
        QuyenHan: req.body.QuyenHan,
        KichHoat: req.body.KichHoat,
    };

    // Nếu có file mới thì cập nhật ảnh
    if (req.file) {
        data.HinhAnh = req.file.filename;
    } else {
        // Giữ ảnh cũ nếu không upload ảnh mới
        data.HinhAnh = tk.HinhAnh;
    }

    if (req.body.MatKhau && req.body.MatKhau.trim() !== "") {
        var salt = bcrypt.genSaltSync(10);
        data.MatKhau = bcrypt.hashSync(req.body.MatKhau, salt);
    }

    await TaiKhoan.findByIdAndUpdate(id, data);
    res.redirect('/taikhoan');
});
 
// GET: Xóa tài khoản 
router.get('/xoa/:id', async (req, res) => { 
     var id = req.params.id;
        await TaiKhoan.findByIdAndDelete(id);
        res.redirect('/taikhoan');
}); 
 
module.exports = router;