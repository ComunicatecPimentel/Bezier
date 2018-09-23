// ---------------------------------
// MAPEAMENTO entre o Canvas da interface e as Coordenadas de um plano cartesiano
// ---------------------------------

//elementos da inerface do usuário (a tela onde são feitos os desenhos)
var canvas = null,
	ctx = null;
	
//coordenadas da tela (canvas), depende do elemento de interface
var canvasDx, canvasDy;

//dimensões visíveis do Plano Cartesiano (arbitrárias, podendo variar com o zoom)
var coordXMin, coordXMax, coordYMin, coordYMax; 

//variáveis auxiliares, para agilizar o cálculo	
var coordDx, //coordXMax - coordXMin
	coordDy; //coordYMax - coordYMin

var	dXCanvasSobreCoordenadas, //canvasDx/coordDx
	dYCanvasSobreCoordenadas, //canvasDy/coordDy
	dXCoordenadasSobreCanvas, //coordDx/canvasDx
	dYCoordenadasSobreCanvas; //coordDy/canvasDy

	
//Definições do Canvas
function setCanvas(aCanvas) {
	canvas = aCanvas;
	ctx = canvas.getContext("2d");
	canvasDx = canvas.width;
	canvasDy = canvas.height;
	calcularProporcaoEntreCanvasECoordenadas();
}

//Definições do sistema de Coordenadas do plano cartesiano	
function setCoordenadas(xMin, yMin, xMax, yMax) {
	coordXMin = xMin;
	coordXMax = xMax;
	coordYMin = yMin;
	coordYMax = yMax;
	
	coordDx = coordXMax - coordXMin;
	coordDy = coordYMax - coordYMin;
	
	calcularProporcaoEntreCanvasECoordenadas();
}

function calcularProporcaoEntreCanvasECoordenadas(){
	dXCanvasSobreCoordenadas = canvasDx/coordDx;
	dYCanvasSobreCoordenadas = canvasDy/coordDy;
	dXCoordenadasSobreCanvas = coordDx/canvasDx;
	dYCoordenadasSobreCanvas = coordDy/canvasDy;
}

// ---------------------------------
//Mapeamento de um ponto da tela para o sistema de coordenadas, e vice-versa
// ---------------------------------
function getCoordX(telaX) { //retornar a coordenada X dada a posição X da tela
	return coordXMin + telaX * dXCoordenadasSobreCanvas;
}

function getCoordY(telaY) { //retornar a coordenada Y dada a posição Y da tela
	return coordYMax - telaY * dYCoordenadasSobreCanvas;
}

function getTelaX(coordX) { // retornar o ponto X da tela dada a coord X do sistema de coordenadas do plano cartesiano
	return (coordX - coordXMin)  * dXCanvasSobreCoordenadas;
}

function getTelaY(coordY) { // retornar o ponto Y da tela dada a coord Y do sistema de coordenadas do plano cartesiano
	return (coordYMax - coordY)  * dYCanvasSobreCoordenadas;
}

function getTelaDx(coordDx) { //pegar quanto vale Dx na Tela coorespondente à dx do sistema de coordenadas do plano cartesiano
	return coordDx * dXCanvasSobreCoordenadas;
}

//Operações sobre o sistema de coordenadas
function zoom(percentual) { //modificar o sistema de coordenadas em função de um percentual
	var metadeDx = (coordDx*percentual - coordDx)/2;
	var metadeDy = (coordDy*percentual - coordDy)/2;
	setCoordenadas(coordXMin - metadeDx, coordYMin - metadeDy, coordXMax + metadeDx, coordYMax + metadeDy);
}

function moverCoordenadas(dxCoord, dyCoord) {
	coordXMin += dxCoord;
	coordXMax += dxCoord;
	coordYMin += dyCoord;
	coordYMax += dyCoord;
}


// ---------------------------------
// DESENHO na tela, dadas as coordenadas no plano cartesiano
// ---------------------------------
function desenharLinha(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(getTelaX(x1), getTelaY(y1));
	ctx.lineTo(getTelaX(x2), getTelaY(y2));
	ctx.stroke();
}

function desenharCirculo(x1, y1, raio) { 
	ctx.beginPath();
	ctx.arc(getTelaX(x1), getTelaY(y1), getTelaDx(raio), 0, 2 * Math.PI, false);
	ctx.stroke();
}

function desenharCurvaBezier(x1,y1, x2,y2, x3,y3, x4, y4) {
	ctx.beginPath();
	ctx.moveTo(getTelaX(x1), getTelaY(y1));
	ctx.bezierCurveTo(getTelaX(x2), getTelaY(y2), getTelaX(x3), getTelaY(y3), getTelaX(x4), getTelaY(y4));
	ctx.stroke();
}

function desenharSerieBezier(pontos) { //recebe um array de pontos que representam linhas de bezier interconectadas
	ctx.beginPath();
	ctx.moveTo(getTelaX(pontos[0][0]), getTelaY(pontos[0][1]));
	for (let i=1; i<pontos.length; i+=3) {
		ctx.bezierCurveTo(getTelaX(pontos[i][0]), getTelaY(pontos[i][1]), getTelaX(pontos[i+1][0]), getTelaY(pontos[i+1][1]), getTelaX(pontos[i+2][0]), getTelaY(pontos[i+2][1]) );
	}	
	ctx.stroke();
}