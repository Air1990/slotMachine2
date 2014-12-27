var createReel = function() {
    var radius = 300;
    
    var obj = new THREE.Object3D();
    
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
        
        obj.add(digit);
    }
    
    obj.renew = function() {
        var alpha = 0;
        for (var i = 0, r = obj.rotation.x; i < 10; ++i, r -= Math.PI/5) {
            alpha = 0.4 + 0.5 * Math.cos(r);
            obj.children[i].element.style.opacity = alpha.toString();
            obj.children[i].element.style.filter = 'alpha(opacity='+(alpha*100).toString()+')';
            //r -= Math.PI/5;
        }
    };
    
    return obj;
};

window.onload = function() {
    var scene = new THREE.Scene();
    
    var reels = [];
    for (var i = 0; i < 8; ++i) {
        var reel = createReel();
        reel.position.x = 140 * i - 490;
        reel.rotation.x = 0;
        scene.add(reel);
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
//    var camera = new THREE.OrthographicCamera(
//        75,
//        window.innerWidth / window.innerHeight,
//        0.1, 1000
//    );
    camera.position.z = 1200;

    var render = function() {
        requestAnimationFrame(render);
        for(var i in reels) {
            reels[i].rotation.x += 0.010;//+0.003*i;
            reels[i].renew();
        }
        renderer.render(scene, camera);
    };

    render();
    
    // testing
//    var bg = document.getElementById('bg');
//    var ctx = bg.getContext('2d');
//    
//    ctx.fillStyle = 'rgba(200,200,200,1)';
//    ctx.fillRect(0, 0, 200, 40);
    
    window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
};
