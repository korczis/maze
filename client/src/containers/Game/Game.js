import React, {Component, PropTypes} from 'react';

import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer
} from 'three';

import {connect} from 'react-redux';

import * as gameActions from '../../redux/modules/game';

@connect(
  (state) => ({
    game: state.game
  }),
  {
    ...gameActions
  }
)
export default class Game extends Component {
  static propTypes = {
    game: PropTypes.object,

    // Functions
    setThree: PropTypes.func
  };

  componentDidMount() {
    console.log('componentDidMount()');

    const scene = window.scene = new Scene();
    const width = window.innerWidth;
    const height = window.innerHeight - 55;

    const camera = new PerspectiveCamera(70, width / height, 1, 10000);
    camera.position.z = 400;

    const geometry = new BoxGeometry(200, 200, 200);

    const texture = new TextureLoader().load('images/textures/crate.gif');
    const material = new MeshBasicMaterial({
      // color: 0xff0000,
      // wireframe: true,
      map: texture
    });

    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    this.props.setThree({
      camera,
      scene,
      geometry,
      material,
      mesh,
      renderer
    });

    // TODO: Remove listener when needed
    window.addEventListener('resize', this.onResize.bind(this), false);

    // TODO: Cleanup renderer if needed
    const canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);

    this.renderScene();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount()');
  }

  onResize() {
    if (this.props.game.three) {
      const camera = this.props.game.three.camera;
      if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }

      const renderer = this.props.game.three.renderer;
      if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight - 55);
      }
    }
  }

  renderScene() {
    if (this.props.game.three && this.props.game.three.renderer) {
      const camera = this.props.game.three.camera;
      const scene = this.props.game.three.scene;

      const mesh = this.props.game.three.mesh;
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;

      this.props.game.three.renderer.render(scene, camera);
    }

    window.requestAnimationFrame(this.renderScene.bind(this));
  }

  render() {
    return (
      <div id="canvas" style={{position: 'absolute', left: '0px', top: '50px'}}/>
    );
  }
}
