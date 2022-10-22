import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLoaders, usePhysics, useCleanup, useLocalPlayer, useCamera} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  const physics = usePhysics();
  const localPlayer = useLocalPlayer();
  const camera = useCamera();

  app.name = 'leaves';

  let leavesArray = [];
  let mesh = null;
  let dummy = new THREE.Object3D();
  let dummy2 = new THREE.Object3D();
  let sectionWidth = 0.5;

  useFrame(({timeDiffS}) => {
    
    if(mesh) {
      for (let i = 0; i < mesh.count; i++) {
        //var xStaticPosition = (-sectionWidth + Math.random()) * (i - 1)
        mesh.getMatrixAt(i, dummy.matrix );
        dummy.matrix.decompose(dummy2.position, dummy2.quaternion, dummy2.scale);

        if(dummy2.position.y < localPlayer.position.y - 1) {
          dummy2.position.y = localPlayer.position.y + 10;
        }
        dummy2.position.y -= 0.5 * Math.random();
        //dummy2.position.x = dummy.position
        
        //dummy.position.y -= 0.0001;
        //dummy.position.set(xStaticPosition, Math.random() * 10, 0);
        dummy2.updateMatrixWorld();
        //console.log(dummy.position);
        mesh.setMatrixAt( i, dummy2.matrix );
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    

  });

  function addInstancedMesh() {
    // An InstancedMesh of 4 cubes
    mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry( 0.025, 0.2 ), new THREE.MeshStandardMaterial( {color: 0x182b57, side: THREE.DoubleSide,  transparent: true, opacity: 0.5} ), 1000);
    app.add(mesh);

    for (let i = 0; i < mesh.count; i++) {
      // we add 200 units of distance (the width of the section) between each.
      var xStaticPosition = (-sectionWidth + Math.random()) * (i - 1)
      dummy.position.set(xStaticPosition, Math.random() * 10, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt( i, dummy.matrix );
    }
    mesh.instanceMatrix.needsUpdate = true;
    //mesh.updateMatrixWorld();
    //app.updateMatrixWorld();
  }

  addInstancedMesh();

  let physicsIds = [];
  
  // const geometry = new THREE.PlaneGeometry( 0.25, 0.25 );
  // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  // const plane = new THREE.Mesh( geometry, material );
  // app.add( plane );

  return app;
};
