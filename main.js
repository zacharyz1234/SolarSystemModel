import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Timer } from 'three';

//TO DO

/*
1. Create all planets
    Venus
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

4. Adjust Lighting

5. Code in rotation for everything

6. Code in movement for everything

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

    //Create the skybox
    const starGeometry = new THREE.SphereGeometry(100000, 64, 64);
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
    const merGeometry = new THREE.SphereGeometry(300, 32, 32);
    const merTexture = new THREE.TextureLoader().load("mercury.jpg");
    const merMaterial = new THREE.MeshStandardMaterial({map: merTexture});
    const merSphere = new THREE.Mesh(merGeometry, merMaterial);
    app.scene.add(merSphere);
    merSphere.position.x = 12000;

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

init();
render();