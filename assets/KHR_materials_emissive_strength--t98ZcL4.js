import{I as a,u as d,r as h}from"./index-DeUHw7oA.js";import{G as m}from"./glTFLoader-zmRODj6d.js";import"./objectModelMapping-2dAzLjjr.js";const t="KHR_materials_emissive_strength";class l{constructor(e){this.name=t,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,i){return m.LoadExtensionAsync(e,s,this.name,(n,o)=>this._loader.loadMaterialPropertiesAsync(e,s,i).then(()=>{this._loadEmissiveProperties(n,o,i)}))}_loadEmissiveProperties(e,s,i){if(!(i instanceof a))throw new Error(`${e}: Material type not supported`);s.emissiveStrength!==void 0&&(i.emissiveIntensity=s.emissiveStrength)}}d(t);h(t,!0,r=>new l(r));export{l as KHR_materials_emissive_strength};
