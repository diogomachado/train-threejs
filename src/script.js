import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x151515)

// Lights
const hlight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.2)
scene.add(hlight);

const castLight = new THREE.SpotLight(0xffa95c, 4);
castLight.castShadow = true;
castLight.shadow.bias = -0.0001;
castLight.shadow.mapSize.width = 1024*4;
castLight.shadow.mapSize.height = 1024*4;
scene.add(castLight);

//Create a DirectionalLight and turn on shadows for the light
const light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( 0, 1, 0 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(15, sizes.width / sizes.height, 0.1, 100)
camera.rotation.y = 45/180*Math.PI;
camera.position.x = 10
camera.position.y = 5
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)

// Put the rotation more realistic
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled = true;
renderer.toneMappingExposure = 2.3;

// Add event on control
controls.addEventListener('change', () =>
{
    renderer.render(scene, camera)
})

// Loader
let loader = new GLTFLoader();
loader.setCrossOrigin('./');
loader.load('./scene.gltf', function(gltf){
    let car = gltf.scene.children[0];
    car.scale.set(0.5,0.5,0.5);
    car.traverse(n => {
        if(n.isMesh){
            n.castShadow = true;
            n.receiveShadow = true;

            if(n.material.map) n.material.map.anisotropy = 16;
        }
    });

    scene.add(gltf.scene);

    animate();
});


/**
 * Animate
 */
const animate = () =>
{
    // Update Orbital Controls
    controls.update()

    castLight.position.set(
        camera.position.x + 10,
        camera.position.y + 10,
        camera.position.z + 10
    )

    // Render
    renderer.render(scene, camera)

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}
