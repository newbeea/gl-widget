import { BufferGeometry, Float32Attribute, Uint32Attribute } from '@gl-widget/gl-widget'
import parseOBJ from 'parse-wavefront-obj'
function parse(objString) {
  let obj = parseOBJ(objString);
  let geometry = new BufferGeometry()
  let normal = []

  let position = []
  let index = []
  for (let i = 0; i < obj.cells.length; i++) {
    let positionIndies = obj.cells[i]
    let normalIndies = obj.faceNormals[i]
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        position.push(obj.positions[positionIndies[j]][k])
        normal.push(obj.vertexNormals[normalIndies[j]][k])
      }
    }

    index.push(i * 3, i * 3 + 1, i * 3 + 2)
    // console.log(normalIndies)
    // normal = normal.concat(obj.vertexNormals[normalIndies[0]])
    // normal = normal.concat(obj.vertexNormals[normalIndies[1]])
    // normal = normal.concat(obj.vertexNormals[normalIndies[2]])
    // console.log(normal)
    // obj.vertexNormals[obj.faceNormals[face[0]][0]]
    // console.log(obj.faceNormals[face[0]])
    // console.log(obj.vertexNormals[obj.faceNormals[face[0]][0]])


    // face.forEach(pointIndex => {
    //   console.log(pointIndex)
    //   let normalIndex = obj.faceNormals[pointIndex]
    //   console.log(normalIndex)
    //   let normal = obj.vertexNormals[normalIndex]
    //   console.log(normal)
    // });
    // normal.push(
    //   obj.vertexNormals[obj.faceNormals[face[0]]],
    //   obj.vertexNormals[obj.faceNormals[face[1]]],
    //   obj.vertexNormals[obj.faceNormals[face[2]]]
    // )
  }
  
  geometry.addAttribute('position', new Float32Attribute(position, 3))
  geometry.addAttribute('index', new Uint32Attribute(index, 1))
  geometry.addAttribute('normal',  new Float32Attribute( normal, 3 ) );

  return geometry
}





// console.log(normal);

// let mesh = new RenderableElement(new BlinnPhongMaterial(), geometry)

export {
  parse
}
