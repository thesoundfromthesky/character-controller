import{I as p,u as d,r as u}from"./index-DeUHw7oA.js";import{G as y}from"./glTFLoader-zmRODj6d.js";import"./objectModelMapping-2dAzLjjr.js";const n="KHR_materials_anisotropy";class h{constructor(o){this.name=n,this.order=195,this._loader=o,this.enabled=this._loader.isExtensionUsed(n)}dispose(){this._loader=null}loadMaterialPropertiesAsync(o,r,s){return y.LoadExtensionAsync(o,r,this.name,(e,t)=>{const i=new Array;return i.push(this._loader.loadMaterialPropertiesAsync(o,r,s)),i.push(this._loadIridescencePropertiesAsync(e,t,s)),Promise.all(i).then(()=>{})})}_loadIridescencePropertiesAsync(o,r,s){if(!(s instanceof p))throw new Error(`${o}: Material type not supported`);const e=new Array;return s.anisotropy.isEnabled=!0,s.anisotropy.intensity=r.anisotropyStrength??0,s.anisotropy.angle=r.anisotropyRotation??0,r.anisotropyTexture&&(r.anisotropyTexture.nonColorData=!0,e.push(this._loader.loadTextureInfoAsync(`${o}/anisotropyTexture`,r.anisotropyTexture,t=>{t.name=`${s.name} (Anisotropy Intensity)`,s.anisotropy.texture=t}))),Promise.all(e).then(()=>{})}}d(n);u(n,!0,a=>new h(a));export{h as KHR_materials_anisotropy};
