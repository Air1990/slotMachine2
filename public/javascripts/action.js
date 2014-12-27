var Reel = function(t) {
    var radius = 300;

    this.obj = new THREE.Object3D();

    this.target = t || 0;   // the target number to stop at

    this.OMIGA = 0.20;      // max angle speed
    this.omiga = 0;         // current angle speed
    this.beta  = 0.0005;    // angle speed's speed when speed up
    this.beta2 = 0.0005;    // angle speed's speed when speed down

    var action = 0;        // 0 -- running; 1 -- stop

    for (var i = 0; i < 10; ++i) {
        var div = document.createElement('div');
        div.className = 'digit';

        var span = document.createElement('span');
        span.textContent = i.toString();
        div.appendChild(span);

        var digit = new THREE.CSS3DObject(div);
        var r = Math.PI * i / 5;
        digit.position.x = 0;
        digit.position.y = radius * Math.sin(r);
        digit.position.z = radius * Math.cos(r);
        digit.rotation.x = -r;

        this.obj.add(digit);
    }

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
        action = 0;
    };

    this.stop = function() {
        var phi = this.target * Math.PI / 5;
        this.beta2 = (this.omiga * this.omiga) /
        (40 * Math.PI + 2 * (phi - this.obj.rotation.x) % (2 * Math.PI));
        console.log(this.beta2);
        action = 1;
    };

    this.isRunning = function() {
        return action == 0;
    };
};

var start = function() {
    var scene = new THREE.Scene();

    var reels = [];
    for (var i = 0; i < 8; ++i) {
        var reel = new Reel(i);
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
    camera.position.z = 1200;

    //var v = [.010, .015, .020, .025, .030, .035, .040, .045];
    var v = [.015, .015, .015, .015, .015, .015, .015, .015];
    var render = function() {
        requestAnimationFrame(render);

        for (var i = 0; i < 8; ++i) {
            reels[i].update();
        }

        //document.getElementById('log').innerHTML = Math.round(reels[7].rotation.x).toString();

        renderer.render(scene, camera);
    };

    render();
    window.onkeydown = function (event) {
        if(event.keyCode = 13) {
            reels.forEach(function(ele, index) {
                console.log(index);
                setTimeout(function () {
                    ele.stop();
                },1000*index);
            });
        }
    };
    //window.addEventListener('keydown', function() {
    //    for (var i = 0; i < 8; ++i) {
    //        //reels[i].action = 1^reels[i].action;
    //        //if (reels[i].isRunning()) {
    //        reels[i].stop();
    //        //} else {
    //        //    reels[i].run();
    //        //}
    //    }
    //});

    window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
};

window.onload = start;