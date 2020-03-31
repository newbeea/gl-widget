import { BufferGeometry } from "./BufferGeometry"
import { Float32Attribute } from "./Float32Attribute"
import { Uint32Attribute } from "./Uint32Attribute"
/*
{
  positions: [...],
  cells: [...],
 
  // The following attributes are available when defined 
  // in the original file
 
  vertexUVs: [...],     // array of UV coordinates
  faceUVs: [...],       // array of UV indices
  vertexNormals: [...], // array of vertex normals
  faceNormals: [...],   // array of normal indices
  name: 'foo'           // mesh name
}
*/

class Geometry {
	sameIndex: boolean
	positions: [][]
	cells: [][]
	vertexUVs: [][]
	faceUVs:[][]
	vertexNormals: [][]
	normalIndices: [][]
	faceNormals: [][]
	constructor(data: any = {}, sameIndex: boolean = true) {
		this.positions = data.positions || [] 
		this.cells = data.cells || []
		this.sameIndex = sameIndex

		this.vertexUVs = data.vertexUVs
		this.faceUVs = data.faceUVs
		this.vertexNormals = data.vertexNormals
		this.faceNormals = data.faceNormals
		this.normalIndices = data.normalIndices
	}
	toBufferGeometry (): BufferGeometry {
		let bufferGeometry = new BufferGeometry()
		let position = []
		let normal = []
		let uv = []
		let index = []
		if (this.sameIndex) {
			bufferGeometry.addAttribute('index', new Uint32Attribute(this.cells.flat(), 1))
			position = this.positions.flat()


			if (this.vertexNormals) {
				normal = this.vertexNormals.flat()
			} 
			if (this.vertexUVs) {
				uv = this.vertexUVs.flat()
			} 
		} else {
			for (let i = 0; i < this.cells.length; i++) {
				let faceIndices: [] = this.cells[i]
				faceIndices.forEach(index => {
					let p: [] = this.positions[index]
					p.forEach(value => {
						position.push(value)
					})
				});
				if (this.normalIndices) {
					let normalIndices: [] = this.normalIndices[i]
					console.log(normalIndices)
					normalIndices.forEach(index => {
						let n: [] = this.vertexNormals[index]
						n.forEach(value => {
							normal.push(value)
						})
					})
				}
				
				if (this.faceUVs.length) {
					let uvIndices: [] = this.faceUVs[i]
					uvIndices.forEach(index => {
						let u: [] = this.vertexUVs[index]
						u.forEach(value => {
							uv.push(value)
						})
					})
				}
				
			}
	
		
		}
		bufferGeometry.addAttribute('position', new Float32Attribute(position, 3))
		bufferGeometry.addAttribute('normal', new Float32Attribute(normal, 3))
		bufferGeometry.addAttribute('uv', new Float32Attribute(uv, 2))
		return bufferGeometry
	}
}
export {
	Geometry
}