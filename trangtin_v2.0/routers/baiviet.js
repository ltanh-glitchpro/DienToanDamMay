var express = require('express');
var router = express.Router();
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');

// GET: Danh sách bài viết
router.get('/', async (req, res) => {
    var bv = await BaiViet.find()
    .populate('ChuDe')
    .populate('TaiKhoan').exec();
    res.render('baiviet', {
        title: 'Danh sách bài viết',
        baiviet: bv
    });
});

// GET: Đăng bài viết
router.get('/them', async (req, res) => {
	var cd = await ChuDe.find();
    res.render('baiviet_them', {
        title: 'Đăng bài viết',
        chude: cd
    });
});

// POST: Đăng bài viết
router.post('/them', async (req, res) => {
    if (req.session.MaNguoiDung) {
        var data = {
            ChuDe: req.body.MaChuDe,
            NoiDung: req.body.NoiDung,
            TaiKhoan: req.session.MaNguoiDung,
            TieuDe: req.body.TieuDe,
            TomTat: req.body.TomTat
        };
        await BaiViet.create(data);
        req.session.success = 'Đã đăng bài viết thành công và đang chờ kiểm duyệt.';
        res.redirect('/success');
    }
    else{
        res.redirect('/dangnhap');
    }
});

// GET: Sửa bài viết
router.get('/sua/:id', async (req, res) => {
	var id = req.params.id;
    var bv = await BaiViet.findById(id);
    var cd = await ChuDe.find();
    res.render('baiviet_sua', {
        title: 'Sửa bài viết',
        baiviet: bv,
        chude: cd
    });
});

// POST: Sửa bài viết
router.post('/sua/:id', async (req, res) => {
	var id = req.params.id;
    var data = {
        ChuDe: req.body.MaChuDe,
        NoiDung: req.body.NoiDung,
        TieuDe: req.body.TieuDe,
        TomTat: req.body.TomTat
    };
    await BaiViet.findByIdAndUpdate(id, data);
    req.session.success = 'Đã cập nhật bài viết thành công đang chờ kiểm duyệt.';
    res.redirect('/success');
});

// GET: Xóa bài viết
router.get('/xoa/:id', async (req, res) => {
	var id = req.params.id;
    await BaiViet.findByIdAndDelete(id);

    // trở lại trang trước
    res.redirect(req.get('Referer') || '/');
});

// GET: Duyệt bài viết
router.get('/duyet/:id', async (req, res) => {
	var id = req.params.id;
    var bv = await BaiViet.findById(id);
    await BaiViet.findByIdAndUpdate(id, { 'KiemDuyet': 1 - bv.KiemDuyet });

    // trở lại trang trước
    res.redirect(req.get('Referer') || '/');
});

// GET: Danh sách bài viết của tôi
router.get('/cuatoi', async (req, res) => {
    if (req.session.MaNguoiDung) {
            // mã người dùng hiện tại
            var id = req.session.MaNguoiDung;
            var bv = await BaiViet.find({ 'TaiKhoan': id })
            .populate('ChuDe')
            .populate('TaiKhoan').exec();
            res.render('baiviet_cuatoi', {
                title: 'Danh sách bài viết của tôi',
                baiviet: bv
            });
    } else {
        res.redirect('/dangnhap');
    }
});

module.exports = router;