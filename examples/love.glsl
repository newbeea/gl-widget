#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// custom font , Xavierseb 2019
#define ti (1.2+pow(sin(time*4.),8.)/8.)
#define _(x,y) a2z(x,y, vec4(-1.4,-1.4,1.4,1.4), vec4(-1.), vec4(0.), vec4(-1.))
#define A(x,y) a2z(x,y, vec4(.75,-1.32,-1.44,.75), vec4(.77,1.95,-2.28,-.59), vec4(.75,1.05,.32,1.), vec4(-.59,1.82,.78,-1.))
#define B(x,y) a2z(x,y, vec4(-1.,.3,-1.66,-.8), vec4(.2,3.3,5.,-1.), vec4(-1.,.6,2.,-.8), vec4(.2,2.6,-1.6,-1.))
#define C(x,y) a2z(x,y, vec4(.8,-.5,-2.1,.94), vec4(.8,1.8,-1.8,-.8), vec4(.7,-.5,-2.1,.94), vec4(.8,1.8,-1.8,-.8))
#define D(x,y) a2z(x,y, vec4(.64,-.8,-1.8,.74), vec4(.78,1.9,-1.7,-.86), vec4(.74,1.3,-.63,1.), vec4(-.43,4.8,3.8,0.))
#define E(x,y) a2z(x,y, vec4(-.8,2.8,-.65,-.8), vec4(0.,-.27,2.3,-.1), vec4(-.8,-.82,-.92,1.), vec4(-.1,-.32,-1.2,-1.))
#define F(x,y) a2z(x,y, vec4(-.44,2.1,-1.,0.), vec4(.44,4.4,4.,-2.4), vec4(0.,.6,-1.24,.62), vec4(-2.4,1.28,.56,.6))
#define G(x,y) a2z(x,y, vec4(.9,-.4,-2.3,.84), vec4(.34,2.4,-1.8,-.99), vec4(.9,1.,-1.,-.9), vec4(0.,-4.7,-3.5,-2.9))
#define H(x,y) a2z(x,y, vec4(-1.,.9,-1.1,-.75), vec4(.43,4.5,3.4,-.5), vec4(-.75,-.24,.78,.94), vec4(-1.,3.7,-1.35,-1.))
#define I(x,y) a2z(x,y, vec4(0.,-.14,-1.19,.64), vec4(.8,-.48,-1.07,-1.), vec4(-.05,.43,-.34,.07), vec4(2.88,2.71,2.67,2.86))
#define J(x,y) a2z(x,y, vec4(0.,-.3,-1.,-.8), vec4(.5,-5.19,-1.7,-2.5), vec4(-.05,.43,-.34,.03), vec4(2.88,2.71,2.67,2.96))
#define K(x,y) a2z(x,y, vec4(-.94,.58,-1.1,-.94), vec4(.6,4.35,3.6,-.7), vec4(.4,-2.4,.3,.8), vec4(.8,0.,0.,-1.))
#define L(x,y) a2z(x,y, vec4(-.4,1.,.3,-.17), vec4(-.95,1.2,3.8,2.8), vec4(-.17,-.8,.38,.84), vec4(2.8,1.8,-1.,-.95))
#define M(x,y) a2z(x,y, vec4(-.9,-.9,-.33,0.), vec4(-1.,.912,1.6,-.7), vec4(0.,.33,.9,.9), vec4(-.7,1.6,.912,-1.))
#define N(x,y) a2z(x,y, vec4(-1.07,-.64,-.9,-.76), vec4(.35,.93,.85,-1.), vec4(-.75,-.9,.7,.94), vec4(-1.,.85,1.9,-1.))
#define O(x,y) a2z(x,y, vec4(0.,-1.1,-1.1,0.), vec4(1.,.82,-.8,-1.), vec4(0.,1.1,1.1,0.), vec4(-1.,-.8,.82,1.))
#define P(x,y) a2z(x,y, vec4(-1,-.43,-.58,-.73), vec4(.43,1.5,-1.9,-3.), vec4(-.7,.83,1.75,-.7), vec4(.8,1.9,-1.75,-.8))
#define Q(x,y) a2z(x,y, vec4(.7,-.83,-1.75,0.), vec4(.8,1.9,-1.75,-.8), vec4(.7,-.5,-.54,.93), vec4(.26,-2.7,-4.76,-2.5))
#define R(x,y) a2z(x,y, vec4(-.88,-.28,-.43,-.5), vec4(.86,1.5,-.67,-1.), vec4(-.5,-.54,.22,.9), vec4(-1.,1.,1.,.8))
#define S(x,y) a2z(x,y, vec4(.78,-.7,-1.5,0.), vec4(.88,1.34,.55,0.), vec4(0.,1.5,.67,-.9), vec4(0.,-.55,-1.35,-.8))
#define T(x,y) a2z(x,y, vec4(-.55,.35,-1.37,.76), vec4(3.,1.16,-1.1,-1.), vec4(-1.,-.7,-1.4,.9), vec4(1.64,1.54,1.7,1.7))
#define U(x,y) a2z(x,y, vec4(-.9,-1.1,1.,.72), vec4(.9,-1.6,-1.7,.9), vec4(.72,.7,1.,1.4), vec4(.9,-1.6,-1.,-.77))
#define V(x,y) a2z(x,y, vec4(-1.,-.83,-.236,0.), vec4(.88,1.5,-.73,-1.), vec4(0.,1.55,-.25,1.), vec4(-1.,1.8,.9,.65))
#define W(x,y) a2z(x,y, vec4(-.9,-1.2,-.33,0.), vec4(1.,-.912,-1.6,.7), vec4(0.,.33,.9,.9), vec4(.7,-1.6,-.912,1.))
#define X(x,y) a2z(x,y, vec4(.83,.25,-.3,-1.), vec4(.95,.6,-.5,-1.), vec4(-.9,.48,-.43,1.), vec4(.87,.35,-.5,-1.))
#define Y(x,y) a2z(x,y, vec4(-.9,-.2,.9,.9), vec4(.9,-2.9,0.,.9), vec4(.9,-.37,-1.,-.9), vec4(.2,-4.7,-3.5,-2.9))
#define Z(x,y) a2z(x,y, vec4(-.9,1.1,1.3,0.), vec4(.9,.9,1.5,0.), vec4(0.,-1.3,-1.1,.9), vec4(0.,-1.5,-.9,-.9))
#define LV(x,y) a2z(x,y, vec4(0.,-.45,-2.,0.)*ti, vec4(.58,1.4,1.,-1.)*ti, vec4(0.,2.,.45,0.)*ti, vec4(-1.,1.,1.4,.58)*ti)
#define QU(x,y) a2z(x,y, vec4(-.66,2.74,-.3,-.05), vec4(2.9,3.35,1.6,.58), vec4(-.05,.43,-.34,.03), vec4(-.42,-.59,-.63,-.44))

#define gettext(x0,u0,v0) min(c,distance(getPos(t,u0/20.,v0/10.),position-vec2(x0-.05,0.)))
#define a2z(xt,y,u0,v0,u1,v1) else if(position.x<xt+y && position.x>xt-.25) for(float t=0.;t<1.;t+=.01) c=min(c,min(gettext(xt,u0,v0),gettext(xt,u1,v1)));


vec2 getPos(in float t, in vec4 x, in vec4 y)
{
    float t1 = 1.-t; 
    vec4 n = vec4(t1*t1*t1, 3.*t1*t1*t, 3.*t1*t*t, t*t*t);    
    return vec2(dot(x,n), dot(y,n));
}
	
void main( void ){
	vec2 position = gl_FragCoord.xy/resolution.xy -vec2(.5, .5+sin(time*2.+(gl_FragCoord.xy/resolution.xy).x*4.)/15.);
	float c=10., x=-.4;
	
	if(false); // assuming graphics is drawn a certain way, might depend on graphics card and/or driver ?
	_(x+.03,.00) L(x+.155,.04) O(x+.27,.02) V(x+.38,.02) E(x+.495,.02)  LV(x+.73,.02) _(x+.87,.02) 
	if(false);
	_(x+.03,.04) /* L(x+.155,.06) O(x+.27,.06) V(x+.38,.06) */ E(x+.495,.08)  LV(x+.73,.12) _(x+.87,.06) 
	if(false);
	/* _(x+.03,-.04) */L(x+.155,-.06)  O(x+.27,-.06) V(x+.38,-.06) /* E(x+.495,-.06)  LV(x+.73,-.06) */ _(x+.87,-.06) 
			
	gl_FragColor = vec4( vec3((position.x*3.+1.8),.89,3.)*(1.-smoothstep(c,.0,.0064)), 1.0 );
}