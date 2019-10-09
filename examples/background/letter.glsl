// From Shadertoy Mr Elias
// for glslsandbox by Gigatron
// variant by I.G.P.

// Oh, did it say Trump or Satan, I thought those were the same...
// Clear improvement of my old version I believe :-)
// @dennishjorth

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define STEPS 36
#define PRECISION 0.01
#define DEPTH 15.0

vec3 eye = vec3(0,0.5,-1)*3.0;
vec3 light = vec3(0,1,-1);

const float lineWidth = 0.02;
const float border = 0.05;
const float scale = 0.075;

float bounding, ground, letters;
const float groundPosition = -0.5;
const vec3 boundingSize = vec3(30,12,0.8)*scale;

float t;
float scene(vec3);

// Utilities
float udBox(vec3 p, vec3 s) { return length(max(abs(p)-s,0.0)); }

/*
    mat4 rotX = mat4(      vec4(1,0,0,0),
                           vec4(0,c,-s,0),
                           vec4(0,s,c,0),
                           vec4(0,0,0,1) );
    
    mat4 rotY = mat4(      vec4(c,0,-s,0),
                           vec4(0,1,0,0),
                           vec4(s,0,c,0),
                           vec4(0,0,0,1) );
    
    mat4 rotZ = mat4(      vec4(c,s,0,0),
                           vec4(-s,c,0,0),
                           vec4(0,0,1,0),
                           vec4(0,0,0,1) );
    
    mat4 pos = mat4(       vec4(1,0,0,s),
                           vec4(0,1,0,0),
                           vec4(0,0,1,c),
                           vec4(0,0,0,1) );
*/
mat3 rotX(float a) {float s=sin(a); float c=cos(a); return mat3(1,0,0,0,c,-s,0,s,c);}
mat3 rotY(float a) {float s=sin(a); float c=cos(a); return mat3(c,0,-s,0,1,0,s,0,c);}

// Letter code ("Elias var här!")
float line(vec2 p, vec2 s, vec2 e) {
  s*=scale;
  e*=scale;
  float l=length(s-e);
  vec2 d=vec2(e-s)/l;
  p-=vec2(s.x,-s.y);
  p=vec2(p.x*d.x+p.y*-d.y,p.x*d.y+p.y*d.x);
  return length(max(abs(p-vec2(l/2.0,0))-vec2(l/2.0,lineWidth/2.0),0.0))-border;
}

float A(vec2 p){
  float d=1.0;
  d=min(d,line(p,vec2(1,8),vec2(1,1.5)));
  d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));
  d=min(d,line(p,vec2(5,1.5),vec2(5,5)));
  d=min(d,line(p,vec2(5,5),vec2(1,5)));
  d=min(d,line(p,vec2(1,5),vec2(5,5)));
  d=min(d,line(p,vec2(5,5),vec2(5,8)));
  return d;
  }

float B(vec2 p){float d=1.0;d=min(d,line(p,vec2(4,5),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));return d;}

float C(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

float D(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(4,8)));d=min(d,line(p,vec2(4,8),vec2(4.5,7.5)));d=min(d,line(p,vec2(4.5,7.5),vec2(5,6.25)));d=min(d,line(p,vec2(5,6.25),vec2(5,3.75)));d=min(d,line(p,vec2(5,3.75),vec2(4.5,2)));d=min(d,line(p,vec2(4.5,2),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));return d;}

float E(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

float F(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(1,8)));return d;}

float G(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,2.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(3.5,5)));return d;}

float H(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,8)));return d;}

float I(vec2 p){float d=1.0;d=min(d,line(p,vec2(1.5,1.5),vec2(4.5,1.5)));d=min(d,line(p,vec2(4.5,1.5),vec2(3,1.5)));d=min(d,line(p,vec2(3,1.5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(1.5,8)));d=min(d,line(p,vec2(1.5,8),vec2(4.5,8)));return d;}

float J(vec2 p){float d=1.0;d=min(d,line(p,vec2(1.5,8),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(4,7)));d=min(d,line(p,vec2(4,7),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1.5,1.5)));return d;}

float K(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(2.5,5)));d=min(d,line(p,vec2(2.5,5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(2.5,5)));d=min(d,line(p,vec2(2.5,5),vec2(5,8)));return d;}

float L(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

float M(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(3,4)));d=min(d,line(p,vec2(3,4),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,8)));return d;}

float N(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}

float O(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}

float P(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));return d;}

float Q(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,8),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(3.5,6.5)));return d;}

float R(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3.5,5)));d=min(d,line(p,vec2(3.5,5),vec2(5,8)));return d;}

float S(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}

float T(vec2 p){float d=1.0;d=min(d,line(p,vec2(3,8),vec2(3,1.5)));d=min(d,line(p,vec2(3,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));return d;}

float U(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}

float V(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(5,1.5)));return d;}

float W(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(3,6)));d=min(d,line(p,vec2(3,6),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}

float X(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(3,4.75)));d=min(d,line(p,vec2(3,4.75),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,8)));return d;}

float Y(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(5,1.5)));return d;}

float Z(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1.5,5)));d=min(d,line(p,vec2(1.5,5),vec2(4.5,5)));d=min(d,line(p,vec2(4.5,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

// Marching
vec3 getNormal(vec3 p){vec2 e=vec2(PRECISION,0);return(normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy),scene(p+e.yxy)-scene(p-e.yxy),scene(p+e.yyx)-scene(p-e.yyx))));}
vec3 march(vec3 ro,vec3 rd){
  float t=0.0,d;
  for(int i=0;i<STEPS;i++){
    d=scene(ro+rd*t);
    if(d<PRECISION||t>DEPTH){
      break;
    }
    t+=d;
  }
  return(ro+rd*t);
}
vec3 lookAt(vec3 o,vec3 t){
  vec2 uv=(2.0*gl_FragCoord.xy-resolution.xy)/resolution.xx;
  vec3 d=normalize(t-o),u=vec3(0,1,0),r=cross(u,d);
  return(normalize(r*uv.x+cross(d,r)*uv.y+d));
}

vec3 processColor(vec3 p)
{
	float d = 1e3;
	
	vec3 n = getNormal(p);
	vec3 l = normalize(light-p);
	vec3 col;
	
	float dist = length(light-p);
	float diff = max(dot(n, normalize(light-p)),0.0);
	float spec = pow(diff*diff, 15.0);
	
	if (ground<d) { col = vec3(diff+spec*0.3)*vec3(0.0,0.333,0.99946); d = ground; }
	if (letters<d) { col = vec3(p.y,0.2,p.y*-0.5-0.15)+diff+spec; }
		
	col *= min(1.0, 1.0/dist);
	
	return col;
}

float scene(vec3 p)
{	
	p.x += 0.2;
	
	ground   = p.y-groundPosition;
	bounding = udBox(p,boundingSize);
 	letters  = 1e10;
	
	float d = 1e3;
	
	letters = min(letters,M(p.xy-vec2(-1.0,0.9))+cos(time*5.1+3.0)*0.03);
	letters = min(letters,A(p.xy-vec2(-0.50,0.9))+cos(time*5.1+2.0)*0.03);
	letters = min(letters,T(p.xy-vec2( 0.00,0.9))+cos(time*5.1+1.0)*0.03);
	letters = min(letters,T(p.xy-vec2( 0.50,0.9))+cos(time*5.1+0.0)*0.03);
	letters = min(letters,I(p.xy-vec2( 1.0,0.9))+cos(time*5.1-1.0)*0.03);
	letters = min(letters,A(p.xy-vec2( 1.5,0.9))+cos(time*5.1-2.0)*0.03);
	
	letters = min(letters,F(p.xy-vec2(-1.00,0.2))+cos(time*5.1+3.0)*0.03);
	letters = min(letters,U(p.xy-vec2(-0.50,0.2))+cos(time*5.1+2.0)*0.03);
	letters = min(letters,S(p.xy-vec2( 0.00,0.2))+cos(time*5.1+1.0)*0.03);
	letters = min(letters,C(p.xy-vec2( 0.50,0.2))+cos(time*5.1+0.0)*0.03);
	letters = min(letters,O(p.xy-vec2( 1.00,0.2))+cos(time*5.1-1.0)*0.03);
	letters = min(letters,O(p.xy-vec2( 1.50,0.2))+cos(time*5.1-2.0)*0.03);

	
	letters = max(bounding, letters);
	
	d = min(d, ground);
	d = min(d, letters);
	
	return d;
}

void main()
{	
  float t = time;
	eye *= rotY(mouse.x - 0.5 + 0.5*sin(t));
	eye *= rotX(mouse.y - 0.45);
	light.x = sin(t);

	vec3 p = march(eye,lookAt(eye,vec3(0)));
	vec3 col = processColor(p);

	gl_FragColor = vec4(col,1.0);
}