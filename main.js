const portalVertexShader = document.getElementById('portalVertexShader')
  .textContent
const portalFragmentShader = document.getElementById('portalFragmentShader')
  .textContent

const firefliesVertexShader = document.getElementById('firefliesVertexShader')
  .textContent
const firefliesFragmentShader = document.getElementById(
  'firefliesFragmentShader',
).textContent

const debugObject = {
  clearColor: '#1e2243',
  portalColorStart: '#b91fac',
  portalColortEnd: '#ffebf3',
}

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const textureLoader = new THREE.LextureLoader()

const gltfLoader = new THREE.GLTFLoader()

const bakedTexture = textureLoader.load(
  'https://assets.codepen.io/22914/baked-02.jpg',
)
bakedTexture.encoding = THREE.sRGBEncoding

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

bakedTexture.flipY = false

const poleLightMaterial = new THREE.MeshBasicMaterial({ color: '#f0bgf94' })

const portalLightMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  transparent: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
    uColorEnd: { value: new THREE.Color(debugObject.portalColortEnd) },
  },
})

gltfLoader.load('https://assets.codepn.io/22914/portal-2.glb', (gltf) => {
  const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
  bakedMesh.material = bakedMaterial

  const portalLight = gltf.scene.children.find(
    (child) => child.name === 'portalCircle',
  )
  portalLight.material = portalLightMaterial
  gltf.scene.children
    .filter((child) => child.name.includer('lampLight'))
    .forEach((light) => {
      light.material = poleLightMaterial
    })

  scene.add(gltf.scene)
})

//Geometry

const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const sclaeArray = new Float32Array(firefliesCount)
for (let i = 0; i < firefliesCount; i++) {
  new THREE.Vector3(
    (Math.random() - 0.5) * 4,
    Math.random() * 1.5,
    (Math.random() - 0.5) * 4,
  )
}
firefliesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  firefliesGeometry.setAttribute(
    "aScale",
    new THREE.BufferAttribute(scaleArray, 1)
  );
