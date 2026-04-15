import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Timer } from 'three';

//TO DO

/*
Create all moons
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

4. Code in rotation for everything
    orbitRings will rotate with planets

5. Code in movement for everything
    Planets need proper rotation
    

6. Lighting - DONE

7. Add UI elements
    Speed up button
    pause button
    Orbit ring toggle
    Pop out menu that lets you click a planet

8. Ability to click the planets themselves

9. Program my own camera movement

*/



let app = {
    el: document.getElementById("app"),
    scene: null,
    renderer: null,
    camera: null
}

//Sets a global variable so that the timer can
//be used in all of the code
let time = new THREE.Clock;
//Elapsed time lets time be accumulated for the moon
//being able to move on the circular radius
let elapsedTime = 0;

//The point the camera should point around
let cameraTarger = new THREE.Vector3(0, 0, 0);

//Holds the planet name that the camera is locked
//on to if it is locked onto a planet. It is
//initialized as null since it isn't locked at
//start of the program
let lockedPlanet = null;

//Stores the orbit angle and distance
let spherical = new THREE.Spherical();

//Boolean to let the code know if the
//camera is being dragged by mouse
let isDragging = false;

let prevMouse = {x: 0, y: 0}

const init = () => {

    app.renderer = new THREE.WebGLRenderer();
    console.log(app.renderer);
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    app.el.appendChild(app.renderer.domElement);

    app.scene = new THREE.Scene();
    app.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
    app.controls = new OrbitControls(app.camera, app.renderer.domElement);

    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    createPlanetGeometry();
    createMoonGeometry();
    createOrbitRings();

    app.camera.position.x = 40000;
    spherical.setFromVector3(app.camera.position);
    

    const sunLight = new THREE.PointLight(0xffffff, 3, 0, 0);
    sunLight.position.set(0, 0, 0);
    app.scene.add(sunLight);
    
    const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
    app.scene.add(ambLight);

    sunLight.castShadow = true;
    sunLight.shadow.camera.far = 100000;
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
}

let speed = 10;
let pause = false;
let ringsVisible = true;

//Sets speed to the value indicated by the slider in
//index.html
document.getElementById("speedSlider").addEventListener("input", (e) =>
{
    speed = e.target.value;
})

//Updates the pause boolean if the pause button
//is clicked. Also stops the timer if it is clicked
document.getElementById("pauseButton").addEventListener("click", () =>
{
    pause = !pause;
    //When paused, the time needs to stop
    //so planets don't jump ahead
    if(pause)
    {
        time.stop();
    }
    else
    {
        time.start();
    }
})

document.getElementById("orbitToggle").addEventListener("click", () =>
{
    ringsVisible = !ringsVisible;

    const ringNames = ["orbitMer", "orbitVen", "orbitEarth", "orbitMars",
                        "orbitJup", "orbitSat", "orbitUra", "orbitNep"];

    for(let i = 0; i < ringNames.length; i++)
    {
        const ring = app.scene.getObjectByName(ringNames[i]);
        if(ring)
        {
            ring.visible = ringsVisible;
        }
    }
})

const render = () => {

    requestAnimationFrame(render);

    if(!pause)
    {
        // Updates the time to hold the delta in its
        // variable each render frame
        const delta = time.getDelta();
        elapsedTime += delta * speed;
        planetMovement(speed);
        moonMovement();
        planetRotation(speed, delta);
    }
    
    app.renderer.render(app.scene, app.camera);
    app.controls.update();
};

//Creating rings equal to the radius of each planet so it
//is a little nicer to look at
function createOrbitRings()
{
    //Mercury
    const orbitMerGeometry = new THREE.RingGeometry(11645, 11655, 128);
    const orbitRingMaterial = new THREE.MeshBasicMaterial({color: 0x808080, transparent: true, side: THREE.DoubleSide})
    const orbitRingMer = new THREE.Mesh(orbitMerGeometry, orbitRingMaterial);
    orbitRingMer.rotation.x = Math.PI / 2 + (7.0 * Math.PI / 180);
    orbitRingMer.name = "orbitMer";
    app.scene.add(orbitRingMer);

    //Venus
    const orbitVenGeometry = new THREE.RingGeometry(13145, 13155, 128);
    const orbitRingVen = new THREE.Mesh(orbitVenGeometry, orbitRingMaterial);
    orbitRingVen.rotation.x = Math.PI / 2 + (3.4 * Math.PI / 180);
    orbitRingVen.name = "orbitVen";
    app.scene.add(orbitRingVen);

    //Earth
    const orbitEarthGeometry = new THREE.RingGeometry(15645, 15655, 128);
    const orbitRingEarth = new THREE.Mesh(orbitEarthGeometry, orbitRingMaterial);
    orbitRingEarth.rotation.x = Math.PI / 2 + (0 * Math.PI / 180);
    orbitRingEarth.name = "orbitEarth";
    app.scene.add(orbitRingEarth);

    //Mars
    const orbitMarsGeometry = new THREE.RingGeometry(18145, 18155, 128);
    const orbitRingMars = new THREE.Mesh(orbitMarsGeometry, orbitRingMaterial);
    orbitRingMars.rotation.x = Math.PI / 2 + (1.85 * Math.PI / 180);
    orbitRingMars.name = "orbitMars";
    app.scene.add(orbitRingMars);

    //Jupiter
    const orbitJupGeometry = new THREE.RingGeometry(21645, 21655, 128);
    const orbitRingJup = new THREE.Mesh(orbitJupGeometry, orbitRingMaterial);
    orbitRingJup.rotation.x = Math.PI / 2 + (1.3 * Math.PI / 180);
    orbitRingJup.name = "orbitJup";
    app.scene.add(orbitRingJup);

    //Saturn
    const orbitSatGeometry = new THREE.RingGeometry(25655, 25665, 128);
    const orbitRingSat = new THREE.Mesh(orbitSatGeometry, orbitRingMaterial);
    orbitRingSat.rotation.x = Math.PI / 2 + (2.49 * Math.PI / 180);
    orbitRingSat.name = "orbitSat";
    app.scene.add(orbitRingSat);

    //Uranus
    const orbitUraGeometry = new THREE.RingGeometry(29145, 29155, 128);
    const orbitRingUra = new THREE.Mesh(orbitUraGeometry, orbitRingMaterial);
    orbitRingUra.rotation.x = Math.PI / 2 + (0.77 * Math.PI / 180);
    orbitRingUra.name = "orbitUra";
    app.scene.add(orbitRingUra);

    //Neptune
    const orbitNepGeometry = new THREE.RingGeometry(32145, 32155, 128);
    const orbitRingNep = new THREE.Mesh(orbitNepGeometry, orbitRingMaterial);
    orbitRingNep.rotation.x = Math.PI / 2 + (1.77 * Math.PI / 180);
    orbitRingNep.name = "orbitNep";
    app.scene.add(orbitRingNep);
}

function planetRotation(speed, delta)
{
    app.scene.getObjectByName("sun").rotation.y += delta * 0.01 * (3.14159 / 180) * speed;

    app.scene.getObjectByName("mercury").rotation.y += delta * 0.025 * (3.14159 / 180) * speed;

    app.scene.getObjectByName("venus").rotation.y -= delta * 0.006 * (3.14159 / 180) * speed;

    app.scene.getObjectByName("earth").rotation.y += delta * 1.5 * (3.14159 / 180) * speed;

    app.scene.getObjectByName("mars").rotation.y += delta * 1.46 * (3.14159 / 180) * speed;

    app.scene.getObjectByName("jupiter").rotation.y += delta * 3.6 * (3.14159 / 180) * speed;

    app.scene.getObjectByName("saturn").rotation.y += delta * 3.3 * (3.14159 / 180) * speed;

    app.scene.getObjectByName("uranus").rotation.y += delta * 2.1 * (3.14159 / 180) * speed;

    app.scene.getObjectByName("neptune").rotation.y += delta * 2.25 * (3.14159 / 180) * speed;

}

const planetData = 
[
    {name: "mercury", w: 1.6, r: 11650, inc: 7.0},
    {name: "venus", w: 1.2, r: 13150, inc: 3.4},
    {name: "earth", w: 1, r: 15650, inc: 0},
    {name: "mars", w: 0.8, r: 18150, inc: 1.85},
    {name: "jupiter", w: 0.4, r: 21650, inc: 1.3},
    {name: "saturn", w: 0.3, r: 25650, inc: 2.49},
    {name: "uranus", w: 0.2, r: 29150, inc: 0.77},
    {name: "neptune", w: 0.18, r: 32150, inc: 1.77},
]

function planetMovement(speed)
{
    planetData.forEach(p => 
    {
        const obj = app.scene.getObjectByName(p.name);
        const w = p.w * (Math.PI / 180);
        const inc = p.inc * (Math.PI / 180);
        const angle = w * elapsedTime;
        obj.position.x = p.r * Math.cos(angle);
        obj.position.z = -p.r * Math.sin(angle) * Math.cos(inc);
        obj.position.y = p.r * Math.sin(angle) * Math.sin(inc);
    });

    const saturn = app.scene.getObjectByName("saturn");
    const ring = app.scene.getObjectByName("saturn_ring");
    ring.position.copy(saturn.position);
}

function createPlanetGeometry()
{

    //Create the skybox
    const starGeometry = new THREE.SphereGeometry(400000, 64, 64);
    const starTexture = new THREE.TextureLoader().load("/stars.jpg");
    const starMaterial = new THREE.MeshBasicMaterial({map: starTexture, side: THREE.BackSide});
    const starSphere = new THREE.Mesh(starGeometry, starMaterial);
    app.scene.add(starSphere);  
    starSphere.castShadow = false;
    starSphere.receiveShadow = false;

    //Create the sun
    const sunGeometry = new THREE.SphereGeometry(10000, 32, 32);
    const sunTexture = new THREE.TextureLoader().load("sun.jpg");
    const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
    const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
    app.scene.add(sunSphere);
    sunSphere.name = "sun";
    sunSphere.castShadow = false;
    sunSphere.receiveShadow = false;

     //Create Mercury
    const merGeometry = new THREE.SphereGeometry(100, 32, 32);
    const merTexture = new THREE.TextureLoader().load("mercury.jpg");
    const merMaterial = new THREE.MeshStandardMaterial({map: merTexture});
    const merSphere = new THREE.Mesh(merGeometry, merMaterial);
    app.scene.add(merSphere);
    merSphere.name = "mercury";
    merSphere.castShadow = true;
    merSphere.receiveShadow = true;
    merSphere.position.x = 11650;

    //Create Venus
    const venGeometry = new THREE.SphereGeometry(300, 32, 32);
    const venTexture = new THREE.TextureLoader().load("venus.jpeg");
    const venMaterial = new THREE.MeshStandardMaterial({map: venTexture});
    const venSphere = new THREE.Mesh(venGeometry, venMaterial);
    app.scene.add(venSphere);
    venSphere.name = "venus";
    venSphere.castShadow = true;
    venSphere.receiveShadow = true;
    venSphere.position.x = 13150;

    //Create Earth
    const earthGeometry = new THREE.SphereGeometry(320, 32, 32);
    const earthTexture = new THREE.TextureLoader().load("earth.jpg");
    const earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture});
    const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
    app.scene.add(earthSphere);
    earthSphere.name = "earth";
    earthSphere.castShadow = true;
    earthSphere.receiveShadow = true;
    earthSphere.position.x = 15650;

    //Create Mars
    const marsGeometry = new THREE.SphereGeometry(150, 32, 32);
    const marsTexture = new THREE.TextureLoader().load("mars.jpg");
    const marsMaterial = new THREE.MeshStandardMaterial({map: marsTexture});
    const marsSphere = new THREE.Mesh(marsGeometry, marsMaterial);
    app.scene.add(marsSphere);
    marsSphere.name = "mars";
    marsSphere.castShadow = true;
    marsSphere.receiveShadow = true;
    marsSphere.position.x = 18150;

    //Create Jupiter
    const jupGeometry = new THREE.SphereGeometry(1000, 32, 32);
    const jupTexture = new THREE.TextureLoader().load("jupiter.jpg");
    const jupMaterial = new THREE.MeshStandardMaterial({map: jupTexture});
    const jupSphere = new THREE.Mesh(jupGeometry, jupMaterial);
    app.scene.add(jupSphere);
    jupSphere.name = "jupiter";
    jupSphere.castShadow = true;
    jupSphere.receiveShadow = true;
    jupSphere.position.x = 21650;

    //Create Saturn
    const satGeometry = new THREE.SphereGeometry(900, 32, 32);
    const satTexture = new THREE.TextureLoader().load("saturn.jpg");
    const satMaterial = new THREE.MeshStandardMaterial({map: satTexture});
    const satSphere = new THREE.Mesh(satGeometry, satMaterial);
    app.scene.add(satSphere);
    satSphere.castShadow = true;
    satSphere.receiveShadow = true;
    satSphere.name = "saturn";
    satSphere.position.x = 25650;

    //Create Saturn's rings
    const saturnRing = new THREE.RingGeometry(1000, 1800, 128);
    const ringTexture = new THREE.TextureLoader().load("saturnRings.png");
    const ringMaterial = new THREE.MeshStandardMaterial({map: ringTexture, side: THREE.DoubleSide, transparent: true});
    const ring = new THREE.Mesh(saturnRing, ringMaterial);
    ring.name = "saturn_ring";
    ring.castShadow = false;
    ring.receiveShadow = true;
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
    uraSphere.name = "uranus";
    uraSphere.castShadow = true;
    uraSphere.receiveShadow = true;
    uraSphere.position.x = 29150;

    //Create Neptune
    const nepGeometry = new THREE.SphereGeometry(600, 32, 32);
    const nepTexture = new THREE.TextureLoader().load("neptune.jpg");
    const nepMaterial = new THREE.MeshStandardMaterial({map: nepTexture});
    const nepSphere = new THREE.Mesh(nepGeometry, nepMaterial);
    app.scene.add(nepSphere);
    nepSphere.name = "neptune";
    nepSphere.castShadow = true;
    nepSphere.receiveShadow = true;
    nepSphere.position.x = 32150;



}

function createMoonGeometry()
{
    //The moon
    const moonGeometry = new THREE.SphereGeometry(80, 32, 32);
    const moonTexture = new THREE.TextureLoader().load("moon.jpg");
    const moonMaterial = new THREE.MeshStandardMaterial({map: moonTexture});
    const moonSphere = new THREE.Mesh(moonGeometry, moonMaterial);
    moonSphere.name = "moon";
    moonSphere.castShadow = true;
    moonSphere.receiveShadow = true;
    app.scene.add(moonSphere);

    //Deimos
    const deimosGeometry = new THREE.SphereGeometry(20, 32, 32);
    const deimosTexture = new THREE.TextureLoader().load("deimos.jpg");
    const deimosMaterial = new THREE.MeshStandardMaterial({map: deimosTexture});
    const deimosSphere = new THREE.Mesh(deimosGeometry, deimosMaterial);
    deimosSphere.name = "deimos";
    deimosSphere.castShadow = true;
    deimosSphere.receiveShadow = true;
    app.scene.add(deimosSphere);

    //Phobos
    const phobosGeometry = new THREE.SphereGeometry(15, 32, 32);
    const phobosTexture = new THREE.TextureLoader().load("phobos.jpg");
    const phobosMaterial = new THREE.MeshStandardMaterial({map: phobosTexture});
    const phobosSphere = new THREE.Mesh(phobosGeometry, phobosMaterial);
    phobosSphere.name = "phobos";
    phobosSphere.castShadow = true;
    phobosSphere.receiveShadow = true;
    app.scene.add(phobosSphere);

    //IO
    const ioGeometry = new THREE.SphereGeometry(80, 32, 32);
    const ioTexture = new THREE.TextureLoader().load("io.jpeg");
    const ioMaterial = new THREE.MeshStandardMaterial({map: ioTexture});
    const ioSphere = new THREE.Mesh(ioGeometry, ioMaterial);
    ioSphere.name = "io";
    ioSphere.castShadow = true;
    ioSphere.receiveShadow = true;
    app.scene.add(ioSphere);

    //Europa
    const eurGeometry = new THREE.SphereGeometry(70, 32, 32);
    const eurTexture = new THREE.TextureLoader().load("europa.jpg");
    const eurMaterial = new THREE.MeshStandardMaterial({map: eurTexture});
    const eurSphere = new THREE.Mesh(eurGeometry, eurMaterial);
    eurSphere.name = "europa";
    eurSphere.castShadow = true;
    eurSphere.receiveShadow = true;
    app.scene.add(eurSphere);

    //Ganymede
    const ganyGeometry = new THREE.SphereGeometry(100, 32, 32);
    const ganyTexture = new THREE.TextureLoader().load("ganymede.jpg");
    const ganyMaterial = new THREE.MeshStandardMaterial({map: ganyTexture});
    const ganySphere = new THREE.Mesh(ganyGeometry, ganyMaterial);
    ganySphere.name = "ganymede";
    ganySphere.castShadow = true;
    ganySphere.receiveShadow = true;
    app.scene.add(ganySphere);

    //Callisto
    const calGeometry = new THREE.SphereGeometry(90, 32, 32);
    const calTexture = new THREE.TextureLoader().load("callisto.jpg");
    const calMaterial = new THREE.MeshStandardMaterial({map: calTexture});
    const calSphere = new THREE.Mesh(calGeometry, calMaterial);
    calSphere.name = "callisto";
    calSphere.castShadow = true;
    calSphere.receiveShadow = true;
    app.scene.add(calSphere);

    //Titan
    const titanGeometry = new THREE.SphereGeometry(90, 32, 32);
    const titanTexture = new THREE.TextureLoader().load("titan.jpg");
    const titanMaterial = new THREE.MeshStandardMaterial({map: titanTexture});
    const titanSphere = new THREE.Mesh(titanGeometry, titanMaterial);
    titanSphere.name = "titan";
    titanSphere.castShadow = true;
    titanSphere.receiveShadow = true;
    app.scene.add(titanSphere);

    //Enceladus
    const encGeometry = new THREE.SphereGeometry(30, 32, 32);
    const encTexture = new THREE.TextureLoader().load("enceladus.jpg");
    const encMaterial = new THREE.MeshStandardMaterial({map: encTexture});
    const encSphere = new THREE.Mesh(encGeometry, encMaterial);
    encSphere.name = "enceladus";
    encSphere.castShadow = true;
    encSphere.receiveShadow = true;
    app.scene.add(encSphere);

    //Iapetus
    const iapGeometry = new THREE.SphereGeometry(40, 32, 32);
    const iapTexture = new THREE.TextureLoader().load("iapetus.jpg");
    const iapMaterial = new THREE.MeshStandardMaterial({map: iapTexture});
    const iapSphere = new THREE.Mesh(iapGeometry, iapMaterial);
    iapSphere.name = "iapetus";
    iapSphere.castShadow = true;
    iapSphere.receiveShadow = true;
    app.scene.add(iapSphere);

    //Mimas
    const mimGeometry = new THREE.SphereGeometry(25, 32, 32);
    const mimTexture = new THREE.TextureLoader().load("mimas.jpg");
    const mimMaterial = new THREE.MeshStandardMaterial({map: mimTexture});
    const mimSphere = new THREE.Mesh(mimGeometry, mimMaterial);
    mimSphere.name = "mimas";
    mimSphere.castShadow = true;
    mimSphere.receiveShadow = true;
    app.scene.add(mimSphere);

    //Titania
    const titaniaGeometry = new THREE.SphereGeometry(50, 32, 32);
    const titaniaTexture = new THREE.TextureLoader().load("titania.jpg");
    const titaniaMaterial = new THREE.MeshStandardMaterial({map: titaniaTexture});
    const titaniaSphere = new THREE.Mesh(titaniaGeometry, titaniaMaterial);
    titaniaSphere.name = "titania";
    titaniaSphere.castShadow = true;
    titaniaSphere.receiveShadow = true;
    app.scene.add(titaniaSphere);

    //Oberon
    const obeGeometry = new THREE.SphereGeometry(45, 32, 32);
    const obeTexture = new THREE.TextureLoader().load("oberon.png");
    const obeMaterial = new THREE.MeshStandardMaterial({map: obeTexture});
    const obeSphere = new THREE.Mesh(obeGeometry, obeMaterial);
    obeSphere.name = "oberon";
    obeSphere.castShadow = true;
    obeSphere.receiveShadow = true;
    app.scene.add(obeSphere);

    //Ariel
    const ariGeometry = new THREE.SphereGeometry(35, 32, 32);
    const ariTexture = new THREE.TextureLoader().load("ariel.png");
    const ariMaterial = new THREE.MeshStandardMaterial({map: ariTexture});
    const ariSphere = new THREE.Mesh(ariGeometry, ariMaterial);
    ariSphere.name = "ariel";
    ariSphere.castShadow = true;
    ariSphere.receiveShadow = true;
    app.scene.add(ariSphere);

    //Umbriel
    const umbGeometry = new THREE.SphereGeometry(35, 32, 32);
    const umbTexture = new THREE.TextureLoader().load("umbriel.png");
    const umbMaterial = new THREE.MeshStandardMaterial({map: umbTexture});
    const umbSphere = new THREE.Mesh(umbGeometry, umbMaterial);
    umbSphere.name = "umbriel";
    umbSphere.castShadow = true;
    umbSphere.receiveShadow = true;
    app.scene.add(umbSphere);

    //Miranda
    const mirGeometry = new THREE.SphereGeometry(20, 32, 32);
    const mirTexture = new THREE.TextureLoader().load("miranda.jpg");
    const mirMaterial = new THREE.MeshStandardMaterial({map: mirTexture});
    const mirSphere = new THREE.Mesh(mirGeometry, mirMaterial);
    mirSphere.name = "miranda";
    mirSphere.castShadow = true;
    mirSphere.receiveShadow = true;
    app.scene.add(mirSphere);

    //Triton
    const triGeometry = new THREE.SphereGeometry(60, 32, 32);
    const triTexture = new THREE.TextureLoader().load("triton.jpg");
    const triMaterial = new THREE.MeshStandardMaterial({map: triTexture});
    const triSphere = new THREE.Mesh(triGeometry, triMaterial);
    triSphere.name = "triton";
    triSphere.castShadow = true;
    triSphere.receiveShadow = true;
    app.scene.add(triSphere);

    //Proteus
    const proGeometry = new THREE.SphereGeometry(25, 32, 32);
    const proTexture = new THREE.TextureLoader().load("proteus.jpg");
    const proMaterial = new THREE.MeshStandardMaterial({map: proTexture});
    const proSphere = new THREE.Mesh(proGeometry, proMaterial);
    proSphere.name = "proteus";
    proSphere.castShadow = true;
    proSphere.receiveShadow = true;
    app.scene.add(proSphere);

    //Nereid
    const nerGeometry = new THREE.SphereGeometry(20, 32, 32);
    const nerTexture = new THREE.TextureLoader().load("nereid.jpg");
    const nerMaterial = new THREE.MeshStandardMaterial({map: nerTexture});
    const nerSphere = new THREE.Mesh(nerGeometry, nerMaterial);
    nerSphere.name = "nereid";
    nerSphere.castShadow = true;
    nerSphere.receiveShadow = true;
    app.scene.add(nerSphere);

    //Larissa
    const larGeometry = new THREE.SphereGeometry(15, 32, 32);
    const larTexture = new THREE.TextureLoader().load("larissa.jpg");
    const larMaterial = new THREE.MeshStandardMaterial({map: larTexture});
    const larSphere = new THREE.Mesh(larGeometry, larMaterial);
    larSphere.name = "larissa";
    larSphere.castShadow = true;
    larSphere.receiveShadow = true;
    app.scene.add(larSphere);
}

const moonData = 
[
    {name: "moon", parent: "earth", w: 13.2, r: 500, inc: 5.14},

    {name: "phobos", parent: "mars", w: 25, r: 200, inc: 1.08},
    {name: "deimos", parent: "mars", w: 6, r: 280, inc: 1.79},

    {name: "io", parent: "jupiter", w: 20, r: 1400, inc: 0.05},
    {name: "europa", parent: "jupiter", w: 10, r: 1700, inc: 0.47},
    {name: "ganymede", parent: "jupiter", w: 5, r: 2100, inc: 0.2},
    {name: "callisto", parent: "jupiter", w: 2, r: 2700, inc: 0.19},

    {name: "titan", parent: "saturn", w: 4, r: 1400, inc: 0.33},
    {name: "enceladus", parent: "saturn", w: 18, r: 1050, inc: 0.02},
    {name: "iapetus", parent: "saturn", w: 0.8, r: 2200, inc: 7.57},
    {name: "mimas", parent: "saturn", w: 22, r: 950, inc: 1.57},

    {name: "titania", parent: "uranus", w: 2.2, r: 900, inc: 0.08},
    {name: "oberon", parent: "uranus", w: 1.4, r: 1050, inc: 0.07},
    {name: "ariel", parent: "uranus", w: 5.5, r: 700, inc: 0.04},
    {name: "umbriel", parent: "uranus", w: 3.6, r: 800, inc: 0.13},
    {name: "miranda", parent: "uranus", w: 9, r: 600, inc: 4.34},

    {name: "triton", parent: "neptune", w: 5, r: 900, inc: 157},
    {name: "proteus", parent: "neptune", w: 14, r: 700, inc: 0.55},
    {name: "nereid", parent: "neptune", w: 0.3, r: 1400, inc: 7.23},
    {name: "larissa", parent: "neptune", w: 16, r: 650, inc: 0.2},
]

function moonMovement()
{
    moonData.forEach(m => 
    {
        const moon = app.scene.getObjectByName(m.name);
        const parent = app.scene.getObjectByName(m.parent);
        const w = m.w * (Math.PI / 180);
        const inc = m.inc * (Math.PI / 180);
        const angle = w * elapsedTime;

        moon.position.x = parent.position.x + m.r * Math.cos(angle);
        moon.position.z = parent.position.z + (-m.r * Math.sin(angle) * Math.cos(inc));
        moon.position.y = parent.position.y + (m.r * Math.sin(angle) * Math.sin(inc));
    })
}

init();
render();