#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main(){
  vec2 p=gl_FragCoord.xy/resolution.x*.7;
  vec2 rw=(gl_FragCoord.xy/(resolution.x+resolution.y));
  vec3 col;
  for(float j=0.;j<3.;j++){
    for(float i=1.;i<10.;i++){
      p.x+=.1/(i+j)*sin(i*10.*p.y+mouse.x*2.+cos((.1*time-rw.x/(12.*i))*i+j));
      p.y+=.1/(i+j)*cos(i*10.*p.x+mouse.y*2.+sin((.1*time-rw.y/(12.*i))*i+j));
    }
    col[int(j)]=abs(p.x+p.y);
  }
  gl_FragColor=vec4(col-rw.x,1.);
}