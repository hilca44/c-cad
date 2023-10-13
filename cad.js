'use strict'
global.fu = require("../mod/fu")
global.vvv = require('../mod/reed')
global.cal = require("../mod/cadcal")
fu.load()

var pp = "public/cad/"

var sess = {
    'rr': "first value",
    'ro': "",
    'rr1': "",
    'rr2': "",
    m2: 9,
    'lastinsertid': -2,
    'aid': 0,
    'oid': 10,
    rowsadr: [],
    ords: [{}],
    men: "",
    hmen: "",
    'sw': "",
    'ii': {},
    'filter': "",
    url: [],
    cmdhis: []
}
class Ses {
    constructor() {
        this.aid = -9
        this.oid = 9
        this.cid = -9
        this.id = 2
        this.t = 'ord'
        this.cmd = 'xxx'
        this.fil
        this.filter = ""
        this.sw = ""
        this.db = "fakt3curr.db"
    }
}
var se = new Ses
// fu.getse(db)
sess.men = fu.doo


var ppp = {
    ox: 0,// offset x ,
    oy: 0,
    oz: 0,
    ls: 19,  // seite li s 0: aus ,
    r: 19, // seite re s 0: aus ,
    bos: 16, // boden s 0: aus ,
    des: 19, // deckel s ,
    fs: 19, // fachbo ,
    vs: 16, // tuer s ,
    hs: 16,// rueckwand ,
    v: [], // 0-2 od [[start ende][] ...] ,
    rwy: 20, // Innenseite rw von hinten ,
    kbo: [],
    fb: 1,// 0-9 od [] ,
    fbaby: 10,
    n: 0,
    fuge: [2, 2, 2, 2], // Halbe Tuerfuge ,
    ms: 0,
    y: 10,
    y1: 20,
    zt: -10,
    g: 1  // gap 
}


app.get('/updcad.html*', function (req, res) {
    let uu = fu.qy2se(req.query, res, se)
    let sql = mm.makeupdatesq("cad", se.id, uu)
    // sql="update cad set stlsize=500, scad='"+uu.scad+"'  where id="+uu.id
    console.log(sql)
    db.run(sql)
    res.redirect("cad.html?fff=1&t=cad&id=" + se.id)

})


function getord() {

    let sq = "select cad.id, idord, order_description as des, pat, stlsize,  scad from cad "
        + " INNER JOIN ord ON cad.idord = ord.id "
        + "  where 1 order by cad.id desc"

    // + " AND ord.hide != 1  "
    console.log('sd' + sq)
    // get ord
    db.all(sq, function (err, rows) {
        if (err) return console.log(err.message + "-2-" + sq);
        // noting to do because fields ar placeholders surnam {{surnam}}
        sess.rowsord = rows
    });
}


//////////////////////////////////////
app.get('/selcad.html*', function (req, res) {
    let uu = fu.qy2se(req.query, res, se)
    let lins
    let linss = ""
    if (vvv) {
        lins = vvv.yyy("./" + pp, ["db"])

    } else {
        lins = ["module not loaded."]
    }
    for (var e of lins) {
        let e2 = e.slice(0, -4)
        linss += `</br><a href="cad2.html?fn=${e2}">
    ${e}</a>`
    }
    sess.rr = linss
    res.render("selcad", sess)
})
/////////////////////////////////////

app.get('/cad2.html*', function (req, res, next) {
    let uu = req.query
    let fn = pp + req.query.fn + ".txt"

    let lins = vvv.yyy("./" + pp, ["db"])
    sess.lins = lins
    // display parameter of korp7.scad
    fs.readFile(fn, 'utf8', (err, cad) => {
        if (err) { console.log(err); }
        fs.readFile("public/k8.scad", 'utf8', (err, data) => {
            // try {
            sess.cad = cad
            sess.cad2 = cad.split("\n")
            sess.fn = req.query.fn
            if (req.query.frm) {
                sess.frm = 1
            }
            if (req.query.doo) {
                sess.doo = 1
            }
            res.render("cad21", sess)
        });
    });

});


app.get('/', function (req, res) {

    let vorl =
        `m0 1.9 8 30 #spanplatte weiss
a 40 30 60  m0`
    res.redirect("cad2.html?fn=join")
})


app.get('/newcad.html?', function (req, res) {
    let vorl =
        `m0 1.9 8 30 #spanplatte weiss
a 40 30 60  m0`
    res.render("newcad", {})
})


app.get('/newcadwrite.html', function (req, res) {
    let fn = pp + req.query.fn + ".txt"
    fs.writeFile(fn
        , req.query.cad, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("cad2.html?fn=" + req.query.fn)
        })
})


app.get('/writecad.html', function (req, res) {
    let fn = pp + req.query.fn + ".txt"
    if (req.query.frm) {
        fs.writeFile(fn
            , req.query.cad, (err) => {
                if (err) {
                    console.log(err);
                }
            })
    } else {
        let st = ""
        for (var e in req.query) {
            if (req.query[e] == "") { continue }
            if (/^c/.test(e)) {
                st += req.query[e] + "\n"
            }
        }
        fs.writeFile(fn, st, (err) => {
            if (err) {

                console.log(err);
            }
        })
    }
    res.redirect("cad2.html?fn=" + req.query.fn)
})

module.exports = app;