import{u as i,r as _}from"./index-DeUHw7oA.js";const s="KHR_xmp_json_ld";class d{constructor(t){this.name=s,this.order=100,this._loader=t,this.enabled=this._loader.isExtensionUsed(s)}dispose(){this._loader=null}onLoading(){var a,n,r;if(this._loader.rootBabylonMesh===null)return;const t=(a=this._loader.gltf.extensions)==null?void 0:a.KHR_xmp_json_ld,o=(r=(n=this._loader.gltf.asset)==null?void 0:n.extensions)==null?void 0:r.KHR_xmp_json_ld;if(t&&o){const l=+o.packet;t.packets&&l<t.packets.length&&(this._loader.rootBabylonMesh.metadata=this._loader.rootBabylonMesh.metadata||{},this._loader.rootBabylonMesh.metadata.xmp=t.packets[l])}}}i(s);_(s,!0,e=>new d(e));export{d as KHR_xmp_json_ld};
