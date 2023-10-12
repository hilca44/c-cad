
///////////////////////////////////////////////
// import * as THREE from 'three';
// import * as fu from '/js';
var deb = 19
var unitfaktor = 10
var faktorm2 = 1000000
var faktorm = 1000


//////////////////////////////
function printBox(st, wid, al = "l", il = ' ', fix = 0) {
    let re = "", diff = 0
    if (st == null) {
     st = "\n"
    }
    if (fix > 0) {
     st = Number(st).toFixed(fix)
    }
    let lenn = st.toString().length
    diff = (wid - lenn)
    if (lenn > wid) {
     return re = String(st).slice(0, wid)
    }
    // console.log("diff"+diff)
    if (al == "l") {
     re = st + il.repeat(diff)
    } else if (al == "r") {
     re = il.repeat(diff) + st
    }
    return re
   }


function dd(pp) {


    let rr = JSON.stringify(pp,
        null,
        0)
    console.log(rr)
    return rr

}
//////////////////////////

function cc(ii, fi = 2) {
    // ii=String(ii).replace("00","0")
    return parseFloat(eval(ii))
}

class Proj {
    constructor(inn, fn) {
        this.inn = inn
        this.fn = fn
        this.omat = {}
        this.ovar = {}
        this.lpa = []
        this.lms = []  // list of mat
        this.lparts = []
        this.lbes = []  // list beschlag
        this.kosc = ""
        this.hl = ""
        this.eur = 0
        this.m2 = {}
        this.qa = 8
        this.vs = {} // all obj key=first entry
        this.matlegend = ""
        this.ogs = {}
        this.oosc = {}
        this.ok = {}
        this.oks = {}
        this.ovs = {}
        this.oinko = {}
        this.stl = []
        this.out = ""
        this.opas={}
        this.mod = 0  // 1 klammer is open
        // let fnn =ko.innk.replace(/[+-\s$]/g,"_")
        //     let fina ="public/img/"+fnn+ ".stl"
        this.lins = []
        this.allRowsToVar()
        this.createListMaKoPaVaFromInn()
    }

    getall(cb) {
        cb(this)
    }

    createListMaKoPaVaFromInn(kopa) {
        var ko
        this.matlegend = "Verwendete Materialien:: "
        // alert(dd(this.vs))

        let linn = this.inn.trim().split("\n")
        for (var m of linn) {
            // // all rows to vs
            // let kv = m.split(" ")
            // this.vs[kv[0]] = kv.slice(1).join(" ")
            m = this.replVars(m)

            if (/^[>#]/.test(m)) {
                continue
            } else if (/^[A-Z]/.test(m)) {
                let lv = m.trim().replace("  ", " ").split(" ")
                this.ovs[lv[0]] = lv.slice(1).join(" ")
            } else if (/^m\d /.test(m)) {
                this.newMat(m)

                // innput for korp
            } else {
                let ko = this.newKorp(m)
                this.oks[ko.nme] = ko
                this.out += "\n" + ko.osc
            }
        }


        // }
    }

    allRowsToVar() {
        var repeet = false
        let linn = this.inn.trim().split("\n")
        for (var m of linn) {
            // all rows to vs
            let kv = m.split(" ")
            this.vs[kv[0]] = kv.slice(1).join(" ")
            // if(/\$/.test(kv)){
            //     repeet=true
            // }else{

            //     m = this.replVars(m)
            // }
        }
        for (let v in this.vs) {
            if (/\$/.test(this.vs[v])) {
                this.vs[v] = this.vs[this.vs[v][1]]
            }

        }
        // if(repeet){

        //     this.allRowsToVar()
        // }
    }
    // calcm2mat moved to mod2

    newMat(m) {
        let i, sho
        i = m.trim().split(" ")
        if (/#/.test(m)) {

            var d = m.trim().split("#")
            sho = d[1]
        } else {
            sho = i[4]
        }
        var mat
        // for(var i of lmi){
        mat = {
            nme: i[0][1],
            s: i[1],
            co: i[2],
            p: i[3],
            v: i[4],
            ma: sho,
            uml: 0,  // umleimer
            m2: 0,
            short: i[4].slice(0, 2) + i[1].replace(".", "")
        }
        this.matlegend += " " + mat.short + ": "
            + mat.ma + " " + mat.s + " cm / "
        this.lms[mat.nme] = mat
        let naam = ("m" + mat.nme).toUpperCase()
        this.ovs[naam] = mat.s
    }



    mv(r) {
        let a = r.split("mv")[1].trim().split(" ")
        return "translate([" + a[0] + "," + a[1] + "," + a[2] + "])"
    }



    newGroup(ro) {
        let ou = ""
        ou += " {"
        let li = ro.split(" ")[1].trim()
        for (let k of li) {
            ou += this.oks[k].osc
        }
        ou += " } "
        this.ogs[ro[1]] = ou
        return ou
    }


    newKorp(innk) {
        var ko = {
            expl:1,
            lparts: [],
            pats: {},
            nme: "sw",
            mid: "m0",
            hl: "",
            innk: innk, // input 
            ty: "ko",
            matofparts: {},
            j: "lg",
            w: 0,
            d: 0,
            h: 0,
            x: 0,  // offset x
            y: 0,
            z: 0,
            xx: 0,  // zero point of korp
            yy: 0,  // zero point of korp
            zz: 0,  // zero point of korp
            ////////////////
            // ob,re,un,li like cs,s bx
            b: 1.6,  // hinten staerke :  rueckwand
            bs: 1.6,
            c: 0,  // mittelsei 0-9 od []
            fn: 1,  // fachb 0-9 od []
            fnq: 1,  // fachb 0-9 od []
            faby: 1,
            fs: 1.9,  // fachbo
            fo: 1,  // fachbo
            fp: 1,  // fachbo
            fq: 1,  // fachbo
            fx: 1,  // fachbo
            fy: 1,  // fachbo
            fz: 1,  // fachbo
            ful: 0.2,
            fuo: 0.2,  // tuerfuge oben
            fur: 0.2,  // tuerfuge rechts
            fuu: 0.2,
            // g: 1.9,  // untenen s, 0: aus
            gs: 1.9,  // untenen s, 0: aus
            gg: 0,  // gap
            gv: 0.1,  // gap vorne
            k: 0,  // k-boeden
            ks: 1.9,  // fachbo
            l: 1,  // links :  seite li s, ls0: aus
            ls: 1.9,
            mx: 0,
            my: 0,
            mz: 0,
            n: 1,
            o: 0,
            p: 0,
            q: 0,
            nx: [1, 0],
            ny: [1, 0],
            nz: [1, 0],
            pazz: [0, 0, 0, 0],
            r: 1,  // rechts seite re s, rs0: aus
            ra: 0,
            rb: 0,
            rg: 0,
            rs: 1.9,
            rt: 0,
            rv: 0,
            rwy: 2,  // Innenseite rw von hinten
            rx: 0,
            ry: 0,
            rz: 0,
            so: 0,
            t: 1.9,  // oben staerke :  deckel, os0: aus
            ts: 1.9,  // oben staerke :  deckel, os0: aus
            tex: "k",
            ts: 1.9,  // mittelseite s
            tx: 0,
            v: 0,  // vorne 0-2 od [[start, ende],[], ...]
            vb: 0,  // vorne 0-2 od [[start, ende],[], ...]
            vs: 1.6,  // vorne staerke :  front (schubk. tuer)
            n: 1,
            m2: {},
            smosc: "",
            sc: "",
            stl: "",
            kva: "",
            pama: {},
            opas: {},
            lbh_len: 0
        }

        ko = this.makeParts_step1(ko)
        ko = this.replPartsVal(ko)
        ko = this.replVarsParam(ko)
        // ko.mid = this.setKorpMidS(ko.innk)
        // ko = this.makeKoOpenscad(ko)
        ko = this.makeKorpPara(ko)
        ko = this.calcKorpDim(ko)
        ko = this.replVarsGlob(ko)
        ko = this.makeParts(ko)
        ko = this.makePatsPara(ko)
        ko = this.cutParts(ko)
        // alert(dd(ko.pats)+'ko')
        // alert(dd(ko.pats)+'ko')
        // ko = this.calcKorpN(ko)
        // ko = this.calcKorpM2(ko)
        // ko = this.makeKorpHl(ko)
        return ko
    } //

    makeblocks(ko) {
        return ko.innk.trim().replace("  ", " ").split(" ")

    }

    // VARI 55 search for VARI replace 55
    replVarsGlob(ko) {

        for (var e in this.vs) {

            // global: if var ends with g, puut value to all rows
            if (/ g[\s]*$/.test(this.vs[e])) {
                let oterm = this.getKVfromStr(this.vs[e])
                // alert(dd(oterm))
                for (let ee in oterm) {
                    ko[ee] = cc(oterm[ee])
                }
            }
        }
        return ko
    }


    // VARI 55 search for VARI replace 55
    replVarsParam(k) {
        for (var e in this.oks) {
            let re1 = new RegExp(e + "[\.]", "g")
            if (re1.test(k.innk)) {
                if (/--/.test(k.innk)) {
return k
                }
                console.log(e + ":" + re1.exec(k.innk) + " 44rrr")
                let os = k.innk.split(re1)
                let r2 = os[0]
                for (let ee of os.slice(1)) {
                    let re4 = /^\w*/
                    let prop = re4.exec(ee)
                    ee = ee.replace(re4, this.oks[e][prop])
                    r2 += ee
                }
                k.innk = r2
                console.log(e + ":" + k.innk + " rrr")
            }
        }
        return k
    }


    // VARI 55 search for VARI replace 55
    replVars(r) {

        for (var e in this.vs) {
            let rea = new RegExp("[\$]" + e, "g")
            if (rea.test(r)) {
                // if (this.iserr(e,this.vs,r)){

                //     continue
                // } 
                r = r.replace(rea, this.vs[e])

            }

        }
        for (var e in this.ovs) {
            // let re = new RegExp("(?<![A-Z])" + e + "(?![A-Z])", "g")
            let re = new RegExp("(?<!^)" + e, "g")
            r = r.replace(re, this.ovs[e])
            console.log(e + ":" + this.ovs[e] + " hee")
        }
        return r
    }


    // search (a.b.w)
    replPartsVal(k) {
        // let lpams =r.trim().replace("  ", " ").split(" ")
        // for (var e of lpams) {
        let lo = /(?<=[(])[^)]*(?=[)])/g.exec(k.innk)
        // alert(dd(lo))
        if (lo == null) return k
        for (let e of lo) {
            let par = e.split(".")
            // if(this.iserr( lo,r,"partsval"+r)) continue

            if (par.length == 2) {
                k.innk = k.innk.replace("(" + e + ")", this.oks[par[0]][par[1]])
            } else if (par.length == 3) {
                k.innk = k.innk.replace("(" + e + ")", this.oks[par[0]]["pats"][par[1]][par[2]])
            }
        }
        return k
    }


    makeKorpPara(ko) {
        ko.nme = this.makeblocks(ko)[0]
        ko.j = this.makeblocks(ko)[1]
        if (/^\d/.test(this.makeblocks(ko)[2])) {
            
            ko.w = cc(this.makeblocks(ko)[2])
        }
        if (/^\d/.test(this.makeblocks(ko)[3])) {
            
            ko.d = cc(this.makeblocks(ko)[3])
        }
        if (/^\d/.test(this.makeblocks(ko)[4])) {
            
            ko.h = cc(this.makeblocks(ko)[4])
        }
        for (var block of this.makeblocks(ko).slice(2)) {
            block = block.trim()
            if (/[\.\.]/.test(block)) {
                var prop=block.split("..")
                let o
                if(prop[0].length==1){
                    ko[prop[0]]=ko[prop[1]]
                }else  if(prop[0].length==2){
                    ko["pats"][prop[0][0]][prop[0][1]]=ko[prop[1]]

                }
                for(let e of prop[0]){
                    ko
                }

            }
                if (/^gg/.test(block)) {
                ko.gg = cc(this.splita1(block)[1])
            }
            if (/^j/.test(block)) {
                ko.j = block.slice(1)
            }
            // material for parts which are not korp mat, f.i. bm3
            if (/^[\w]m[0-9]/.test(block)) {
                var m = block.slice(1)
                // ko.pats[pa[0]]["m"]=m
                ko.pats[block[0]]["m"] = m
                ko.pats[block[0]]["s"] = this.lms[m.slice(1)]["s"]
                ko.pats[block[0]]["co"] = this.lms[m.slice(1)]["co"]
                continue
            }
            // -- =   align to korp
            /////////////////////////////////
            /*///////////////////////////////
                          5 --- 6
                         /.    / |
                        1 --- 2  |
                        | 4 . |. 7
                        |.    | /
                        0 --- 3 
            /////////////////////////////////
            /////////////////////////////////
            */
            if (/--/.test(ko.innk)) {  // align
                let vvv = ko.innk.split(" --")
                let vv = vvv[vvv.length-1].split(" ")
                let kkk = this.splita1(vv[0])
                var korp, part, np
                if(/\w[\.]\w/.test(kkk[0])){
                    let lpa=kkk[0].split(".")
                    part = this.oks[lpa[0]]["pats"][lpa[1]]
                    korp = this.oks[lpa[0]]
                    // alert('ww.')
                     np = this.corners(part, kkk[1])
                     ko.xx = korp.xx+korp.x +  np[0]
                     ko.yy = korp.yy+korp.y +np[1]
                     ko.zz =korp.zz+korp.z+ np[2]
                }else{
                    korp = this.oks[kkk[0]]
                     np = this.corners(korp, kkk[1])

                     ko.xx = korp.xx + np[0]
                     
                     ko.yy = korp.yy+np[1]
                     ko.zz =korp.zz+ np[2]
                }
                /////////////////
            }
            var rel = 0
            if (/@/.test(block)) {
                var lkv = block.split("@")
                rel = 1
            } else {

                var lkv = this.splita1(block)
            }

            // split at border char digit: x30 => x 30
            // var lkv = e.split(/(?<=[a-z])(?=[\+\*\/\-0-9])/ig)
            if (lkv[0].length == 1) {
                // let kv = pa.slice(1)
                if (lkv[0] == "m") {
                    // set mat to parts
                    // console.log(lpa, 'lpa')
                    ko.mid = block

                    for (var pz in ko.pats) {
                        ko.pats[pz]["s"] = cc(this.lms[lkv[1]]["s"])
                        ko.pats[pz]["co"] = this.lms[lkv[1]]["co"]
                        ko.pats[pz]["m"] = this.lms[lkv[1]]["nme"]
                    }
                } else {
                    if (rel == 1) {
                        ko[lkv[0]] = cc(ko[lkv[0]] + lkv[1])
                    } else {
                        ko[lkv[0]] = cc(lkv[1])

                    }
                }
            }
        }
        return ko
    }



    splita1(s) {
        // split at border char digit
        if (/@/.test(s)) {
            
            return s.split("@")
        }else if (/\.\./.test(s)) {
            return s.split("..")
        } else {
            return s.split(/(?<=[a-z])(?=[-0-9])/)

        }
    }

    getKVfromStr(s) {
        let ob = {}
        let lterm = s.trim().split(" ")
        for (let ee of lterm) {
            if (ee.trim().length < 2) {
                continue
            }
            let kv = this.splita1(ee)
            ob[kv[0]] = kv[1]
        }
        return ob
    }


    makePatsPara(ko) {
        let bl2 = this.makeblocks(ko).slice(2)
        for (var pa of bl2) {
            if (ko.j.includes(pa[0]) && !/\./.test(pa)) {
                let kv = this.splita1(pa)
                if (kv[0].length > 1) {
                    ko.pats[kv[0][0]][kv[0][1]] = cc(kv[1])
                }
            }
        }
        return ko
    }



    calcKorpDim(ko) {
        let pass = [0, 0, 0, 0]
        ko.lib = (ko.w - ko.ls - ko.rs);
        ko.lih = (ko.h - ko.gs - ko.ts);
        return ko
    }


    makeParts_step1(ko) {
        ko.j = this.makeblocks(ko)[1]
        for (var pp of this.makeblocks(ko)[1]) {
            ko.pats[pp] = this.newPart()
            // alert(dd(ko.pats[pp]))
        }


        return ko
    }

    makeParts(ko) {
        // let w = ko
        var paa = {

            l: [ko.ls, ko.d, ko.h, -ko.gg, ko.gg, 0],
            r: [ko.rs, ko.d, ko.h, ko.w - ko.rs + 2 * ko.gg, ko.gg, 0],
            g: [ko.w, ko.d, ko.gs, ko.gg, ko.gg, ko.gg],
            f: [ko.lib, ko.d, ko.fs, ko.ls, ko.gg, 10],
            t: [ko.w, ko.d, ko.ts, ko.gg, 0, ko.h],
            b: [ko.w, ko.bs, ko.h, 0, ko.d - ko.bs, ko.gg],
            v: [ko.w, ko.vs, ko.h, ko.gg, ko.gg, ko.gg]
        }
        // alert(dd(paa+'paa'))
        // fachbod
        for (var pp of ko.j) {
            // if (this.iserr(pp, ko.j,ko.innk)) continue
            let i = 0
            for (var e of "wdhxyz") {

                ko.pats[pp][e] = cc(paa[pp][i])
                if (pp == "t" && e == "z") {
                    ko.pats[pp][e] -= ko.pats["t"]["s"]
                }
                if (pp == "r" && e == "x") {
                    ko.pats[pp][e] = ko.w-ko.pats["r"]["s"]
                }
                i++
            }
            if (/[lr]/.test(pp)) {
                ko.pats[pp]["w"] = ko.pats[pp]["s"]

            } else if (/[tgf]/.test(pp)) {
                ko.pats[pp]["h"] = ko.pats[pp]["s"]

            }
        }
        return ko
    }

    cutParts(ko) {
        var paa = ko.pats
        let ab
        for (var p of ko.j) {

            var i = ko.j.indexOf(p)
            // cutting element
            for (let ii = 0; ii < i; ii++) {
                var pp = ko.j[ii]
                ab = ko.pats[pp]["s"]
                if (/[bvlr]/.test(p) && /[tg]/.test(pp)) {
                    var res = cc(ko.pats[p]["h"] - ko.pats[pp]["h"])
                    if (res > 0) { ko.pats[p]["h"] = res }
                    if (ko.pats[pp]["z"] < ab) {
                        ko.pats[p]["z"] = cc(ko.gg + ko.pats[p]["z"] + ko.pats[pp]["h"])
                    }
                }
                if (/[bvtg]/.test(p) && /[lr]/.test(pp)) {
                    ko.pats[p]["w"] = cc(ko.pats[p]["w"] - ko.pats[pp]["w"])
                    if (ko.pats[pp]["x"] < ab) {
                        ko.pats[p]["x"] = cc(ko.gg + ko.pats[p]["x"] + ko.pats[pp]["w"])
                    }
                }

                if (/[lrtg]/.test(p) && /[bv]/.test(pp)) {
                    ko.pats[p]["d"] = cc(ko.pats[p]["d"] - ko.pats[pp]["d"])
                    if (ko.pats[pp]["y"] < ab) {
                        ko.pats[p]["y"] = cc(ko.gg + ko.pats[p]["y"] + ko.pats[pp]["d"])
                    }
                }
            }
        }
        return ko
    }

    setKorpMidS(ko) {
        for (var pz in ko) {
            // no m parameter for scad
            if (/[a-z]s/.test(pz)) {
                ko[pz] = cc(this.lms[ko.mid[1]]["s"])
            }
        }
        return ko
    }

    corners(k, corner) {
        
        var corners = [
            [k.x, k.y, k.z],  // np
            [k.x, k.y, k.z + k.h],  // left top
            [k.x + k.w, k.y, k.z + k.h],  // right top
            [k.x + k.w , k.y, k.z],  // right bottom

            [k.x , k.y + k.d, k.z],  // bac bott left bottom
            [k.x , k.y + k.d, k.z + k.h],  // right bottom
            [k.x + k.w, k.y + k.d, k.z],  // bac bott left bottom
            [k.x + k.w, k.y + k.d, k.z + k.h]  // bac bott left bottom
        ]
        return corners[corner]
    }


    calcKorpN(ko) {
        let vs = ["nx", "ny", "nz"]
        for (let v of vs) {

            if (Object.keys(ko.p).includes(v)) {
                ko.n = cc(ko.n) * cc(ko.p[v][0])
            }
        }
        return ko
    }

    calcKorpM2(ko) {
        ko.m2 = {}
        ko.uml = 0
        // dd(ko,"ttt")
        for (var e in ko.pats) {
            //// dd(e.m2, "korp calcm2 e.m2")
            if (ko.p[e.nme + "s"] == 0 || ko.p[e.nme] == 0) {
                continue
            }


            if (!ko.m2[ko.opas[e].mid]) {
                ko.m2[ko.opas[e].mid] = 0
            }
            ko.m2[ko.opas[e].mid] += ko.opas[e].m2


            // ko.uml+=cc(e.uml) * cc(ko.n)
        }
        return ko
    }


    makeKorpHl(ko) {
        var ca = "</br>+++++++++++++</br>"
        ko.kva = " / " + ko.n.toFixed() + "St. " + ko.nme.toUpperCase()
            + ", Material " + this.lms[ko.mid[1]].short
            + ", Maße ca. B" + ko.p.w + " c" + ko.p.d + " hhhh" + ko.p.h + "cm"
        ca += ko.kva
        // ca += "</br>vvv" + JSON.stringify(ko.m2)
        ca += "</br>Umleimer " + ko.uml.toFixed(1) + "m</br>"
        for (var e in ko.opas) {
            var nges = ko.n
            if (ko.p[ko.opas[e].nme + "s"] == 0 || ko.p[ko.opas[e].nme] == 0) {
                continue
            }
            // ca += ko.opas[e].nme + " " + nges + " x "
            //     + ko.opas[e].l + " "
            //     + ko.opas[e].hhhh  + " " + ko.opas[e].s + " = " + cc(ko.opas[e].m2).toFixed(1) + "m2 " + ko.opas[e].mid + "</br>"
            ca += printBox(ko.opas[e].nme, 4, 'l', '  ')
            ca += printBox((ko.opas[e].n * nges).toFixed(1), 4, 'r', '  ')
            ca += printBox("x", 4, 'r', '  ')

            ca += printBox(cc(ko.opas[e].l).toFixed(1), 6, 'r', '  ')
            ca += printBox(ko.opas[e].hhhh, 6, 'r', '  ')
            ca += printBox(ko.opas[e].s, 4, 'r', '  ')
            ca += printBox("=", 4, 'r', '  ')
            ca += printBox(ko.opas[e].m2.toFixed(2) + " m2 " + ko.opas[e].mid, 11, 'r', '  ')
            ca += printBox(ko.opas[e].uml.toFixed(2) + "m uml", 11, 'r', '  ')
            ca += "</br>"
        }
        ca += "</br>+++++++++++++++++++++++++++22222</br>"

        ko.hl = ca
        // this.hl+=ca
        return ko
    }



    newPart(w = 60, d = 40, h = 1.9) {
        var pa = {
            w: w,
            d: d,
            h: h,
            x: 0,
            y: 0,
            z: 0,
            n: 1,
            s: 1.9,
            m: 0,
            co: "wh"
        }
        return pa
    }
    convertPartTomm(pa) {
        pa.l = (pa.l * unitfaktor)
        pa.hhhh = (pa.hhhh * unitfaktor)
        pa.s = (pa.s * unitfaktor)
        return pa
    }


    getlspa() {
        return this.lpa
    }


}  // end class

//////////////////////////////////////


// alert(fn4)
// let vorl = loadFile("./public/cad/" + fn3 + ".txt")

///////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////

// import * as THREE from 'three';
// // var THREE = require("three")
// import Stats from 'three/addons/libs/stats.module.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';



import * as THREE from 'three';
// var THREE = require("three")
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

// import { printBox } from './mod/print-box'

let gui;

var container, stats, controls, light, ligh = 1;
var camera, scene, renderer, labelRenderer;
let theta = 0;
var radius = 0;
var bb = { x: 0, y: 0, z: 0 }
var explodeKorp = 1  



///////
let fn3 = $("#fn").html().trim()
let fn4 = "./public/cad/" + fn3 + ".txt"
$.get("./public/cad/" + fn3 + ".txt", function (vorl) {
    new Proj(vorl, fn3).getall(function (pr) {
        
        var pppp = []
        var paarr = []
        var meshgroup1 = {}
        var holi = ""
        try {
        init();
            
        } catch (error) {
            alert(error, error.stack)
        }
        let m2 =""
        // alert(dd(mattt))
        let i=0
        for(let e in pr.lms){
            let t = pr.lms[e]
           m2+= "<p>m"+t.nme+", "+ t.s+" cm ="
           +t.m2.toFixed(2)+" m2 (Uml " + t.uml.toFixed(0)+"m )</p>"
           i++
        }
        $("#hli").html(holi)
        $("#mm2").html(m2)
        $("#bb").html("Bounding Box" + dd(bb))


        function init() {
            camera = new THREE.PerspectiveCamera(50, 700 / 500, 1, 100000);
            camera.up.set(0, 0, 1);

            camera.layers.enable(0); // enabled by default
            // camera.layers.enable(1);

            camera.layers.enable(2);
            camera.layers.enable(3);
            camera.layers.enable(4);
            camera.layers.enable(5);
            camera.layers.enable(6);

            scene = new THREE.Scene();
            scene.background = new THREE.Color("ivory");

            light = new THREE.PointLight(0xffffff, 3, 0, 0);
            const light2 = new THREE.PointLight(0xffffff, -3, 0, 0);
            //  light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1 );
            light.layers.set(6)
            light.layers.enable(0);
            // light.layers.enable(1);
            light.layers.enable(2);
            light.layers.enable(3);
            light.layers.enable(4);
            light.layers.enable(5);
            light.layers.enable(6);

            scene.add(camera);
            camera.add(light);
            // camera.add(light2);

            var colors = {
                fi: "cornsilk",
                wh: "white",
                bu: "wheat",
                gr: "snow",
                bl: "cornflowerblue",
                ei: "burlywood"
            }
            const geometry = new THREE.BoxGeometry();
            ////////////////////////////////////

            ///////////////////////////////////////

            var mat = new THREE.MeshLambertMaterial({ color: '#336633' });
            let edgmat = new THREE.LineBasicMaterial({ color: 0x000000 });
            let dim, edg, mes, wir

            let tra, ee

            var meshgroup = {}
            meshgroup1 = new THREE.Group("cc")

            var koarr = []
            var koall = new THREE.Group()

            const layers = {

                'labl': function () {
                    camera.layers.toggle(0);
                },

                'dime': function () {
                    camera.layers.toggle(1);

                },
                'wire': function () {
                    camera.layers.toggle(5);

                },

                'korp': function () {

                    camera.layers.toggle(2);

                },
                'back': function () {
                    camera.layers.toggle(3);

                },
                'fron': function () {

                    camera.layers.toggle(4);

                },
                'B': function () {

                    camera.position.set(0, bb.x, bb.z / 2);
                    controls.update()

                },

                'F': function () {

                    camera.position.set(0, -bb.x, bb.z / 2);
                    controls.update()

                },
                'R': function () {

                    camera.position.set(-bb.x, -bb.y, bb.z / 2);
                    controls.update()

                },
                'expl': 1,
                'downl': function () {

                    exportToObj()

                }
            };

            //
            // Init gui
            var gui = new GUI({ width: 65 });
            const myObject = {
                myBoolean: true,
                myFunction: function() {  },
                myString: 'lil-gui',
                myNumber: 1
            };
            gui.add(layers, 'labl');
            gui.add(layers, 'dime');
            gui.add(layers, 'wire');
            gui.add(layers, 'korp');
            gui.add(layers, 'back');
            gui.add(layers, 'fron');
            gui.add(layers, 'B');
            gui.add(layers, 'F');
            gui.add(layers, 'R');
           const controller= gui.add(layers, 'expl').onChange( value =>{
                explodeKorp=value
                animate()
            })
            gui.add(layers, 'downl');
            gui.onChange( event => {

                // event.object     // object that was modified
                // event.property   // string, name of property
                // event.value      // new value of controller
                event.controller // controller that was modified
            
            } );

            ////////////////////////
            ////////////////////////
            ////////////////////////
            ////////////////////////
            if (deb == 1) {

                alert(dd(pr) + "pr")
            }
            ////////////////////////
            ////////////////////////
            ////////////////////////
            // korpus //////////////////////
            for (let k1 in pr.oks) {
                var k = pr.oks[k1]
                // n korpus ////////
                for (let j = 0; j < k.n; j++) {

                    var k11 = k1 + j
                    // korpus parts ///////////
                    meshgroup[k11] = new THREE.Group()
                    for (let e1 in k.pats) {
                        let e = k.pats[e1]
                        // alert(e1+dd(e)+"pr")
                        var mmgg = makeMes(k, e1, e)
                        //////////////////////////
                        meshgroup[k11].add(mmgg)
                    }  // end korpus parts

                    // meshgroup[k11].layers.set(1)
                    let px=(k.x+k.xx + k.o * j) * explodeKorp
                    let py=(k.y+k.yy + k.p * j) * explodeKorp
                    let pz=(k.z+k.zz + k.q * j) * explodeKorp
                    meshgroup[k11].position.set(px, py, pz    )
                    const moonMassDiv = document.createElement('div');
                    moonMassDiv.className = 'label';
                    moonMassDiv.textContent = k.nme;
                    moonMassDiv.style.backgroundColor = 'transparent';
                    moonMassDiv.style.fontSize = '25px'
                    moonMassDiv.style.color = "#333333"
                    moonMassDiv.style.opacity = .5
                    
                    const moonMassLabel = new CSS2DObject(moonMassDiv);
                    moonMassLabel.position.set(
                        Math.random() * k.w / 2 * explodeKorp, k.d / 2 * explodeKorp, 10);
                        moonMassLabel.center.set( 0.1, 0 );
                        moonMassLabel.layers.set(0);
                        meshgroup[k11].add(moonMassLabel);
                        koarr.push(meshgroup[k11])
                    koall.add(meshgroup[k11])
                } // end n korp

                koall.position.set(-bb.x / 2, -bb.y / 2, -bb.z / 2)
                scene.add(koall);


            }  // end korpus

            //////////////////////////////////
            function makeMes(k, e1, e) {
                var colo = 0
                let lay = 2
                if (e1 == "b") {
                    colo = 1
                    lay = 3
                } else if (e1 == "v") {
                    colo = 0
                    lay = 4
                }
                colo = e.co
                let ggg = 0
                let w = e.w - ggg * explodeKorp
                let d = e.d - ggg * explodeKorp
                let h = e.h - ggg * explodeKorp
                dim = new THREE.BoxGeometry(w, d, h);
                //////////////////////
                let mat
                // mat=new THREE.MeshBasicMaterial({ color: colors[colo] })
                // if(ligh > 0){

                // }
                mat = new THREE.MeshLambertMaterial({ color: colors[colo] })
                ///////////////////////
                mes = new THREE.Mesh(dim, mat);

                edg = new THREE.EdgesGeometry(dim);
                wir = new THREE.LineSegments(edg, edgmat);
                wir.layers.set(lay)
                mes.add(wir);
                let offset = 0.5
                let po = {
                    x: ((w * offset) + k.xx + e.x + k.gg),
                    y: ((d * offset) + k.yy + e.y + k.gg),
                    z: ((h * offset) + k.zz + e.z + k.gg)
                }
                po={
                    x: ((w * offset) + e.x + k.gg),
                    y: ((d * offset)  + e.y + k.gg),
                    z: ((h * offset)  + e.z + k.gg)
                }
                mes.position.set(po.x, po.y, po.z)

                mes.layers.set(lay)
                // return mes
                let mmax = cc(w + k.x+k.xx + (k.n - 1) * k.o)
                let mmay = cc(d + k.y + (k.n - 1) * k.p)
                let mmaz = cc(h + k.z + (k.n - 1) * k.q)
                // alert(dd(e)+mmax)
                if (mmax > bb.x) {
                    radius = mmax
                }
                if (mmax > bb.x) {
                    bb.x = mmax
                }
                if (mmay > bb.y) {
                    bb.y = mmay
                }
                if (mmaz > bb.z) {
                    bb.z = mmaz
                }

                //////// parts list
                let arr=[
                    e.w,
                    e.d,
                    e.h
                ]

                arr.sort(function(a, b) {
                    return b - a;
                });
                pr.lms[e.m].m2+= eval(arr[0]*arr[1]/10000)
                pr.lms[e.m].uml+= eval((2*arr[0]+2*arr[1])/100)


                pppp.push(mmax)
                paarr.push(mes)
                let holir = k.nme + "." + e1 + "=" 
                + e.w + "x" + e.d + "x" + e.h 
                + ", x: " + e.x+", z: "+ e.z;
                // holi += "<p>" + holir + "</p>"
                holi += printBox(k.nme+"."+e1, 12, 'l', '.')
                holi += printBox(arr[0].toFixed(1), 8, 'r', '.')
                holi += printBox(arr[1].toFixed(1), 8, 'r', '.')
                holi += printBox(Number(arr[2]).toFixed(1), 18, 'r', '  ')
                holi += printBox("x"+e.x.toFixed(1), 8, 'r', '.')
                holi += printBox("y"+e.y.toFixed(1), 8, 'r', '.')
                holi += printBox("z"+e.z.toFixed(1), 8, 'r', '.')
                holi += "</br>"

               
                let r = Math.random()
                let r1 = Math.random()
                let r2 = Math.random()
                let labl
                labl=makeLabel(holir,po.x/2,0,0,7)
        labl.layers.set(1);

                mes.add(labl);
                ////////
                // scene.add(mes)
                meshgroup1.add(mes)
                return mes

            }
            //////////////////////////////////
            container = document.getElementById('canvas');
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(700, 500);
            renderer.domElement.style.position = 'absolute';
            container.appendChild(renderer.domElement);

            labelRenderer = new CSS2DRenderer();
            labelRenderer.setSize(700, 500);
            labelRenderer.domElement.style.position = 'absolute';
            container.appendChild(labelRenderer.domElement);
            /////
            controls = new OrbitControls(camera, renderer.domElement, labelRenderer.domElement);
            // controls = new TrackballControls( camera, renderer.domElement );
            stats = new Stats();
            document.body.appendChild(stats.dom);
            const controls2 = new OrbitControls(camera, labelRenderer.domElement);
            window.addEventListener('resize', onWindowResize);



            const pointer = new THREE.Vector2();
            var ax = new THREE.AxesHelper(bb.x)
            // ax.position.set(-bb.x/2, -bb.y/2, -bb.z/2)
            // camera.position.y=-bb.x
            // scene.add(ax);

            const link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            camera.position.y = -(bb.x+bb.y)/2*1.7

            createControls(camera);


            function exportToObj() {

                const exporter = new OBJExporter();
                const result = exporter.parse(scene);
                saveString(result, 'object.obj');

            }


            function save(blob, filename) {

                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();

            }

            function saveString(text, filename) {

                save(new Blob([text], { type: 'text/plain' }), filename);

            }
        }  // init

        ///////////////////////////////
        function createControls(camera) {

            // controls = new TrackballControls( camera, renderer.domElement );

            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;

            controls.keys = ['KeyA', 'KeyS', 'KeyD'];

        }
        function makeLabel(tx,x,y,z,s=12){

            var divlabl = document.createElement('div');
            divlabl.className = 'label';
        divlabl.textContent = tx
        divlabl.style.backgroundColor = 'transparent';
        divlabl.style.fontSize = s
        // divlabl.style.height="122px"
        divlabl.style.color = "#333333"
        
        var labl = new CSS2DObject(divlabl);
        labl.position.set(x,y,z);
        labl.center.set(0, 0);
    return labl
    }
        function onWindowResize() {

            // camera.aspect = window.innerWidth / window.innerHeight;
            // camera.updateProjectionMatrix();

            // renderer.setSize(window.innerWidth, window.innerHeight);

        }


        function animate() {
            // camera.fov=300
            requestAnimationFrame(animate);

            controls.update();
            stats.update();
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);

        }
        animate();

    })
})
