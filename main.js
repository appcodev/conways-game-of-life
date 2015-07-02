/**
 * Conway's Game of Life simulator v.1.0
 * by appcodev.com
 *
 * Copyright appcodev.com
 * Released under the MIT license.
 */

enchant();

var ROWS = 40;
var COLS = 80;

window.onload = function(){
    //640
    var game = new Core(80*16+20,720);
    game.fps = 15;
    game.preload("tile.png");
    game.onload = function(){
        
        var gData = zero2DArray(ROWS,COLS);
        var start = false;
        
        var label = new Label('START');
        label.width = 100;
        label.height = 40;
        label.font = '30px arial';
        label.textAlign = 'center';
        label.backgroundColor = 'green';
        label.x = game.width-220;
        label.y = 10;
        game.rootScene.addChild(label);
        label.on('touchstart', function(){
            start = !start;
            this.text = start?'STOP':'START';
            label.backgroundColor = start?'red':'green';
        });
        
        var label2 = new Label('CLEAR');
        label2.width = 100;
        label2.height = 40;
        label2.font = '30px arial';
        label2.textAlign = 'center';
        label2.backgroundColor = 'blue';
        label2.x = label.x+label.width+10;
        label2.y = label.y;
        game.rootScene.addChild(label2);
        label2.on('touchstart', function(){
            if(!start){
                var clr = zero2DArray(ROWS,COLS);
                tile.loadData(clr);
            }
        });
        
        var label3 = new Label();
        label3.width = 400;
        label3.text = "Conway's Game of Life<br>1. Drag mouse in white area to draw.<br>2. Click again to earse.<br>3. Start for see simulation.  Made by Enchant.js @ www.appcodev.com";
        label3.font = '12px arial';
        label3.x = 15;
        label3.y = 3;
        game.rootScene.addChild(label3);
        
        var tile = new Map(16,16);
        tile.image = game.assets["tile.png"];
        tile.x = 10;
        tile.y = 60;
        tile.loadData(gData);
        
        game.rootScene.addChild(tile);
        game.rootScene.backgroundColor = 'rgb(40,140,180)';
        
        game.rootScene.on('touchmove', function(e){
            if(!start){
                reDraw(e.x,e.y,tile,1);
            }
        });
        
        game.rootScene.on('touchstart', function(e){
            if(!start){
                reDraw(e.x,e.y,tile,0);
            }
        });
        
        tile.on('enterframe', function(){
            if(start){
                var d = conwayGameofLife(this._data[0]);
                this.loadData(d);
            }
        });
        
    };
    game.start();
};

function reDraw(x,y,tile,draw){
    var tileX = Math.floor((x-tile.x)/16);
    var tileY = Math.floor((y-tile.y)/16);
    
    if(tileX>=0 && tileY>=0 && tileX<COLS && tileY<ROWS){
        var d = tile._data[0];
        d[tileY][tileX] = draw;
        tile.loadData(d);
    }
}

function zero2DArray(rows,cols){
    var data = [];
    for(var r=0; r<rows; r++){
        var arr = [];
        for(var c=0; c<cols; c++){
            arr.push(0);
        }
        data.push(arr);
    }
    return data;
}

function conwayGameofLife(data){
    var newData = zero2DArray(ROWS,COLS);
    for(var r=0;r<data.length;r++){
        for(var c=0;c<data[r].length;c++){
            
            var d = data[r][c];
            var n = 0;
            //neigbors 8
            for(var nb=0;nb<9;nb++){
                var rw = r+(Math.floor(nb/3)-1);//row nb/3 0,1,2 -> -1,0,1
                var cl = c+((nb%3)-1);//col nb%3 0,1,2 -> -1,0,1
                if(rw==r && cl==c){
                    continue;
                }
                if(rw >=0 && cl >= 0 && rw < data.length && cl < data[r].length){
                    if(data[rw][cl]==1){
                        n++;
                    }
                }
            }
            
            //rule
            var v = d;
            if(v==1){//live
                if(n<2 || n>3){
                    v = 0;
                }
            }else{//dead
                if(n==3){
                    v = 1;
                }
            }
            newData[r][c] = v;
        }
    }
    
    return newData;
}