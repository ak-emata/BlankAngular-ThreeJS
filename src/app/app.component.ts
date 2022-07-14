import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { __values } from 'tslib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @Input() public cameraZ: number = 300;

  @Input() public cameraY: number = 300;

  @Input() public fieldOfView: number = 45;

  @Input('nearClippingPlane') public nearClippingPlane: number = 1;

  @Input('farClippingPlane') public farClippingPlane: number = 1000;

  @Input() public modelPath: string = 'assets/toyfreddy.glb';

  private camera!: THREE.PerspectiveCamera;

  private renderer!: THREE.WebGLRenderer;

  public scene!: THREE.Scene;

  /* Misc */

  private controls!: OrbitControls;

  private clock!: THREE.Clock;

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    let aspectRatio = this.getAspectRatio();
    this.createFloorAndLights();
    this.populate();

    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );

    this.camera.position.z = this.cameraZ;
    this.camera.position.y = this.cameraY;
    this.camera.lookAt(0, 0, 0);

    this.clock = new THREE.Clock(false);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    let component: AppComponent = this;
    component.clock.start();
    (function render() {
      requestAnimationFrame(render);
      if (component.resizeRendererToDisplaySize()) {
        // changing the camera aspect to remove the strechy problem
        component.camera.aspect = component.getAspectRatio();
        component.camera.updateProjectionMatrix();
      }
      component.renderer.render(component.scene, component.camera);
    })();
  }

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    // resize only when necessary
    if (needResize) {
      //3rd parameter `false` to change the internal canvas size
      this.renderer.setSize(width, height, false);
    }
    return needResize;
  }

  private createFloorAndLights() {
    // just to make a blank playground
    let geometry = new THREE.PlaneBufferGeometry(200, 200);
    let material = new THREE.MeshBasicMaterial();

    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(-90);
    plane.position.set(0, 0, 0);

    this.scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff);

    this.scene.add(ambientLight);
  }

  private populate() {
    // Add anything to the scene here
  }
}
