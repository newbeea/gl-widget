import { RenderTarget } from "./RenderTarget";
import { Renderer } from "./Renderer";
import { Vector2 } from "./math/Vector2";
import { Clock } from "./Clock";
import { GLWidget } from "./GLWidget";

class RenderFlow {
  clock: Clock;
  passes: any[];
  renderToScreen: boolean;
  readBuffer: RenderTarget;
  writeBuffer: RenderTarget;
  renderTarget2: RenderTarget;
  renderTarget1: RenderTarget;
  height: number;
  width: number;
  pixelRatio: number;
  glWidget: GLWidget;
  constructor(glWidget: GLWidget, renderTarget?: RenderTarget) {
    this.glWidget = glWidget;
    let parameters = {
      // minFilter: LinearFilter,
      // magFilter: LinearFilter,
      // format: RGBAFormat,
      // stencilBuffer: false
    };
    if ( renderTarget === undefined ) {

      

      let size: Vector2 = glWidget.getSize();
      this.pixelRatio = glWidget.getPixelRatio();
      this.width = size.x;
      this.height = size.y;

      renderTarget = new RenderTarget( glWidget.gl, this.width * this.pixelRatio, this.height * this.pixelRatio, parameters );
      // renderTarget.texture.name = 'EffectComposer.rt1';

    } else {

      this.pixelRatio = 1;
      this.width = renderTarget.width;
      this.height = renderTarget.height;

    }

    this.renderTarget1 = renderTarget;
    // this.renderTarget2 = renderTarget.clone();
    this.renderTarget2 = new RenderTarget( glWidget.gl, this.width * this.pixelRatio, this.height * this.pixelRatio, parameters );
    // this.renderTarget2.texture.name = 'EffectComposer.rt2';

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    this.renderToScreen = true;

    this.passes = [];

    this.clock = new Clock()
  }

  swapBuffers () {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	}

	addPass ( pass ) {

		this.passes.push( pass );
		pass.setSize( this.width * this.pixelRatio, this.height * this.pixelRatio );

	}

	insertPass ( pass, index ) {

		this.passes.splice( index, 0, pass );

	}

	isLastEnabledPass ( passIndex ) {

		for ( var i = passIndex + 1; i < this.passes.length; i ++ ) {

			if ( this.passes[ i ].enabled ) {

				return false;

			}

		}

		return true;

  }
  
  render ( deltaTime?: number ) {

		// deltaTime value is in seconds

		if ( deltaTime === undefined ) {

			deltaTime = this.clock.getDelta();

		}

		var currentRenderTarget = this.glWidget.getRenderTarget();

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.renderToScreen = ( this.renderToScreen && this.isLastEnabledPass( i ) );
			pass.render( this.glWidget, this.writeBuffer, this.readBuffer, deltaTime, maskActive );

			if ( pass.needsSwap ) {

				// if ( maskActive ) {

				// 	var context = this.renderer.gl;
				// 	var stencil = this.renderer.state.buffers.stencil;

				// 	//context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
				// 	stencil.setFunc( context.NOTEQUAL, 1, 0xffffffff );

				// 	this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime );

				// 	//context.stencilFunc( context.EQUAL, 1, 0xffffffff );
				// 	stencil.setFunc( context.EQUAL, 1, 0xffffffff );

				// }

				this.swapBuffers();

			}

			// if ( MaskPass !== undefined ) {

			// 	if ( pass instanceof MaskPass ) {

			// 		maskActive = true;

			// 	} else if ( pass instanceof ClearMaskPass ) {

			// 		maskActive = false;

			// 	}

			// }

		}

		this.glWidget.setRenderTarget( currentRenderTarget );

	}
}
export {
    RenderFlow
}