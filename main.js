import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Timer } from 'three';


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
    app.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    app.controls = new OrbitControls(app.camera, app.renderer.domElement);

    //Create the skybox
    const starGeometry = new THREE.SphereGeometry(512, 32, 32);
    const starTexture = new THREE.TextureLoader().load("/stars.jpg");
    const starMaterial = new THREE.MeshBasicMaterial({map: starTexture, side: THREE.BackSide});
    const starSphere = new THREE.Mesh(starGeometry, starMaterial);
    app.scene.add(starSphere);  

    app.camera.position.z = 100;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 2);
    app.scene.add(light);

    

}

const render = () => {

    requestAnimationFrame(render);

    //Updates the time to hold the delta in its
    //variable each render frame
    time.update();
    const delta = time.getDelta();


    elapsedTime += delta;
    
    app.renderer.render(app.scene, app.camera);
    app.controls.update();
};

init();
render();