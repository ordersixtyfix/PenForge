// fetch.js dashboarddaki counterlar, grafikler ve tabloların db bağlantısını asenkron yapıda sağlar.
// DATABASE ELEMENTLERİMİZ HAZIR OLDUĞU ZAMAN EKLENECEK ..

// Gerekli modülleri dahil ediyoruz
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB bağlantı URL'si
const dbURI = 'mongodb://localhost:27017/your-database-name';

// MongoDB'ye bağlanma
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000)) // Sunucuyu başlat
    .catch((err) => console.log(err));

// MongoDB veritabanı şeması
const reportSchema = new mongoose.Schema({
    date: String,
    status: String
});

// MongoDB veritabanı modeli
const Report = mongoose.model('Report', reportSchema);

// API endpointi: /api/reports
app.get('/api/reports', (req, res) => {
    Report.find()
        .then(result => {
            res.json(result); // Verileri JSON olarak gönder
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error'); // Sunucu hatası
        });
});
