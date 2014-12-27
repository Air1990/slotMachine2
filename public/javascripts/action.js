var WAIT = 10; //停止后空转多少圈，一定得是偶数
var Reel = function() {
    var radius = 300;

    this.obj = new THREE.Object3D();

    this.target = 0;   // the target number to stop at

    this.OMIGA = 0.20;      // max angle speed
    this.omiga = 0.001;         // current angle speed
    this.beta  = 0;    // angle speed's speed when speed up
    this.beta2 = 0;    // angle speed's speed when speed down

    var action = 0;        // 0 -- running; 1 -- stop

    for (var i = 0; i < 10; ++i) {
        var div = document.createElement('div');
        div.className = 'digit';

        var span = document.createElement('span');
        span.textContent = i.toString();
        div.appendChild(span);

        var digit = new THREE.CSS3DObject(div);



        // 开头位置缓动效果初始位置
        digit.position.x = 2000 * Math.random() - 1000;
        digit.position.y = 2000 * Math.random() - 1000;
        digit.position.z = 2000 * Math.random() - 1000;
        //new TWEEN.Tween(digit.position)
        //    .to({x: 0, y: radius * Math.sin(r), z: radius * Math.cos(r)},
        //    2000+4000*Math.random())
        //    .easing(TWEEN.Easing.Exponential.InOut)
        //    .start();

        // 开头角度缓动初始化
        digit.rotation.x = 8 * Math.random() - 4;
        digit.rotation.y = 8 * Math.random() - 4;
        digit.rotation.z = 8 * Math.random() - 4;
        //new TWEEN.Tween(digit.rotation)
        //    .to({x: -r, y: 0, z: 0},
        //    2000+4000*Math.random())
        //    .easing(TWEEN.Easing.Exponential.InOut)
        //    .start();

        // 添加数字卡片至元件
        this.obj.add(digit);
    }

    this.build = function() {
        this.omiga = 0;
        this.obj.children.forEach(function (digit, index) {
            // 当前数字卡片的角度（10个数字均分360°）
            var r = Math.PI * index / 5;
            // 开头位置缓动效果
            new TWEEN.Tween(digit.position)
                .to({x: 0, y: radius * Math.sin(r), z: radius * Math.cos(r)},
                2000+4000*Math.random())
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            // 开头角度缓动效果
            new TWEEN.Tween(digit.rotation)
                .to({x: -r, y: 0, z: 0},
                2000+4000*Math.random())
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        })
    };

    this.free = function () {
        this.obj.children.forEach(function (digit) {
            // 结束位置缓动效果
            new TWEEN.Tween(digit.position)
                .to({
                    x: 2000 * Math.random() - 1000,
                    y: 2000 * Math.random() - 1000,
                    z: 2000 * Math.random() - 1000
                }, 2000+4000*Math.random())
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            // 结束角度缓动效果
            new TWEEN.Tween(digit.rotation)
                .to({
                    x: 8 * Math.random() - 4,
                    y: 8 * Math.random() - 4,
                    z: 8 * Math.random() - 4
                }, 2000+4000*Math.random())
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        });
        this.omiga = 0.001;
    };

    this.update = function() {
        var alpha = 0;
        this.obj.rotation.x += this.omiga;
        var r = this.obj.rotation.x;
        for (var i = 0; i < 10; ++i, r -= Math.PI/5) {
            alpha = 0.4 + 0.5 * Math.cos(r);
            this.obj.children[i].element.style.opacity = alpha.toString();
            this.obj.children[i].element.style.filter = 'alpha(opacity='+(alpha*100).toString()+')';
        }
        if (action == 0) {
            if (this.omiga < this.OMIGA) {
                this.omiga += this.beta;
            }
            if(this.omiga > this.OMIGA) {
                this.omiga = this.OMIGA;
            }
        } else if (action == 1) {
            if (this.omiga > 0) {
                this.omiga -= this.beta2;
                if(this.omiga < 0) this.omiga = 0;
            }
        }
    };

    this.run = function () {
        this.OMIGA = 0.20;      // max angle speed
        this.omiga = -0.008;         // current angle speed
        this.beta  = 0.0025;    // angle speed's speed when speed up
        this.beta2 = 0.0015;    // angle speed's speed when speed down
        action = 0;
    };

    this.stop = function() {
        var phi = this.target * Math.PI / 5;
        this.beta2 = (this.omiga * this.omiga) /
        (2 * WAIT * Math.PI + 2 * (phi - (this.obj.rotation.x+0.11) % (2 * Math.PI)));
        console.log(this.beta2);
        action = 1;
    };
};
var reels = [];
function refresh() {
    reels.forEach(function (ele) {
        ele.action = 1;
        ele.omiga = 0;         // current angle speed
        ele.beta  = 0;    // angle speed's speed when speed up
        ele.beta2 = 0;    // angle speed's speed when speed down
        ele.obj.rotation.x =
            (ele.obj.rotation.x % (2 * Math.PI) + Math.PI + Math.PI) % (2 * Math.PI);
        new TWEEN.Tween(ele.obj.rotation)
            .to({x:0}, 1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        //ele.obj.rotation.x = 0;
    });
}

function run() {
    reels.forEach(function (ele, index) {
        setTimeout(function () {
            ele.run();
        },250*index);
    })
}

function stop() {
    var luckyStar = getLuckyStar();
    var luckyName = luckyStar.name;
    luckyStar = luckyStar.id;
    reels.forEach(function(ele, index) {
        setTimeout(function () {
            ele.target = parseInt(luckyStar[index]);
            ele.stop();
        },1500*index);
    });
}

function build() {
    TWEEN.removeAll();
    reels.forEach(function (ele) {
        ele.build();
    });
}

function free() {
    TWEEN.removeAll();
    reels.forEach(function (ele) {
        ele.free();
    });
}

var start = function() {
    var scene = new THREE.Scene();
    for (var i = 0; i < 8; ++i) {
        var reel = new Reel();
        reel.obj.position.x = 140 * i - 490;
        reel.obj.rotation.x = 0;

        scene.add(reel.obj);
        reels.push(reel);
    }

    var renderer = new THREE.CSS3DRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1, 1000
    );
    camera.position.z = 1000;
    var render = function() {
        requestAnimationFrame(render);
        for (var i = 0; i < 8; ++i) {
            reels[i].update();
        }
        TWEEN.update();
        renderer.render(scene, camera);
    };
    //refresh();
    render();
    window.onkeydown = function (event) {
        console.log(event.keyCode);
        switch(event.keyCode) {
            case 13: //回车键
                stop();
                break;
            case 32: //空格键
                refresh();
                break;
            case 82: //R键
                run();
                break;
            case 66: //B键
                build();
                break;
            case 69: //E键
                free();
                break;
        }
    };

    window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
};

window.onload = start;