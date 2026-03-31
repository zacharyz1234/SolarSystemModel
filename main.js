import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Timer } from 'three';

//TO DO

/*
1. Create all planets
    Earth
    Mars
    Jupiter (Only doing the major moons unless I get REALLY bored)
    Saturn (Only doing major moons)
    Uranus
    Neptune

2. Create all moons
    The Moon

    Deimos
    Phobos

    IO
    Europa
    Ganymede
    Callisto

    Titan
    Enceladus
    Iapetus
    Mimas

    Titania
    Oberon
    Ariel
    Umbriel
    Miranda

    Triton
    Proteus
    Nereid
    Larissa

3. Figure out how to code the rings of saturn

4. Code in rotation for everything

5. Code in movement for everything

6. Lighting

*/



let app = {
    el: document.getElementById("app"),
    scene: null,
    renderer: null,
    camera: null
}

//Sets a global variable so that the timer can
//be used in all of the code
let time;
//Elapsed time lets time be accumulated for the moon
//being able to move on the circular radius
let elapsedTime = 0;

const init = () => {

    app.renderer = new THREE.WebGLRenderer();
    console.log(app.renderer);
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    app.el.appendChild(app.renderer.domElement);

    app.scene = new THREE.Scene();
    app.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
    app.controls = new OrbitControls(app.camera, app.renderer.domElement);

   createGeometry();

    app.camera.position.z = 20000;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 2);
    app.scene.add(light);

}

const render = () => {

    requestAnimationFrame(render);

    //Updates the time to hold the delta in its
    //variable each render frame
    // time.update();
    // const delta = time.getDelta();
    // elapsedTime += delta;
    
    app.renderer.render(app.scene, app.camera);
    app.controls.update();
};

function createGeometry(){

    //Create the skybox
    const starGeometry = new THREE.SphereGeometry(400000, 64, 64);
    const starTexture = new THREE.TextureLoader().load("/stars.jpg");
    const starMaterial = new THREE.MeshBasicMaterial({map: starTexture, side: THREE.BackSide});
    const starSphere = new THREE.Mesh(starGeometry, starMaterial);
    app.scene.add(starSphere);  

    //Create the sun
    const sunGeometry = new THREE.SphereGeometry(10000, 32, 32);
    const sunTexture = new THREE.TextureLoader().load("sun.jpg");
    const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
    const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
    app.scene.add(sunSphere);

     //Create Mercury
    const merGeometry = new THREE.SphereGeometry(100, 32, 32);
    const merTexture = new THREE.TextureLoader().load("mercury.jpg");
    const merMaterial = new THREE.MeshStandardMaterial({map: merTexture});
    const merSphere = new THREE.Mesh(merGeometry, merMaterial);
    app.scene.add(merSphere);
    merSphere.position.x = 11650;

    //Create Venus
    const venGeometry = new THREE.SphereGeometry(300, 32, 32);
    const venTexture = new THREE.TextureLoader().load("venus.jpeg");
    const venMaterial = new THREE.MeshStandardMaterial({map: venTexture});
    const venSphere = new THREE.Mesh(venGeometry, venMaterial);
    app.scene.add(venSphere);
    venSphere.position.x = 13150;

    //Create Earth
    const earthGeometry = new THREE.SphereGeometry(320, 32, 32);
    const earthTexture = new THREE.TextureLoader().load("earth.jpg");
    const earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture});
    const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
    app.scene.add(earthSphere);
    earthSphere.position.x = 15650;

    //Create Mars
    const marsGeometry = new THREE.SphereGeometry(150, 32, 32);
    const marsTexture = new THREE.TextureLoader().load("mars.jpg");
    const marsMaterial = new THREE.MeshStandardMaterial({map: marsTexture});
    const marsSphere = new THREE.Mesh(marsGeometry, marsMaterial);
    app.scene.add(marsSphere);
    marsSphere.position.x = 18150;

    //Create Jupiter
    const jupGeometry = new THREE.SphereGeometry(1000, 32, 32);
    const jupTexture = new THREE.TextureLoader().load("jupiter.jpg");
    const jupMaterial = new THREE.MeshStandardMaterial({map: jupTexture});
    const jupSphere = new THREE.Mesh(jupGeometry, jupMaterial);
    app.scene.add(jupSphere);
    jupSphere.position.x = 21650;

    //Create Saturn
    const satGeometry = new THREE.SphereGeometry(900, 32, 32);
    const satTexture = new THREE.TextureLoader().load("saturn.jpg");
    const satMaterial = new THREE.MeshStandardMaterial({map: satTexture});
    const satSphere = new THREE.Mesh(satGeometry, satMaterial);
    app.scene.add(satSphere);
    satSphere.position.x = 25650;

    //Create Saturn's rings
    const saturnRing = new THREE.RingGeometry(1000, 1800, 128);
    const ringTexture = new THREE.TextureLoader().load("saturnRings.png");
    const ringMaterial = new THREE.MeshStandardMaterial({map: ringTexture, side: THREE.DoubleSide, transparent: true});
    const ring = new THREE.Mesh(saturnRing, ringMaterial);
    app.scene.add(ring);

    //Saturn ring UV wrapping
    const positions = ring.geometry.attributes.position;
    const uvs = ring.geometry.attributes.uv;
    for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    uvs.setXY(i, (x / 2500 + 1) / 2, (y / 2500 + 1) / 2);
    }
    uvs.needsUpdate = true;
    //-------------------------
    ring.rotation.x = Math.PI / 2;
    ring.position.x = satSphere.position.x;
    
    //Create Uranus
    const uraGeometry = new THREE.SphereGeometry(600, 32, 32);
    const uraTexture = new THREE.TextureLoader().load("uranus.jpg");
    const uraMaterial = new THREE.MeshStandardMaterial({map: uraTexture});
    const uraSphere = new THREE.Mesh(uraGeometry, uraMaterial);
    app.scene.add(uraSphere);
    uraSphere.position.x = 29150;

    const nepGeometry = new THREE.SphereGeometry(600, 32, 32);
    const nepTexture = new THREE.TextureLoader().load("neptune.jpg");
    const nepMaterial = new THREE.MeshStandardMaterial({map: nepTexture});
    const nepSphere = new THREE.Mesh(nepGeometry, nepMaterial);
    app.scene.add(nepSphere);
    nepSphere.position.x = 32150;



}


init();
render();
