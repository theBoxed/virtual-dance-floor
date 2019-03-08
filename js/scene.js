
// Create Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);


var camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(1, 2, - 3);
camera.lookAt(0, 1, 0);
var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

var loader = new THREE.GLTFLoader();

// Load a glTF resource
loader.load(
  // resource URL
  '../models/RobotExpressive.glb',
  // called when the resource is loaded
  function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Scene
    // gltf.scenes; // Array<THREE.Scene>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object
  },
  function (error) {
    console.log('An error happened');
  }
);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();