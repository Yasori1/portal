const portalVertexShader = document.getElementById('portalVertexShader')
  .textContent;
const portalFragmentShader = document.getElementById('portalFragmentShader')
  .textContent;

const firefliesVertexShader = document.getElementById('firefliesVertexShader')
  .textContent;
const firefliesFragmentShader = document.getElementById('firefliesFragmentShader')
  .textContent;

const debugObject = {
  clearColor: '#1e2243',
  portalColorStart: '#b91fac',
  portalColorEnd: '#ffebf3',  // Düzeltildi
};

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();  // Düzeltildi

const gltfLoader = new THREE.GLTFLoader();

const bakedTexture = textureLoader.load(
  'https://assets.codepen.io/22914/baked-02.jpg',
);
bakedTexture.encoding = THREE.sRGBEncoding;

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

bakedTexture.flipY = false;


const poleLightMaterial = new THREE.MeshBasicMaterial({ color: '#f0b994' });  // Renk kodu düzeltildi

const portalLightMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  transparent: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
    uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) },
  },
});

gltfLoader.load('https://assets.codepen.io/22914/portal-2.glb', (gltf) => {
  const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked');
  bakedMesh.material = bakedMaterial;

  const portalLight = gltf.scene.children.find(
    (child) => child.name === 'portalCircle',
  );
  portalLight.material = portalLightMaterial;
  gltf.scene.children
    .filter((child) => child.name.includes('poleLight'))
    .forEach((light) => {
      light.material = poleLightMaterial;
    });

  scene.add(gltf.scene);
});

// Geometry
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);  // Yazım düzeltildi

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  'aScale',
  new THREE.BufferAttribute(scaleArray, 1)
);

const firefliesMaterial = new THREE.ShaderMaterial({
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 100 },
  },
  blending: THREE.AdditiveBlending,
  depthWrite: false,  // Yazım düzeltildi
});
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100,
);

camera.position.x = -4;
camera.position.y = 2;
camera.position.z = -4;
scene.add(camera);

const controls = new THREE.OrbitControls(camera, canvas);  // Yazım düzeltildi
controls.enableDamping = true;

controls.maxPolarAngle = Math.PI / 2 - 0.1;

const minPan = new THREE.Vector3(-0.2, -0.2, -0.2);
const maxPan = new THREE.Vector3(2, 2, 2);
const _v = new THREE.Vector3();

controls.addEventListener('change', function () {  // Yazım düzeltildi
  _v.copy(controls.target);
  controls.target.clamp(minPan, maxPan);
  _v.sub(controls.target);
  camera.position.sub(_v);
});

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(debugObject.clearColor);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();  // Yazım düzeltildi

  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  portalLightMaterial.uniforms.uTime.value = elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
