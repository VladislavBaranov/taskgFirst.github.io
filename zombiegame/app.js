window.addEventListener("DOMContentLoaded", game);

let sprite = new Image();
let spriteExplosion = new Image();
sprite.src = 'image/sprite.png';

window.onload = function() {
    spriteExplosion.src = 'image/explosion.png';
};

function game() {
    
    let canvas = document.getElementById('canvas'),
        ctx    = canvas.getContext('2d'),
        cH     = ctx.canvas.height = window.innerHeight,
        cW     = ctx.canvas.width  = window.innerWidth ;
    
    let bullets    = [],
        zombies    = [],
        explosions = [],
        killed     = 0,
        record     = 0,
        count      = 0,
        playing    = false,
        gameOver   = false;
    
    let player = {
        posX   : -32,
        posY   : -145,
        width  : 80,
        height : 190,
        deg    : 0
    };
    let  SOUNDTRACK = new sound("sounds/soundtrack.mp3"),
         LAUGHTER   = new sound("sounds/laughter.mp3"),
         ROAR_1     = new sound("sounds/roar_1.mp3"),
         ROAR_2     = new sound("sounds/roar_2.mp3"),
         ROAR_3     = new sound("sounds/roar_3.mp3"),
         ROAR_4     = new sound("sounds/roar_4.mp3"),                
         SHOOT      = new sound("sounds/shoot1.mp3");

    canvas.addEventListener('click', action);
    canvas.addEventListener('mousemove', action);
    window.addEventListener("resize", update);

    function update() {
        cH = ctx.canvas.height = window.innerHeight;
        cW = ctx.canvas.width  = window.innerWidth ;
    }

    function move(e) {
        player.deg = Math.atan2(e.offsetX - (cW/2), -(e.offsetY - (cH/2)));
    }

    function action(e) {
        e.preventDefault(); 
        if(playing) {
           
            SHOOT.play();   
            let bullet = {
                x: 11,
                y: -140,
                sizeX : 2,
                sizeY : 10,
                realX : e.offsetX,
                realY : e.offsetY,
                dirX  : e.offsetX,
                dirY  : e.offsetY,
                deg   : Math.atan2(e.offsetX - (cW/2), -(e.offsetY - (cH/2))),
                killed: false
            };
                       
            bullets.push(bullet);
            
        } else {
            let dist;
            if(gameOver) {
                dist = Math.sqrt(((e.offsetX - cW/2) * (e.offsetX - cW/2)) + ((e.offsetY - (cH/2 + 60)) * (e.offsetY - (cH/2 + 60))));
                if (dist < 27) {
                    if(e.type == 'click') {
                        gameOver   = false;
                        count      = 0;
                        bullets    = [];
                        zombies    = [];
                        explosions = [];
                        killed     = 0;
                        player.deg = 0;
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                dist = Math.sqrt(((e.offsetX - cW/2) * (e.offsetX - cW/2)) + ((e.offsetY - cH/2) * (e.offsetY - cH/2)));
                if (dist < 27) {
                    if(e.type == 'click') {
                        playing = true;
                        canvas.removeEventListener("mousemove", action);
                        canvas.addEventListener('contextmenu', action);
                        canvas.addEventListener('mousemove', move);
                        canvas.setAttribute("class", "playing");
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            }
        }
    }

    function fire() {
        let distance;
        for(let i = 0; i < bullets.length; i++) {
            if(!bullets[i].killed) {
                ctx.save();
                ctx.translate(cW/2,cH/2);
                ctx.rotate(bullets[i].deg);
                ctx.drawImage(
                    sprite,
                    211,
                    100,
                    50,
                    75,
                    bullets[i].x,
                    bullets[i].y -= 20,
                    19,
                    30);
                ctx.restore();
                 //Real coords
                bullets[i].realX = (0) - (bullets[i].y ) * Math.sin(bullets[i].deg);
                bullets[i].realY = (0) + (bullets[i].y ) * Math.cos(bullets[i].deg);

                bullets[i].realX += cW/2;
                bullets[i].realY += cH/2;

                //Collision
                for(let j = 0; j < zombies.length; j++) {
                    if(!zombies[j].killed) {
                        distance = Math.sqrt(Math.pow(zombies[j].realX - bullets[i].realX, 2) + Math.pow(zombies[j].realY - bullets[i].realY, 2));
                        if (distance < ((zombies[j].width) / 2)) {
                            killed += 1;
                            zombies[j].killed = true;
                            bullets[i].killed   = true;
                            explosions.push(zombies[j]);
                        }
                    }
                } 
            }
        }
    }

    function _player() {
        ctx.save();
        ctx.translate(cW/2,cH/2);
        ctx.rotate(player.deg);
        ctx.drawImage(
            sprite,
            0,
            0,
            player.width,
            player.height,
            player.posX,
            player.posY,
            player.width,
            player.height
        );
        ctx.restore();
        if(playing) {
            fire();
        }
    }

    function newzombie() {
        let type = random(1,4),
            coordsX,
            coordsY;
        switch(type){
            case 1:
                coordsX = random(0, cW);
                coordsY = 0 - 150;
                ROAR_1.play();
                break;
            case 2:
                coordsX = cW + 150;
                coordsY = random(0, cH);
                ROAR_2.play();
                break;
            case 3:
                coordsX = random(0, cW);
                coordsY = cH + 150;
                ROAR_3.play();
                break;
            case 4:
                coordsX = 0 - 150;
                coordsY = random(0, cH);
                ROAR_4.play();
                break;
        }

        let zombie = {
            x: 278,
            y: 0,
            state: 0,
            stateX: 0,
            width: 134,
            height: 123,
            realX: coordsX,
            realY: coordsY,
            moveY: 0,
            coordsX: coordsX,
            coordsY: coordsY,
           
            deg: Math.atan2(coordsX  - (cW/2), -(coordsY - (cH/2))),
            killed: false
        };

        zombies.push(zombie);
    }

    function _zombies() {
        let distance;
        for(let i = 0; i < zombies.length; i++) {
            if (!zombies[i].killed) {
                ctx.save();
                ctx.translate(zombies[i].coordsX, zombies[i].coordsY);
                ctx.rotate(zombies[i].deg);
                ctx.drawImage(
                    sprite,
                    zombies[i].x,
                    zombies[i].y,
                    zombies[i].width,
                    zombies[i].height,
                    -(zombies[i].width ) / 2,
                    zombies[i].moveY += 1,
                    zombies[i].width ,
                    zombies[i].height 
                );

                ctx.restore();

                //Real Coords
                zombies[i].realX = (0) - (zombies[i].moveY + ((zombies[i].height)/2)) * Math.sin(zombies[i].deg);
                zombies[i].realY = (0) + (zombies[i].moveY + ((zombies[i].height)/2)) * Math.cos(zombies[i].deg);

                zombies[i].realX += zombies[i].coordsX;
                zombies[i].realY += zombies[i].coordsY;

                //Game over
                distance = Math.sqrt(Math.pow(zombies[i].realX -  cW/2, 2) + Math.pow(zombies[i].realY - cH/2, 2));
                if (distance < ((zombies[i].width) / 2)) {
                    gameOver = true;
                    playing  = false;
                    canvas.addEventListener('mousemove', action);
                }
            } else if(!zombies[i].extinct) {
                explosion(zombies[i]);
            }
        }

        if(zombies.length - killed < 10 + (Math.floor(killed/6))) {
            newzombie();
        }
    }

    function explosion(zombie) {
        ctx.save();
        ctx.translate(zombie.realX, zombie.realY);
        ctx.rotate(zombie.deg);

        let spriteY,
            spriteX = 256;
        if(zombie.state == 0) {
            spriteY = 0;
            spriteX = 0;
        } else if (zombie.state < 8) {
            spriteY = 0;
        } else if(zombie.state < 16) {
            spriteY = 256;
        } else if(zombie.state < 24) {
            spriteY = 512;
        } else {
            spriteY = 768;
        }

        if(zombie.state == 8 || zombie.state == 16 || zombie.state == 24) {
            zombie.stateX = 0;
        }

        ctx.drawImage(
            spriteExplosion,
            zombie.stateX += spriteX,
            spriteY,
            256,
            256,
            - (zombie.width)/2,
            -(zombie.height)/2,
            zombie.width ,
            zombie.height
        );
        zombie.state += 1;

        if(zombie.state === 31) {
            zombie.extinct = true;
        }

        ctx.restore();
    }

    function start() {
        if(!gameOver) {
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();
            SOUNDTRACK.play();
            
            if(playing) {
                SOUNDTRACK.stop();
                _player();
                _zombies();
                ctx.font = "20px Verdana";
                ctx.fillStyle = "white";
                ctx.textBaseline = 'middle';
                ctx.textAlign = "left";
                ctx.fillText('Record: '+record+'', 20, 70);
                ctx.font = "30px Verdana";
                ctx.fillStyle = "white";
                ctx.textAlign = "left";
                ctx.textBaseline = 'middle';
                ctx.fillText('Killed: '+killed+'', 20, 30);
            } else {
                ctx.drawImage(sprite, 428, 12, 70, 70, cW/2 - 35, cH/2 - 35, 70,70);
            }
        } else if(count < 1) {
            LAUGHTER.play();
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0,0, cW,cH);
            ctx.fill();

            ctx.font = "60px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER",cW/2,cH/2 - 150);

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Total killed: "+ killed, cW/2,cH/2 + 140);

            record = killed > record ? killed : record;

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("RECORD: "+ record, cW/2,cH/2 + 185);
            ctx.drawImage(sprite, 500, 18, 70, 70, cW/2 - 35, cH/2 + 40, 70,70);
            canvas.removeAttribute('class');
        }
    }

    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }
    }

    function init() {
        window.requestAnimationFrame(init);
        start();
    }

    init();

}