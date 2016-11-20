import React, {Component, PropTypes} from 'react';

import keyboardJS from 'keyboardjs';
import Stats from 'stats.js';

import {
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector3,
  WebGLRenderer
} from 'three';

import {connect} from 'react-redux';

import * as gameActions from '../../redux/modules/game';

const TOP_OFFSET = 55;
const SPEED_LINEAR = 100;

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

    // Input
    inputHandle: PropTypes.func,

    // Render
    setStats: PropTypes.func,
    setThree: PropTypes.func
  };

  componentDidMount() {
    console.log('componentDidMount()');

    const scene = window.scene = new Scene();
    const width = window.innerWidth;
    const height = window.innerHeight - TOP_OFFSET;

    const camera = new PerspectiveCamera(70, width / height, 1, 10000);
    camera.position.z = 400;
    camera.up = new Vector3(0, 0, 1);
    scene.add(camera);

    let geometry = new BoxGeometry(100, 100, 100);

    const texture = new TextureLoader().load('images/textures/crate.gif');
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1, 1);
    const material = new MeshBasicMaterial({
      // color: 0xff0000,
      // wireframe: true,
      map: texture
    });

    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    geometry = new PlaneGeometry(1000, 1000, 1, 1);
    const floor = new Mesh(geometry, material);
    floor.material.side = DoubleSide;
    floor.rotation.x = 90; // / 180 / Math.PI;
    scene.add(floor);

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

    // Get canvas element
    const canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);

    // Init FPS Stats
    this.initStats(canvas);

    // Update Performance Counter
    this.lastTickTimestamp = window.performance.now();

    // Init Input
    this.inputInit();

    // Start Ticking
    this.tick();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount()');

    this.props.setThree(null);
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
        renderer.setSize(window.innerWidth, window.innerHeight - TOP_OFFSET);
      }
    }
  }

  inputInit() {
    keyboardJS.bind('',
      (e) => {
        this.props.inputHandle(e.code, true);
      },
      (e) => {
        this.props.inputHandle(e.code, false);
      }
    );
  }

  initStats(canvas) {
    const stats = new Stats();
    stats.setMode(0);

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '1px';

    // Append element
    canvas.appendChild(stats.domElement);

    this.props.setStats(stats);
  }

  processInput(delta) {
    const three = this.props.game.three;
    if (!three) {
      return;
    }

    const input = this.props.game.input;
    const camera = three.camera;

    if (input.ArrowUp) {
      camera.position.y += SPEED_LINEAR * delta;
    }

    if (input.ArrowDown) {
      camera.position.y -= SPEED_LINEAR * delta;
    }

    if (input.ArrowLeft) {
      camera.position.z += SPEED_LINEAR * delta;
    }

    if (input.ArrowRight) {
      camera.position.z -= SPEED_LINEAR * delta;
    }

    camera.updateProjectionMatrix();
  }

  tick() {
    const now = window.performance.now();
    const delta = (now - this.lastTickTimestamp) * 0.001;

    this.processInput(delta);

    this.renderScene();

    this.lastTickTimestamp = now;
    window.requestAnimationFrame(this.tick.bind(this));
  }

  renderFloor() {
    const mesh = this.props.game.three.mesh;

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
  }

  renderScene() {
    const stats = this.props.game.stats;
    if (stats) {
      stats.begin();
    }

    if (this.props.game.three && this.props.game.three.renderer) {
      this.renderFloor(this.props.game.three);

      const camera = this.props.game.three.camera;
      const scene = this.props.game.three.scene;

      this.props.game.three.renderer.render(scene, camera);
    }

    if (stats) {
      stats.end();
    }
  }

  render() {
    return (
      <div id="canvas" style={{position: 'absolute', left: '0px', top: '50px'}}/>
    );
  }
}
