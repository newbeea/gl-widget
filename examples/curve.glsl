#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main()
{
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 f = vec2(0.3);
	vec3 c = vec3(1.0);
	float light = 0.1;
	
	for (float x = 1.1; x < 6.0; x += 1.0)
	{
		f = vec2(cos(cos(time*0.3 + uv.x * x) - uv.y * dot(vec2(x + uv.y), vec2(sin(x), cos(x)))));
		light += (0.04 / distance(uv, f)) - (0.01 * distance(vec2((cos(time*0.3 + uv.y))), vec2(uv)));
		c.y = sin(time*0.3 + x) * 0.2 + 0.6;
	}
	
	c *= light;
	
	gl_FragColor = vec4(c, 1.0);
}