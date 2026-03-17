var express = require('express'); 
var router = express.Router(); 
var bcrypt = require('bcryptjs'); 
var TaiKhoan = require('../models/taikhoan');
 
// GET: Đăng ký (Hiện thị form)
router.get('/dangky', async (req, res) => { 
    res.render('dangky', {
        title: 'Đăng kí tài khoản'
    });
}); 

// POST: Đăng ký (xử lí khi nhấn nút đăng kí)
router.post('/dangky', async (req, res) => { 
     var salt = bcrypt.genSaltSync(10);
     var data = {
        HoVaTen: req.body.HoVaTen,
        Email: req.body.Email,
        HinhAnh: req.body.HinhAnh,
        TenDangNhap: req.body.TenDangNhap,
        MatKhau: bcrypt.hashSync(req.body.MatKhau, salt)
     };
     await TaiKhoan.create(data);
     req.session.success = 'Đã đăng kí tài khoản thành công.';
     res.redirect('/success');
}); 
 
// GET: Đăng nhập (Hiện thị form)
router.get('/dangnhap', async (req, res) => { 
     res.render('dangnhap' ,{
        title: 'Đăng nhập'
     });
}); 
 
// POST: Đăng nhập (xử lí khi nhấn nút đăng nhập)
router.post('/dangnhap', async (req, res) => { 
     if(req.session.MaNguoiDung) {
     }
     else {
        var taikhoan = await TaiKhoan. findOne ({ TenDangNhap: req.body. TenDangNhap } ) .exec () ;
        if (taikhoan) {
            if(bcrypt.compareSync(req.body.MatKhau, taikhoan.MatKhau) ) {
                if(taikhoan.KichHoat == 0) {
                    req.session. error = 'Nguời dùng đa bị khoa tai khoản.';
                    res.redirect ('/error');
                } else {
                    // Đăng ký session
                    req.session. MaNguoiDung = taikhoan._id;
                    req.session. HoVaTen = taikhoan. HoVaTen;
                    req.session. QuyenHan = taikhoan. QuyenHan;

                    res.redirect ('/');
                }
            } else {
                req.session.error = 'Mật khẩu không đúng.';
                res.redirect ('/error');
            }
        } else {
            req.session. error = 'Tên đăng nhập không tồn tại.';
            res.redirect ('/error');
        }
     }
}); 
 
// GET: Đăng xuất (Xử lí đăng xuất)
router.get('/dangxuat', async (req, res) => { 
     if(req.session.MaNguoiDung){
        // Xóa session
        delete req.session.MaNguoiDung;
        delete req.session.HoVaTen;
        delete req.session.QuyenHan;

        res.redirect('/');
     }
     else{
        req.session.error = 'Người dùng chưa đăng nhập';
        res.redirect('/error');
     }
}); 
 
// exports mới dùng được
module.exports = router;
