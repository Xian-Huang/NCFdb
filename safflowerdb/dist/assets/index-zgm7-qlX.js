import{r as v,j as C}from"./index-DI5uTXJA.js";import{g as b,d as k,u as w,i as x,j as R,cf as S,cg as $,hq as U,hr as M,hn as c,he as u}from"./index-nCEClnvJ.js";function A(t){return b("MuiSkeleton",t)}const T=k("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]),j=t=>{const{classes:e,variant:a,animation:s,hasChildren:n,width:i,height:o}=t;return R({root:["root",a,s,n&&"withChildren",n&&!i&&"fitContent",n&&!o&&"heightAuto"]},A,e)},r=u`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,l=u`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,X=typeof r!="string"?c`
        animation: ${r} 2s ease-in-out 0.5s infinite;
      `:null,B=typeof l!="string"?c`
        &::after {
          animation: ${l} 2s linear 0.5s infinite;
        }
      `:null,E=S("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:a}=t;return[e.root,e[a.variant],a.animation!==!1&&e[a.animation],a.hasChildren&&e.withChildren,a.hasChildren&&!a.width&&e.fitContent,a.hasChildren&&!a.height&&e.heightAuto]}})($(({theme:t})=>{const e=U(t.shape.borderRadius)||"px",a=M(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:t.alpha(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${e}/${Math.round(a/.6*10)/10}${e}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:s})=>s.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:s})=>s.hasChildren&&!s.width,style:{maxWidth:"fit-content"}},{props:({ownerState:s})=>s.hasChildren&&!s.height,style:{height:"auto"}},{props:{animation:"pulse"},style:X||{animation:`${r} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:B||{"&::after":{animation:`${l} 2s linear 0.5s infinite`}}}]}})),W=v.forwardRef(function(e,a){const s=w({props:e,name:"MuiSkeleton"}),{animation:n="pulse",className:i,component:o="span",height:p,style:f,variant:m="text",width:g,...h}=s,d={...s,animation:n,component:o,variant:m,hasChildren:!!h.children},y=j(d);return C.jsx(E,{as:o,ref:a,className:x(y.root,i),ownerState:d,...h,style:{width:g,height:p,...f}})});export{W as default,A as getSkeletonUtilityClass,T as skeletonClasses};
