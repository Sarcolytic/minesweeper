!function(t){function e(e){for(var i,h,l=e[0],r=e[1],a=e[2],E=0,d=[];E<l.length;E++)h=l[E],n[h]&&d.push(n[h][0]),n[h]=0;for(i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i]);for(c&&c(e);d.length;)d.shift()();return o.push.apply(o,a||[]),s()}function s(){for(var t,e=0;e<o.length;e++){for(var s=o[e],i=!0,l=1;l<s.length;l++){var r=s[l];0!==n[r]&&(i=!1)}i&&(o.splice(e--,1),t=h(h.s=s[0]))}return t}var i={},n={0:0},o=[];function h(e){if(i[e])return i[e].exports;var s=i[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,h),s.l=!0,s.exports}h.m=t,h.c=i,h.d=function(t,e,s){h.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},h.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},h.t=function(t,e){if(1&e&&(t=h(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(h.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)h.d(s,i,function(e){return t[e]}.bind(null,i));return s},h.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return h.d(e,"a",e),e},h.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},h.p="";var l=window.webpackJsonp=window.webpackJsonp||[],r=l.push.bind(l);l.push=e,l=l.slice();for(var a=0;a<l.length;a++)e(l[a]);var c=r;o.push([15,1]),s()}({15:function(t,e,s){t.exports=s(28)},28:function(t,e,s){"use strict";s.r(e);var i=s(0),n=s.n(i),o=s(1);class h extends o.h.EventEmitter{constructor(){super(),o.d.shared.baseUrl="assets",o.d.shared.add("game_assets","img/game_assets.json").add("LibelSuit","fonts/LibelSuit.xml").load(()=>this.emit(h.EVENT_RESOURCED_LOADED))}}n()(h,"EVENT_RESOURCED_LOADED","onResourcedLoaded");const l={GAME_WIDTH:960,GAME_HEIGHT:540,GAME_CENTER_X:480,GAME_CENTER_Y:270},r={MAIN_MENU:"main_menu",GAME:"game",PAUSE_MENU:"pause_menu"};class a extends o.f{constructor(t){super(o.d.shared.resources.game_assets.textures.button);const e=new o.b(t,{font:{size:36,name:"LibelSuit"},tint:0});e.anchor=.5,this.addChild(e),this.interactive=!0}}class c extends o.c{constructor(){super();const t=new o.b("MINESWEEPER",{font:{size:50,name:"LibelSuit"},tint:0});t.anchor=.5,t.position.set(l.GAME_CENTER_X,120);const e=new a("PLAY");e.on("click",()=>{this.emit(c.EVENT_BUTTON_CLICK)}),e.position.set(l.GAME_CENTER_X,l.GAME_CENTER_Y),this.addChild(t,e)}}n()(c,"EVENT_BUTTON_CLICK","onButtonClicked");class E{constructor(t,e){n()(this,"position",void 0),n()(this,"surroundingMines",void 0),n()(this,"mined",void 0),n()(this,"opened",void 0),n()(this,"flagged",void 0),this.position={row:t,column:e},this.reset()}reset(){this.surroundingMines=0,this.mined=!1,this.opened=!1,this.flagged=!1}getPosition(){return this.position}setMined(){this.mined=!0}isMined(){return this.mined}setOpened(){this.opened=!0}isOpened(){return this.opened}setFlag(t){this.flagged=t}isFlagged(){return this.flagged}setSurroundingMines(t){this.surroundingMines=t}}class d extends o.h.EventEmitter{constructor(){super(),n()(this,"gameState",void 0),n()(this,"openedCellsCount",void 0),n()(this,"cells",void 0),this.gameState=d.STATE_INIT,this.openedCellsCount=0,this.cells=[];for(let t=0;t<d.FIELD_SIZE;t++){this.cells[t]=[];for(let e=0;e<d.FIELD_SIZE;e++)this.cells[t][e]=new E(t,e)}}reset(){this.openedCellsCount=0,this.gameState=d.STATE_INIT,this.cells.forEach(t=>{t.forEach(t=>t.reset())})}getField(){return this.cells}openCell(t,e){this.gameState===d.STATE_INIT&&(this.digMines(d.MINES_COUNT,t),this.updateGameState(d.STATE_PLAYING));const s=this.getCell(t);if(s.isOpened()||s.isFlagged())return;if(s.isMined())return e?void 0:void this.lose();const i=this.countSurroundingMines(t);if(s.setSurroundingMines(i),s.setOpened(),this.openedCellsCount++,this.emit(d.EVENT_CELL_OPENED,t,i),!this.isWin()&&0===i){const e=this.getNeighbors(t);for(let t=0;t<e.length;t++)this.openCell(e[t].getPosition(),!0)}}switchFlag(t){const e=this.getCell(t);e.isFlagged()?(e.setFlag(!1),this.emit(d.EVENT_CELL_FLAG_UNSET,t)):(e.setFlag(!0),this.emit(d.EVENT_CELL_FLAG_SET,t))}getNotOpenMinePositions(){const t=[];return this.cells.forEach(e=>{e.forEach(e=>{e.isMined()&&t.push(e.getPosition())})}),t}digMines(t,e){let s=0;do{const i=Math.floor(Math.random()*t),n=Math.floor(Math.random()*t),o=this.getCell({row:i,column:n});i===e.row&&n===e.column||o.isMined()||(o.setMined(),s+=1)}while(s<t)}countSurroundingMines(t){const e=this.getNeighbors(t);let s=0;for(let t=0;t<e.length;t++)e[t].isMined()&&s++;return s}getNeighbors(t){let e=t.row,s=t.column;const i=[];let n=e-1,o=s-1,h=3,l=3;-1===n&&(n=0,h=2),-1===o&&(o=0,l=2),8===n&&(h=2),8===o&&(l=2);for(let t=0;t<h;t++)for(let h=0;h<l;h++){const l=n+t,r=o+h;l===e&&r===s||i.push(this.getCell({row:l,column:r}))}return i}getCell(t){let e=t.row,s=t.column;return this.cells[e][s]}lose(){this.updateGameState(d.STATE_LOSE)}isWin(){return this.openedCellsCount===d.FIELD_SIZE**2-d.MINES_COUNT&&(this.updateGameState(d.STATE_WIN),!0)}updateGameState(t){this.gameState=t,this.emit(d.EVENT_UPDATE_GAME_STATE,t)}}n()(d,"EVENT_CELL_OPENED","onCellOpened"),n()(d,"EVENT_CELL_FLAG_SET","onCellFlagSet"),n()(d,"EVENT_CELL_FLAG_UNSET","onCellFlagUnset"),n()(d,"EVENT_UPDATE_GAME_STATE","onGameStateUpdated"),n()(d,"STATE_INIT","INITIAL"),n()(d,"STATE_PLAYING","PLAYING"),n()(d,"STATE_WIN","WIN"),n()(d,"STATE_LOSE","LOSE"),n()(d,"FIELD_SIZE",10),n()(d,"MINES_COUNT",10);const u={EVENT_LEFT_CLICK:"onLeftClick",EVENT_RIGHT_CLICK:"onRightClick"};class _ extends o.c{constructor(t){super(),n()(this,"positionInField",void 0),n()(this,"assets",void 0),n()(this,"background",void 0),n()(this,"flagIcon",void 0),n()(this,"statusIcon",void 0),this.positionInField=t,this.assets=o.d.shared.resources.game_assets.textures,this.background=new o.f(this.assets.cell_close),this.flagIcon=new o.f(this.assets.flag),this.flagIcon.visible=!1,this.statusIcon=new o.f(this.assets[1]),this.statusIcon.visible=!1,this.addChild(this.background,this.flagIcon,this.statusIcon),this.interactive=!0,this.on("click",this.onLeftClicked,this),this.on("rightclick",this.onRightClicked,this)}reset(){this.statusIcon.visible=!1,this.flagIcon.visible=!1,this.background.texture=this.assets.cell_close,this.on("click",this.onLeftClicked,this),this.interactive=!0}open(t){this.background.texture=this.assets.cell_open,t>0&&(this.statusIcon.texture=this.assets[""+t],this.statusIcon.visible=!0),this.interactive=!1}switchFlag(t){this.flagIcon.visible=t,t?this.off("click",this.onLeftClicked,this):this.on("click",this.onLeftClicked,this)}showMine(){this.flagIcon.visible=!1,this.statusIcon.texture=this.assets.bomb,this.statusIcon.visible=!0}onLeftClicked(){this.emit(u.EVENT_LEFT_CLICK,this.positionInField)}onRightClicked(){this.emit(u.EVENT_RIGHT_CLICK,this.positionInField)}}n()(_,"CELL_SIZE",32);class C extends o.c{constructor(){super(),n()(this,"count",void 0),n()(this,"value",void 0);const t=new o.f(o.d.shared.resources.game_assets.textures.bomb);t.anchor.set(1,.5),this.count=new o.b("",{font:{size:28,name:"LibelSuit"},tint:0}),this.count.anchor=new o.e(0,.5),this.count.x=10,this.addChild(t,this.count)}setCount(t){this.value!==t&&(this.value=t,this.count.text=t.toString())}increase(){this.setCount(this.value+1)}decrease(){this.setCount(this.value-1)}}class T extends o.c{constructor(t){super(),n()(this,"model",void 0),n()(this,"cells",void 0),n()(this,"mineIndicator",void 0),n()(this,"gameState",void 0),this.model=t,this.model.on(d.EVENT_UPDATE_GAME_STATE,this.onGameStateUpdated,this),this.model.on(d.EVENT_CELL_OPENED,this.onCellOpened,this),this.model.on(d.EVENT_CELL_FLAG_SET,this.onCellFlagSet,this),this.model.on(d.EVENT_CELL_FLAG_UNSET,this.onCellFlagUnset,this),this.cells=[];const e=new o.c;e.position.set(l.GAME_CENTER_X,l.GAME_CENTER_Y),this.addChild(e);const s=t.getField();for(let t=0;t<s.length;t++){this.cells[t]=[];for(let i=0;i<s[t].length;i++){const n=new _(s[t][i].getPosition());n.on(u.EVENT_LEFT_CLICK,t=>this.emit(u.EVENT_LEFT_CLICK,t)),n.on(u.EVENT_RIGHT_CLICK,t=>this.emit(u.EVENT_RIGHT_CLICK,t)),n.position.set(_.CELL_SIZE*t,_.CELL_SIZE*i),this.cells[t].push(n),e.addChild(n)}}const i=_.CELL_SIZE*(d.FIELD_SIZE-1);e.position.set(l.GAME_CENTER_X-.5*i,l.GAME_CENTER_Y-.5*i);const h=new a("PAUSE");h.on("click",()=>{this.emit(T.EVENT_PAUSE_BUTTON_CLICK)}),h.position.set(800,l.GAME_CENTER_Y-100),this.mineIndicator=new C,this.mineIndicator.setCount(d.MINES_COUNT),this.mineIndicator.position.set(800,l.GAME_CENTER_Y),this.gameState=new o.b("",{font:{size:50,name:"LibelSuit"},tint:42263}),this.gameState.anchor=.5,this.gameState.position.set(l.GAME_CENTER_X,50),this.addChild(h,this.mineIndicator,this.gameState)}reset(){this.cells.forEach(t=>{t.forEach(t=>t.reset())}),this.mineIndicator.setCount(d.MINES_COUNT),this.gameState.text=""}onGameStateUpdated(t){t===d.STATE_LOSE?this.showLose():t===d.STATE_WIN&&this.showWin()}onCellOpened(t,e){this.getCell(t).open(e)}onCellFlagSet(t){this.getCell(t).switchFlag(!0),this.mineIndicator.decrease()}onCellFlagUnset(t){this.getCell(t).switchFlag(!1),this.mineIndicator.increase()}showWin(){this.gameState.text="WIN",this.gameState.tint=42263}showLose(){this.gameState.text="LOSE",this.gameState.tint=14420747,this.showMines()}showMines(){this.model.getNotOpenMinePositions().forEach(t=>{let e=t.row,s=t.column;this.cells[e][s].showMine()})}getCell(t){let e=t.row,s=t.column;return this.cells[e][s]}}n()(T,"EVENT_PAUSE_BUTTON_CLICK","onPauseButtonClicked");class g{constructor(t,e){n()(this,"model",void 0),n()(this,"view",void 0),this.model=t,this.view=e,this.view.on(u.EVENT_LEFT_CLICK,this.onViewLeftClick,this),this.view.on(u.EVENT_RIGHT_CLICK,this.onViewRightClick,this)}resetGame(){this.model.reset(),this.view.reset()}onViewLeftClick(t){this.model.openCell(t,!1)}onViewRightClick(t){this.model.switchFlag(t)}}class N{constructor(t){n()(this,"stage",void 0),n()(this,"scenes",void 0),n()(this,"currentSceneId",void 0),this.stage=t,this.scenes=new Map}addScene(t,e,s){void 0===s&&(s=!1),this.scenes.set(t,e),e.visible=!1,this.stage.addChild(e),s&&this.show(t)}show(t){if(this.currentSceneId!==t){if(!this.scenes.has(t))throw new Error("Undefined scene: "+t);this.currentSceneId&&(this.scenes.get(this.currentSceneId).visible=!1),this.scenes.get(t).visible=!0,this.currentSceneId=t}}}class I extends o.c{constructor(){super();const t=new a("CONTINUE");t.on("click",()=>{this.emit(I.EVENT_CONTINUE_BUTTON_CLICK)}),t.position.set(l.GAME_CENTER_X,l.GAME_CENTER_Y-100);const e=new a("MAIN MENU");e.on("click",()=>{this.emit(I.EVENT_MAIN_MENU_BUTTON_CLICK)}),e.position.set(l.GAME_CENTER_X,l.GAME_CENTER_Y+100),this.addChild(t,e)}}n()(I,"EVENT_CONTINUE_BUTTON_CLICK","onContinueButtonClick"),n()(I,"EVENT_MAIN_MENU_BUTTON_CLICK","onNewGameButtonClick"),window.onload=(()=>{new m});class m{constructor(){n()(this,"app",void 0),n()(this,"scenesController",void 0),n()(this,"gameController",void 0);const t={width:l.GAME_WIDTH,height:l.GAME_HEIGHT,backgroundColor:0,view:document.getElementById("game")};this.app=new o.a(t),this.app.view.addEventListener("contextmenu",t=>t.preventDefault()),this.scenesController=new N(this.app.stage),(new h).once(h.EVENT_RESOURCED_LOADED,this.onGameResourcedLoaded,this)}onGameResourcedLoaded(){const t=new o.g(o.d.shared.resources.game_assets.textures.game_bg,l.GAME_WIDTH,l.GAME_HEIGHT);this.app.stage.addChild(t),this.initGame()}initGame(){const t=new c;t.on(c.EVENT_BUTTON_CLICK,this.startGame,this),this.scenesController.addScene(r.MAIN_MENU,t,!0);const e=new d,s=new T(e);s.on(T.EVENT_PAUSE_BUTTON_CLICK,()=>{this.scenesController.show(r.PAUSE_MENU)}),this.gameController=new g(e,s),this.scenesController.addScene(r.GAME,s);const i=new I;this.scenesController.addScene(r.PAUSE_MENU,i),i.on(I.EVENT_CONTINUE_BUTTON_CLICK,()=>{this.scenesController.show(r.GAME)}),i.on(I.EVENT_MAIN_MENU_BUTTON_CLICK,()=>{this.scenesController.show(r.MAIN_MENU)})}startGame(){this.gameController.resetGame(),this.scenesController.show(r.GAME)}}}});