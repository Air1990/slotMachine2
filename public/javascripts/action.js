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
        reel.mesh
        
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
        scene.updateMatrixWorld();

        reels[0].rotation.x += 0.010;
        reels[1].rotation.x += 0.013;
        reels[2].rotation.x += 0.016;
        reels[3].rotation.x += 0.019;
        reels[4].rotation.x += 0.022;
        reels[5].rotation.x += 0.025;
        reels[6].rotation.x += 0.028;
        reels[7].rotation.x += 0.031;
        
        //var vector = new THREE.Vector3();
        //vector.setFromMatrixPosition(reels[0].children[0].matrixWorld);
        reels[0].renew();
        reels[1].renew();
        reels[2].renew();
        reels[3].renew();
        reels[4].renew();
        reels[5].renew();
        reels[6].renew();
        reels[7].renew();
        
        document.getElementById('log').innerHTML = Math.round(reels[7].rotation.x).toString();

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
