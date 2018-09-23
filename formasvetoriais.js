// ------------------------------------
// Formas vetoriais (definida por pontos no plano cartesiano)
// ------------------------------------

function criarCirculoBezier(x,y,raio, qtdPontos) {
	let pontosBezier = [];
	let alfa= (2 * Math.PI)/qtdPontos; //angulo entre um ponto e o seguinte
	let perimetroAngulo = raio*alfa; //perímetro do arco do círculo equivalente ao ângulo considerado
	dBezier = (1/3)*perimetroAngulo; //tamanho do vetor Bezier. Arbitrei que seria 1/3 do perímetro do arco em consideração (assim, os dois vetores ocupam metade do caminho... posso experimentar trocar para 1/3
	
	//percorrer o círculo em fatias até completar os tantos pontos (qtdPontos)
	for (i=0; i<qtdPontos; i++) {
		//sortear um ponto perpendicular ao arco
		let angulo = i*alfa;
		let raioSorteado = raio - (raio/10) + 2*(raio/10)*(Math.random()); //modificar para que as curvas não saiam perfeitinhas. Quanto maior o randômico, mais variada será o traço do círculo.
		let xPonto = x + raioSorteado*Math.cos(angulo);
		let yPonto = y + raioSorteado*Math.sin(angulo);
		
		//neste ponto sorteado, perpendicular ao raio no ângulo, calcular onde cai os pontos auxiliares da curva de Bézier
		let beta = angulo + (Math.PI/2); //ângulo perpendicular ao raio
		let xPontoBezierPosterior = xPonto + dBezier * Math.cos(beta);
		let yPontoBezierPosterior = yPonto + dBezier * Math.sin(beta);
		let xPontoBezierAnterior = xPonto - dBezier * Math.cos(beta);
		let yPontoBezierAnterior = yPonto - dBezier * Math.sin(beta);
		
		//adicionar no vetor os pontos criados para a série de curvas Bezier
		pontosBezier.push([xPontoBezierAnterior, yPontoBezierAnterior]);
		pontosBezier.push([xPonto, yPonto]);
		pontosBezier.push([xPontoBezierPosterior, yPontoBezierPosterior]);
	}
	
	//ao final: remover o primeiro ponto do conjunto (por ser um ponto auxiliar para a cuva de Bezier) e fazer o primeiro ponto também ser o último para que a série volte para o ponto de origem do arco
	let pAuxiliarBezierFinal = pontosBezier.shift(); //remover o primeiro ponto porque ele é um ponto do vetor de bezier e deve ser colocar no final do vetor para fechar os pontos do círculo.
	let pFinal = pontosBezier[0].slice(); //faço uma cópia deste que é o primeiro ponto do círculo, e também deve ser o último.
	pontosBezier.push(pAuxiliarBezierFinal);
	pontosBezier.push(pFinal);
	return pontosBezier;
}

function criarLinhaBezier(x1,y1, x2,y2, qtdPontos) {
	let pontosBezier = [];
	
	let dx = x2-x1;
	let dy = y2-y1;
	let distancia = Math.sqrt(dx*dx + dy*dy);
	let angulo = Math.atan2(dy,dx); //determinada o ângulo da linha que liga os dois pontos
	let anguloPerpendicular = angulo + Math.PI/2; //angulo perpendicular à linha entre os dois pontos
	
	let dDistancia = distancia/qtdPontos;
	let dxDistancia = dx/qtdPontos;
	let dyDistancia = dy/qtdPontos;
	let variacao = distancia/7;
	
	for (i=0; i<=qtdPontos; i++) {
		//calcular o ponto perpendicular à linha
		let xPontoPerpendicular = x1 + i*dxDistancia + (variacao/2)*Math.cos(anguloPerpendicular);
		let yPontoPerpendicular = y1 + i*dyDistancia + (variacao/2)*Math.sin(anguloPerpendicular);
		
		//sortear um ponto entre +variacao/2 e -variacao/2 na direção perpendicular à linha
		let variacaoSorteada = variacao*Math.random();
		let xPontoSorteado = xPontoPerpendicular-(variacaoSorteada)*Math.cos(anguloPerpendicular);
		let yPontoSorteado = yPontoPerpendicular-(variacaoSorteada)*Math.sin(anguloPerpendicular);
		
		//calcular os pontos tangente ao ponto sorteado (paralelos à linha principal)
		let xPerpendicularMenos = xPontoSorteado - (1/3)*dxDistancia;
		let yPerpendicularMenos = yPontoSorteado - (1/3)*dyDistancia;
		let xPerpendicularMais = xPontoSorteado + (1/3)*dxDistancia;
		let yPerpendicularMais = yPontoSorteado + (1/3)*dyDistancia;

		//adicionar os pontos da curva bezier
		pontosBezier.push([xPerpendicularMenos,yPerpendicularMenos]);
		pontosBezier.push([xPontoSorteado,yPontoSorteado]);
		pontosBezier.push([xPerpendicularMais,yPerpendicularMais]);
	}
	
	//remover o primeiro e o último ponto da curva de bezier porque não são necessários
	pontosBezier.shift();
	pontosBezier.pop();
	
	return pontosBezier;
}
