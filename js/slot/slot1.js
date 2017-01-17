/**
 * 
 * Author: Saurabh Odhyan | http://odhyan.com
 *
 * Redesigned : ToanPVN | fb.com/PhamBanBan
 * 
 * Licensed under the Creative Commons Attribution-ShareAlike License, Version 3.0 (the "License")
 * You may obtain a copy of the License at
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * Date: May 23, 2011 
 */



$(document).ready(function () {
    /**
     * Global variables
     */
    var completed = 0,
        count = 10,
        imgHeight = 360 * 10,
        user = 0,
        posArr = [],
        db = [],
        nRandom = [],
        spec = 3,
        audio = document.getElementById("spk");
    
    db[0] = db[1] = db[2] = db[3] = db[4] = 0;

    for (i = 0; i < count; i++) {
        posArr[i] = 360 * i;
    }

    /**
     * @class Slot
     * @constructor
     */
    function Slot(el, max, step) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = null; //final position of the slot    

        $(el).pan({
            fps: 30,
            dir: 'down'
        });
        $(el).spStop();
    }

    /**
     * @method start
     * Starts a slot
     */
    Slot.prototype.start = function () {
        var _this = this;
        $(_this.el).addClass('motion');
        $(_this.el).spStart();
        _this.si = window.setInterval(function () {
            if (_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
        }, 100);
    };

    /**
     * @method stop
     * Stops a slot
     */
    Slot.prototype.stop = function () {
        var _this = this,
            limit = 25;
        clearInterval(_this.si);
        _this.si = window.setInterval(function () {
            if (_this.speed > limit) {
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
            if (_this.speed <= limit) {
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                $(_this.el).removeClass('motion');
                _this.speed = 0;
            }
        }, 100);
    };

    /**
     * @method finalPos
     * Finds the final position of the slot
     */
    Slot.prototype.finalPos = function () {
        var el = this.el,
            el_id,
            pos,
            posMin = 2000000000,
            best,
            bgPos,
            i,
            xyz,
            j,
            k;

        el_id = $(el).attr('id');
//      pos = $(el).css('background-position'); //for some unknown reason, this does not work in IE
//        pos = document.getElementById(el_id).style.backgroundPosition;
//        pos = pos.split(' ')[1];
//        pos = parseInt(pos, 10);
//
//        for (i = 0; i < posArr.length; i++) {
//            for (j = 0;; j++) {
//                k = posArr[i] + (imgHeight * j);
//                if (k > pos) {
//                    if ((k - pos) < posMin) {
//                        posMin = k - pos;
//                        best = k;
//                        this.pos = posArr[i]; //update the final position of the slot
//                    }
//                    break;
//                }
//            }
//        }
        xyz = el_id.toString();
        var dest = $("#text" + xyz[4]);
        if (db[xyz.charCodeAt(4)-49] == 0) {
            numberRandom = luckyDraw();
            nRandom[xyz.charCodeAt(4)-49] = numberRandom;
            var string = userName[numberRandom];
            var q = jQuery.map(string.split(' '), function (letter) {
                return $('<span>' + letter + ' </span>');
            });

            var ce = 0;
            
            var ii = setInterval(function () {
                audio.src = "tin.m4a";
                audio.play();
                q[ce].appendTo(dest).hide().fadeIn(3000);
                
                ce += 1;
                if (ce >= q.length) {
                    clearInterval(ii);
                    setTimeout(function() {
                        dest.html(userName[nRandom[xyz[4]-1]] + "<br>" + userEmail[nRandom[xyz[4]-1]] + '<br>' + defDepart[userDepart[nRandom[xyz[4]-1]]]);
                        completed++;
                    }, 1700);
                }
            }, 3000); 
        } else {
            completed++;
        }
        best = -360*userDepart[numberRandom];
        bgPos = "0 " + best + "px";
        $(el).animate({
            backgroundPosition: "(" + bgPos + ")"
        }, {
            duration: 4000,
            complete: function () {
                
            }
        });
    };

    /**
     * @method reset
     * Reset a slot to initial state
     */
    Slot.prototype.reset = function () {
        var el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        this.speed = 0;
        completed = 0;
    };
    

    function enableControl() {
        $('#control').attr("disabled", false);
    }

    function disableControl() {
        $('#control').attr("disabled", true);
    }

    //create slot objects
    var a = new Slot('#slot1', 30, 1),
        b = new Slot('#slot2', 32, 2),
        c = new Slot('#slot3', 34, 3),
        d = new Slot('#slot4', 36, 4),
        e = new Slot('#slot5', 38, 5);

    /**
     * Slot machine controller
     */
    
    //reset Control
    
    function resetControl(){
        a.reset();
        b.reset();
        c.reset();
        d.reset();
        e.reset();
        audio.src = "pull.mp3";
        this.innerHTML = "Start";
        for(j=1;j<=5; j++){
            document.getElementById("text"+j).innerHTML="<br><br>";
        }
    }
    
    $('#control').click(function () {
        var x,jj;
        if (this.innerHTML == "Start") {
            resetControl();
            a.start();
            b.start();
            c.start();
            d.start();
            e.start();
            audio.play();
            disableControl(); //disable control until the slots reach max speed

            //check every 100ms if slots have reached max speed 
            //if so, enable the control
            x = window.setInterval(function () {
                if (a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed && d.speed >= d.maxSpeed && e.speed >= e.maxSpeed) {
                    window.clearInterval(x);
                }          
            }, 100);
            window.setTimeout(function(){
            a.stop();
            b.stop();
            c.stop();
            d.stop();
            e.stop();

            disableControl(); //disable control until the slots stop

            //check every 100ms if slots have stopped
            //if so, enable the control
            x = window.setInterval(function () {
                if (a.speed === 0 && b.speed === 0 && c.speed === 0 && d.speed === 0 && e.speed === 0 && completed === 5) {
                    enableControl();
                    window.clearInterval(x);
                }
            }, 100);
            },5000) 
        } else { //reset
            
        }
    });
    
    $('#special').click(function (){
            resetControl();
        if (this.innerHTML == "Special"){
            $("#slot1").hide(300);
            $("#slot2").hide(300);
            $("#slot5").hide(300);
            $("#slot4").hide(300);
            $("#text1").hide(300);
            $("#text2").hide(300);
            $("#text5").hide(300);
            $("#text4").hide(300);
//            if (spec == 0) {
//                document.getElementById("text3").innerHTML="Giải Đặc Biệt<br><br>";
//            } else {
//                document.getElementById("text3").innerHTML="Giải " + spec.toString() + "<br><br>";
//                spec--;
//            }
            document.getElementById("text3").innerHTML="";
            this.innerHTML = 'Normal';
            document.getElementById("text3").style.width = "600px";
            document.getElementById("text3").style.fontSize = "50px";
            db[0] = db[1] = db[3] = db[4] = 1;
        } else {
            $("#slot1").show();
            $("#slot2").show();
            $("#slot5").show(300);
            $("#slot4").show(300);
            $("#text1").show(300);
            $("#text2").show(300);
            $("#text5").show(300);
            $("#text4").show(300);
            this.innerHTML = 'Special';
            document.getElementById("text3").style.width = "270px";
            document.getElementById("text3").style.fontSize = "25px";
            db[0] = db[1] = db[3] = db[4] = 0;
        }
        
    });
});