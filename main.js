function loadObject(evt) {
    let obj_file = evt.target.files[0];

    if (obj_file) {
        let reader1 = new FileReader();
        reader1.onload = function() {
            object = reader1.result;
        }
        reader1.readAsText(obj_file);
    } else {
        alert("Failed to load file");
    }
}

function loadCamera(evt) {
    let cam_file = evt.target.files[0];

    if (cam_file) {
        let reader2 = new FileReader();
        reader2.onload = function() {
            camera = reader2.result;
        }
        reader2.readAsText(cam_file);
    } else {
        alert("Failed to load file");
    }
}

function loadLight(evt) {
    let lig_file = evt.target.files[0];

    if (lig_file) {
        let reader2 = new FileReader();
        reader2.onload = function() {
            light = reader2.result;
        }
        reader2.readAsText(lig_file);
    } else {
        alert("Failed to load file");
    }
}

function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function createCanvas(){//função que cria um canvas do tamanho máximo disponível.
    let janela = window;
    let documento = document;
    let elemento = documento.documentElement;
    let corpo = documento.getElementsByTagName('body')[0];
    let x = janela.innerWidth || elemento.clientWidth || corpo.clientWidth;//pega o primeiro não nulo
    let y = janela.innerHeight || elemento.clientHeight || corpo.clientHeight;
    corpo.innerHTML += '<canvas id="canvas" width = "  '+(x-15)+'" height="'+(y-30)+'"></canvas>'//qualquer coisa basta aumentar os "-"
}

function orthogonalizeVector(toBeOrthogonal,parameter) {
    let multiplier = ((toBeOrthogonal.x * parameter.x) + (toBeOrthogonal.y * parameter.y) + (toBeOrthogonal.z * parameter.z))
        / (Math.pow((parameter.x),2) + Math.pow(parameter.y,2) + Math.pow(parameter.z,2));
    let returner = {x: (toBeOrthogonal.x - (parameter.x * multiplier)) ,
        y: (toBeOrthogonal.y - (parameter.y * multiplier)) ,
        z: (toBeOrthogonal.z - (parameter.z * multiplier))};
    return returner;
}

function crossProductVector(firstVector,secondVector) {
    let returner = {x:((firstVector.y * secondVector.z) - (firstVector.z * secondVector.y))
        , y:((firstVector.z * secondVector.x) - (firstVector.x * secondVector.z))
        , z:((firstVector.x * secondVector.y) - (firstVector.y * secondVector.x))};
    return returner;
}

function scalarVector(vector, scalar) {
    return {x:(vector.x * scalar) , y:(vector.y * scalar) , z:(vector.z * scalar)};
}

function multiplicateFactorByFactor(firstVector,secondVector){
    return (firstVector.x*secondVector.x) + (firstVector.y*secondVector.y) + (firstVector.z*secondVector.z);
}

function vectorSum(firstVector,secondVector){
    let aux = {x:firstVector.x+secondVector.x, y: firstVector.y+secondVector.y, z: firstVector.z+secondVector.z};
    return aux;
}

function cosinTwoVectors(firstVector,secondVector) {
    let returner = ((firstVector.x * secondVector.x) + (firstVector.y * secondVector.y) + (firstVector.z * secondVector.z));
    return returner;
}

function cosinTwoVectorsNotNormalized(firstVector,secondVector) {
    let returner = ((firstVector.x * secondVector.x) + (firstVector.y * secondVector.y) + (firstVector.z * secondVector.z));
    let returner2 = Math.sqrt(Math.pow(firstVector.x,2) + Math.pow(firstVector.y,2) + Math.pow(firstVector.z,2)) * Math.sqrt(Math.pow(secondVector.x,2) + Math.pow(secondVector.y,2) + Math.pow(secondVector.z,2));
    return returner/returner2;
}

function getNorma(vector) {
    return Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2) + Math.pow(vector.z,2));
}

function normalize(vector) {
    let norma = Math.sqrt(Math.pow((vector.x),2) + Math.pow(vector.y,2) + Math.pow(vector.z,2));
    let returner = {x: (vector.x / norma),y: (vector.y / norma),z: (vector.z / norma)};
    return returner;
}

function toCameraCoordinates() {
    let futureZ = 0;
    let futureY = 0;
    let futureX = 0;
    futureZ = (L_point.z - C_point.z);
    futureY = (L_point.y - C_point.y);
    futureX = (L_point.x - C_point.x);
    L_point.x = (futureX*U_vector.x + futureY*U_vector.y + futureZ*U_vector.z);
    L_point.y = (futureX*V_vector.x + futureY*V_vector.y + futureZ*V_vector.z);
    L_point.z = (futureX*N_vector.x + futureY*N_vector.y + futureZ*N_vector.z);
    for (let i = 0; i < pointsArray.length; i++) {
        futureZ = (pointsArray[i].z - C_point.z);
        futureY = (pointsArray[i].y - C_point.y);
        futureX = (pointsArray[i].x - C_point.x);
        pointsArray[i].x = (futureX*U_vector.x + futureY*U_vector.y + futureZ*U_vector.z);
        pointsArray[i].y = (futureX*V_vector.x + futureY*V_vector.y + futureZ*V_vector.z);
        pointsArray[i].z = (futureX*N_vector.x + futureY*N_vector.y + futureZ*N_vector.z);
    }
}

function calculateTrianglesNormal() {
    let firstVector = undefined;
    let secondVector = undefined;
    let normal = undefined;
    let actualTriangle = undefined;
    for (let i = 0; i < trianglesArray.length; i++) {
        actualTriangle = trianglesArray[i];
        firstVector = {x:pointsArray[actualTriangle.first].x - pointsArray[actualTriangle.second].x,
                        y:pointsArray[actualTriangle.first].y - pointsArray[actualTriangle.second].y,
                        z:pointsArray[actualTriangle.first].z - pointsArray[actualTriangle.second].z};
        secondVector = {x:pointsArray[actualTriangle.third].x - pointsArray[actualTriangle.second].x,
                        y:pointsArray[actualTriangle.third].y - pointsArray[actualTriangle.second].y,
                        z:pointsArray[actualTriangle.third].z - pointsArray[actualTriangle.second].z};
        normal = crossProductVector(firstVector,secondVector);
        normal = normalize(normal);
        trianglesArray[i].Nx = normal.x;
        trianglesArray[i].Ny = normal.y;
        trianglesArray[i].Nz = normal.z;
        pointsArray[actualTriangle.first].Nx += normal.x;
        pointsArray[actualTriangle.first].Ny += normal.y;
        pointsArray[actualTriangle.first].Nz += normal.z;
        pointsArray[actualTriangle.second].Nx += normal.x;
        pointsArray[actualTriangle.second].Ny += normal.y;
        pointsArray[actualTriangle.second].Nz += normal.z;
        pointsArray[actualTriangle.third].Nx += normal.x;
        pointsArray[actualTriangle.third].Ny += normal.y;
        pointsArray[actualTriangle.third].Nz += normal.z;
    }
}

function normalizePointNormals() {
    let normalizer = undefined;
    for (let i = 0; i < pointsArray.length; i++) {
        normalizer = {x:pointsArray[i].Nx,y:pointsArray[i].Ny,z:pointsArray[i].Nz};
        normalizer = normalize(normalizer);
        pointsArray[i].Nx = normalizer.x;
        pointsArray[i].Ny = normalizer.y;
        pointsArray[i].Nz = normalizer.z;
    }
}

function distanceTriangleOrigin() {
    let first = undefined;
    let second = undefined;
    let third = undefined;
    let distance = 0;
    for (let i = trianglesArray.length - 1; i > -1; i--) {
        first = pointsArray[trianglesArray[i].first];
        second = pointsArray[trianglesArray[i].second];
        third = pointsArray[trianglesArray[i].third];
        let aux = {x:((first.x + second.x + third.x)/3)
            ,y:((first.y + second.y + third.y)/3)
            ,z:((first.z + second.z + third.z)/3)};
        distance = Math.sqrt(Math.pow(aux.x,2) + Math.pow(aux.y,2) + Math.pow(aux.z,2));
        trianglesArray[i].distance = distance;
    }
}

function getReflectionVector(normalVector,lightVector){
    let aux = scalarVector(normalVector,(2 * (cosinTwoVectors(normalVector,lightVector))));
    return {x:aux.x-lightVector.x,y:aux.y-lightVector.y,z:aux.z-lightVector.z};
}

function flatToScreenPoint() {
    for (let i = 0; i < pointsArray.length; i++) {
        pointsArray[i].Ys = ((pointsArray[i].y * distance_cameraPlane) / (pointsArray[i].z));
        pointsArray[i].Xs = ((pointsArray[i].x * distance_cameraPlane) / (pointsArray[i].z));
    }
}

function screenToPixels() {
    for (let i = 0; i < pointsArray.length; i++) {
        pointsArray[i].Px = Math.floor(horizontalCanvas * ((1 + (pointsArray[i].Xs / halfWidth)))/2);
        pointsArray[i].Py = Math.floor(verticalCanvas * ((1 - (pointsArray[i].Ys / halfHeight)))/2);
    }
}

function pixelsToscreen(pX,pY) {
    return {xS:(((((pX + 0.5) / horizontalCanvas) * 2) -1) * halfWidth), yS:(((((pY + 0.5) / verticalCanvas) * 2) -1) * halfHeight)};
}

function getLineGrowth(firstPoint,secondPoint){
    return ((firstPoint.Ys - secondPoint.Ys) / (firstPoint.Xs - secondPoint.Xs));//isso vai retornar o a, mas para usar o 1/a, basta inverter
}

function calculateBaricentricFactors(firstX, firstY, secondX, secondY, thirdX, thirdY, aimX, aimY) {
    let first = {x: thirdX - firstX, y:thirdY - firstY, z:0};
    let second = {x: secondX - firstX, y:secondY - firstY, z:0};
    let cosin = cosinTwoVectorsNotNormalized(first,second);
    let barFactors = {alpha: 0, beta: 0, gama: 0};
    if (cosin != -1 && cosin != 1) {
        first = {x: thirdX - firstX, y:thirdY - firstY, z:0};
        second = {x: secondX - firstX, y:secondY - firstY, z:0};
        let areaTriangle = getNorma(crossProductVector(first,second));
        first = {x: thirdX - aimX, y:thirdY - aimY, z:0};
        second = {x: secondX - aimX, y:secondY - aimY, z:0};
        barFactors.alpha = getNorma(crossProductVector(first,second)) / areaTriangle;
        first = {x: thirdX - aimX, y:thirdY - aimY, z:0};
        second = {x: firstX - aimX, y:firstY - aimY, z:0};
        barFactors.beta = getNorma(crossProductVector(first,second)) / areaTriangle;
        first = {x: secondX - aimX, y:secondY - aimY, z:0};
        second = {x: firstX - aimX, y:firstY - aimY, z:0};
        barFactors.gama = getNorma(crossProductVector(first,second)) / areaTriangle;
    } else if (cosin == -1) {
        barFactors.alpha = 0;
        let sizeLine = Math.sqrt(Math.pow((thirdX - secondX),2) + Math.pow((thirdY - secondY),2));
        barFactors.beta = Math.sqrt(Math.pow((secondX - aimX),2) + Math.pow((secondY - aimY),2)) / sizeLine;
        barFactors.gama = Math.sqrt(Math.pow((thirdX - aimX),2) + Math.pow((thirdY - aimY),2)) / sizeLine;
    } else {
        let norma1 = getNorma(first);
        let norma2 = getNorma(second);
        if (norma1 >= norma2) {
            barFactors.beta = 0;
            let sizeLine = Math.sqrt(Math.pow((thirdX - firstX),2) + Math.pow((thirdY - firstY),2));
            barFactors.alpha = Math.sqrt(Math.pow((firstX - aimX),2) + Math.pow((firstY - aimY),2)) / sizeLine;
            barFactors.gama = Math.sqrt(Math.pow((thirdX - aimX),2) + Math.pow((thirdY - aimY),2)) / sizeLine;
        } else {
            barFactors.gama = 0;
            let sizeLine = Math.sqrt(Math.pow((secondX - firstX),2) + Math.pow((secondY - firstY),2));
            barFactors.alpha = Math.sqrt(Math.pow((firstX - aimX),2) + Math.pow((firstY - aimY),2)) / sizeLine;
            barFactors.beta = Math.sqrt(Math.pow((secondX - aimX),2) + Math.pow((secondY - aimY),2)) / sizeLine;
        }
    }
    /*let B = [[1,1,1,1],[firstX,secondX,thirdX,aimX],[firstY,secondY,thirdY,aimY]];
    let factor1 = 0;
    let factor2 = 0;
    let RowFinal = 3;
    let ColFinal = 4;
    for (let i = 0; i < RowFinal; i++) {
        if (B[i][i] == 0 && i < (RowFinal -1)) {
            let aux = -1;
            for (let j = i; j<RowFinal; j++) {
                if (B[j][i] != 0) {
                    aux = j;
                    j=RowFinal;
                }
            }
            if (aux == -1) {
                i++;
            } else {
                for (let k = 0; k <ColFinal; k++) {
                    let auxiliar = B[aux][k];
                    B[aux][k] = B[i][k];
                    B[i][k] = auxiliar;
                }
            }
        }
        factor1 = 1 / B[i][i];
        for (let j = 0; j <RowFinal; j++) {
            factor2 = B[j][i] * factor1;
            if (i != j) {
                for (let k = i; k <ColFinal; k++) {
                    B[j][k] = B[j][k] - (B[i][k] * factor2);
                }
            }
        }
        for (let k = i; k <4; k++) {
            B[i][k] = B[i][k] * factor1;
        }
    }*/
    //ctx.fillText(B[0][0] + ' ' + B[0][1] + ' ' + B[0][2] + ' ' + B[0][3], 10, 10);
    //ctx.fillText(B[1][0] + ' ' + B[1][1] + ' ' + B[1][2] + ' ' + B[1][3], 10, 30);
    //ctx.fillText(B[2][0] + ' ' + B[2][1] + ' ' + B[2][2] + ' ' + B[2][3], 10, 50);
    return barFactors;
}

function calculateBaricentricSum(first,second,third,factors) {
    return {x : (first.x * factors.alpha) + (second.x * factors.beta) + (third.x * factors.gama),
        y : (first.y * factors.alpha) + (second.y * factors.beta) + (third.y * factors.gama),
        z : (first.z * factors.alpha) + (second.z * factors.beta) + (third.z * factors.gama)};
}

function calculateBaricentricNormal(first,second,third,factors) {
    let returner = {x : (first.Nx * factors.alpha) + (second.Nx * factors.beta) + (third.Nx * factors.gama),
        y : (first.Ny * factors.alpha) + (second.Ny * factors.beta) + (third.Ny * factors.gama),
        z : (first.Nz * factors.alpha) + (second.Nz * factors.beta) + (third.Nz * factors.gama)};
    return normalize(returner);
}

function calculateLightVector(point,lightPosition) {
    let returner = {x:lightPosition.x - point.x,y:lightPosition.y - point.y,z:lightPosition.z - point.z};
    return normalize(returner);
}

function calculateVisionVector(point) {
    let returner = scalarVector(point,-1);
    return normalize(returner);
}

function calculateColor(vector_N,vector_L,vector_R,vector_V) {
    let rgb_COLOR = {r:0,g:0,b:0};
    if (cosinTwoVectors(vector_N,vector_V) < 0) {
        vector_N = scalarVector(vector_N,-1);
    }
    if (cosinTwoVectors(vector_N,vector_L) < 0) {
        rgb_COLOR.r = ARef_constant * A_color.r;
        rgb_COLOR.g = ARef_constant * A_color.g;
        rgb_COLOR.b = ARef_constant * A_color.b;
    } else {
        let difuPart = Difu_constant * cosinTwoVectors(vector_N,vector_L);
        if (cosinTwoVectors(vector_V,vector_R) < 0) {
            rgb_COLOR.r = (ARef_constant * A_color.r) + (L_color.r * D_vector.r * difuPart);
            rgb_COLOR.g = (ARef_constant * A_color.g) + (L_color.g * D_vector.g * difuPart);
            rgb_COLOR.b = (ARef_constant * A_color.b) + (L_color.b * D_vector.b * difuPart);
        } else {
            let specPart = (Spec_constant * Math.pow(cosinTwoVectors(vector_R,vector_V),Rugo_constant));
            rgb_COLOR.r = (ARef_constant * A_color.r) + (L_color.r * ((D_vector.r * difuPart) + specPart));
            rgb_COLOR.g = (ARef_constant * A_color.g) + (L_color.g * ((D_vector.g * difuPart) + specPart));
            rgb_COLOR.b = (ARef_constant * A_color.b) + (L_color.b * ((D_vector.b * difuPart) + specPart));
        }
    }
    if (rgb_COLOR.r > 255) {
        rgb_COLOR.r = 255;
    }
    if (rgb_COLOR.g > 255) {
        rgb_COLOR.g = 255;
    }
    if (rgb_COLOR.b > 255) {
        rgb_COLOR.b = 255;
    }
    return rgb_COLOR;
}

function scanLine(triangle) {
    let pointsAux = [];
    pointsAux.push(pointsArray[triangle.first]);
    pointsAux.push(pointsArray[triangle.second]);
    pointsAux.push(pointsArray[triangle.third]);
    pointsAux.sort(function(a,b) {return a.Py - b.Py});
    let xMin = 0;
    let xMax = 0;
    let yMax = pointsAux[2].Py;
    let firstLineGrowth = 0;
    let secondLineGrowth = 0;
    let thirdLineGrowth = 0;
    let pointScreen = undefined;
    let bariSum = undefined;
    let pointToBe = {x:0,y:0,z:0};
    let vector_N = {x:0,y:0,z:0};
    let vector_L = {x:0,y:0,z:0};
    let vector_R = {x:0,y:0,z:0};
    let vector_V = {x:0,y:0,z:0};
    let rgb_COLOR = {r:0,g:0,b:0};
    let thirdLiner = 'FALSE';
    if (pointsAux[0].Py == pointsAux[1].Py) {
        if (pointsAux[0].Px > pointsAux[1].Px) {
            let aux = pointsAux[0];
            pointsAux[0] = pointsAux[1];
            pointsAux[1] = aux;
        }
        xMin = pointsAux[0].Px;
        xMax = pointsAux[1].Px;

        firstLineGrowth = (1 / getLineGrowth(pointsAux[0],pointsAux[2]));
        secondLineGrowth = (1 / getLineGrowth(pointsAux[1],pointsAux[2]));

        for (let yScan = pointsAux[0].Py; yScan <= yMax; yScan++) {
            for (let actual = Math.floor(xMin); actual <= Math.floor(xMax); actual++){
                if (actual >= 0 && actual < horizontalCanvas && yScan >=0 && yScan < verticalCanvas) {
                    pointScreen = pixelsToscreen(actual,yScan);
                    bariSum = calculateBaricentricFactors(pointsAux[0].Xs,pointsAux[0].Ys,pointsAux[1].Xs,pointsAux[1].Ys,pointsAux[2].Xs,pointsAux[2].Ys,pointScreen.xS,pointScreen.yS);
                    pointToBe = calculateBaricentricSum(pointsAux[0],pointsAux[1],pointsAux[2],bariSum);
                    if (pointToBe.z < rgbMatrix[actual][yScan].z) {
                        rgbMatrix[actual][yScan].z = pointToBe.z;
                        vector_N = calculateBaricentricNormal(pointsAux[0],pointsAux[2],pointsAux[1],bariSum);
                        vector_L = calculateLightVector(pointToBe,L_point);
                        vector_R = getReflectionVector(vector_N,vector_L);
                        vector_R = normalize(vector_R);
                        vector_V = calculateVisionVector(pointToBe);
                        rgb_COLOR = calculateColor(vector_N,vector_L,vector_R,vector_V);
                        rgbMatrix[actual][yScan].r = rgb_COLOR.r;
                        rgbMatrix[actual][yScan].g = rgb_COLOR.g;
                        rgbMatrix[actual][yScan].b = rgb_COLOR.b;
                    }
                }
            }
            xMin += firstLineGrowth;
            xMax += secondLineGrowth;
        }
    } else {
        xMin = pointsAux[0].Px;
        xMax = pointsAux[0].Px;
        if (pointsAux[1].Px > pointsAux[2].Px) {
            firstLineGrowth = (1 / getLineGrowth(pointsAux[0],pointsAux[2]));
            secondLineGrowth = (1 / getLineGrowth(pointsAux[0],pointsAux[1]));
            thirdLineGrowth = (1 / getLineGrowth(pointsAux[2],pointsAux[1]));

            for (let yScan = pointsAux[0].Py; yScan <= yMax; yScan++) {
                for (let actual = Math.floor(xMin); actual <= Math.floor(xMax); actual++){
                    if (actual >= 0 && actual < horizontalCanvas && yScan >=0 && yScan < verticalCanvas) {
                        pointScreen = pixelsToscreen(actual,yScan);
                        bariSum = calculateBaricentricFactors(pointsAux[0].Xs,pointsAux[0].Ys,pointsAux[2].Xs,pointsAux[2].Ys,pointsAux[1].Xs,pointsAux[1].Ys,pointScreen.xS,pointScreen.yS);
                        pointToBe = calculateBaricentricSum(pointsAux[0],pointsAux[2],pointsAux[1],bariSum);
                        if (pointToBe.z < rgbMatrix[actual][yScan].z) {
                            rgbMatrix[actual][yScan].z = pointToBe.z;
                            vector_N = calculateBaricentricNormal(pointsAux[0],pointsAux[2],pointsAux[1],bariSum);
                            vector_L = calculateLightVector(pointToBe,L_point);
                            vector_R = getReflectionVector(vector_N,vector_L);
                            vector_R = normalize(vector_R);
                            vector_V = calculateVisionVector(pointToBe);
                            rgb_COLOR = calculateColor(vector_N,vector_L,vector_R,vector_V);
                            rgbMatrix[actual][yScan].r = rgb_COLOR.r;
                            rgbMatrix[actual][yScan].g = rgb_COLOR.g;
                            rgbMatrix[actual][yScan].b = rgb_COLOR.b;
                        }
                    }
                }
                if (yScan == pointsAux[1].Py && thirdLiner == 'FALSE') {
                    if (xMin==pointsAux[2].Px) {
                        thirdLiner = 'LEFT';
                    } else if (xMax == pointsAux[1].Px) {
                        thirdLiner = 'RIGHT';
                    }
                }
                if (thirdLiner == 'FALSE') {
                    xMin += firstLineGrowth;
                    xMax += secondLineGrowth;
                } else if (thirdLiner == 'LEFT') {
                    xMin += thirdLineGrowth;
                    xMax += secondLineGrowth;
                } else if (thirdLiner == 'RIGHT') {
                    xMin += firstLineGrowth;
                    xMax += thirdLineGrowth;
                }
            }
        } else {
            firstLineGrowth = (1 / getLineGrowth(pointsAux[0],pointsAux[1]));
            secondLineGrowth = (1 / getLineGrowth(pointsAux[0],pointsAux[2]));
            thirdLineGrowth = (1 / getLineGrowth(pointsAux[1],pointsAux[2]));

            for (let yScan = pointsAux[0].Py; yScan <= yMax; yScan++) {
                for (let actual = Math.floor(xMin); actual <= Math.floor(xMax); actual++){
                    if (actual >= 0 && actual < horizontalCanvas && yScan >=0 && yScan < verticalCanvas) {
                        pointScreen = pixelsToscreen(actual,yScan);
                        bariSum = calculateBaricentricFactors(pointsAux[0].Xs,pointsAux[0].Ys,pointsAux[1].Xs,pointsAux[1].Ys,pointsAux[2].Xs,pointsAux[2].Ys,pointScreen.xS,pointScreen.yS);
                        pointToBe = calculateBaricentricSum(pointsAux[0],pointsAux[1],pointsAux[2],bariSum);
                        if (pointToBe.z < rgbMatrix[actual][yScan].z) {
                            rgbMatrix[actual][yScan].z = pointToBe.z;
                            vector_N = calculateBaricentricNormal(pointsAux[0],pointsAux[2],pointsAux[1],bariSum);
                            vector_L = calculateLightVector(pointToBe,L_point);
                            vector_R = getReflectionVector(vector_N,vector_L);
                            vector_R = normalize(vector_R);
                            vector_V = calculateVisionVector(pointToBe);
                            rgb_COLOR = calculateColor(vector_N,vector_L,vector_R,vector_V);
                            rgbMatrix[actual][yScan].r = rgb_COLOR.r;
                            rgbMatrix[actual][yScan].g = rgb_COLOR.g;
                            rgbMatrix[actual][yScan].b = rgb_COLOR.b;
                        }
                    }
                }
                if (yScan == pointsAux[1].Py && thirdLiner == 'FALSE') {
                    if (xMin==pointsAux[1].Px) {
                        thirdLiner = 'LEFT';
                    } else if (xMax == pointsAux[2].Px) {
                        thirdLiner = 'RIGHT';
                    }
                }
                if (thirdLiner == 'FALSE') {
                    xMin += firstLineGrowth;
                    xMax += secondLineGrowth;
                } else if (thirdLiner == 'LEFT') {
                    xMin += thirdLineGrowth;
                    xMax += secondLineGrowth;
                } else if (thirdLiner == 'RIGHT') {
                    xMin += firstLineGrowth;
                    xMax += thirdLineGrowth;
                }
            }
        }
    }
}

function drawTriangles() {//algoritmo do pintor
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i = 0; i < horizontalCanvas; i++) {
        for (let j = 0; j < verticalCanvas; j++) {
            ctx.fillStyle = "rgb(" + rgbMatrix[i][j].r + "," + rgbMatrix[i][j].g + ","+ rgbMatrix[i][j].b + ")";
            ctx.fillRect( i, j, 1, 1 );
        }
    }
}


let container = document.getElementById('container');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let btn_obj = document.getElementById('objInput');
let btn_cam = document.getElementById('camInput');
let btn_lig = document.getElementById('ligInput');
let button_container = document.getElementsByClassName('btns-group');
let button_loaders = document.getElementsByClassName('btns-load');
let btn_visual_obj = document.getElementById('btn_obj');
let btn_visual_cam = document.getElementById('btn_cam');
let btn_visual_lig = document.getElementById('btn_lig');
let btn_start = document.getElementById('btn_start');

btn_obj.addEventListener('change',loadObject);
btn_cam.addEventListener('change',loadCamera);
btn_lig.addEventListener('change',loadLight);
btn_visual_obj.onclick = function clickObj(){btn_obj.click();};
btn_visual_cam.onclick = function clickCam(){btn_cam.click();};
btn_visual_lig.onclick = function clickCam(){btn_lig.click();};
btn_start.onclick = function doTheThing() {
    //let tester =  calculateBaricentricFactors(0,12,0,9,2,4,1,7);
    //ctx.fillText(tester.alpha + ' ' + tester.beta + ' ' + tester.gama, 10, 100);
    light = light.split(/[\r\n\s]+/).filter(function(el) {return (el.length > 0)});
    L_point = {x:parseFloat(light[0]),y:parseFloat(light[1]),z:parseFloat(light[2])};
    ARef_constant = parseFloat(light[3]);
    A_color = {r:parseFloat(light[4]),g:parseFloat(light[5]),b:parseFloat(light[6])};
    Difu_constant = parseFloat(light[7]);
    D_vector = {r:parseFloat(light[8]),g:parseFloat(light[9]),b:parseFloat(light[10])};
    Spec_constant = parseFloat(light[11]);
    L_color = {r:parseFloat(light[12]),g:parseFloat(light[13]),b:parseFloat(light[14])};
    Rugo_constant = parseFloat(light[15]);
    camera = camera.split(/[\r\n\s]+/).filter(function(el) {return ((el.length >0))});
    C_point = {x:parseFloat(camera[0]),y:parseFloat(camera[1]),z:parseFloat(camera[2])};
    N_vector = {x:parseFloat(camera[3]),y:parseFloat(camera[4]),z:parseFloat(camera[5])};
    V_vector = {x:parseFloat(camera[6]),y:parseFloat(camera[7]),z:parseFloat(camera[8])};
    distance_cameraPlane = parseFloat(camera[9]);
    halfWidth = parseFloat(camera[10]);
    halfHeight = parseFloat(camera[11]);
    horizontalCanvas = Math.ceil((verticalCanvas/(halfHeight*2))*(halfWidth*2));
    resizeCanvas(horizontalCanvas,verticalCanvas);
    basicRGB.r = A_color.r;
    basicRGB.g = A_color.g;
    basicRGB.b = A_color.b;
    rgbMatrix = [...Array(horizontalCanvas)].map(i => Array(verticalCanvas).fill(basicRGB));
    V_vector = orthogonalizeVector(V_vector,N_vector);
    U_vector = crossProductVector(N_vector,V_vector);
    N_vector = normalize(N_vector);
    V_vector = normalize(V_vector);
    U_vector = normalize(U_vector);
    pointsArray = [];
    trianglesArray = [];
    object = object.split(/[\r\n\s]+/).filter(function(el) {return ((el.length >0))});
    let points = parseFloat(object[0]);
    let triangles = parseFloat(object[1]);
    let initPoints = 2;
    let initTriangles = 2 + (points*3);
    let end = initTriangles + (triangles * 3);
    for (let i = initPoints; i < initTriangles; i+=3) {
        pointsArray.push({x:parseFloat(object[i]),y:parseFloat(object[i+1]),z:parseFloat(object[i+2]),Nx:0,Ny:0,Nz:0,Xs:0,Ys:0,Px:0,Py:0});
    }
    for (let i = initTriangles; i < end; i+=3) {
        trianglesArray.push({first:(parseFloat(object[i])-1),second:(parseFloat(object[i+1]))-1,third:(parseFloat(object[i+2])-1),distance:0,Nx:0,Ny:0,Nz:0});
    }
    toCameraCoordinates();
    calculateTrianglesNormal();
    normalizePointNormals();
    distanceTriangleOrigin();
    flatToScreenPoint();
    screenToPixels();
    trianglesArray.sort(function(a, b){return a.distance - b.distance});
    for (let i = 0; i < trianglesArray.length; i++) {
        scanLine(trianglesArray[i]);
    }
    ctx.fillText("got here", 10, 10);
    //drawTriangles();
};

let object = undefined;
let camera = undefined;
let light = undefined;
let C_point = undefined;
let N_vector = undefined;
let V_vector = undefined;
let U_vector = undefined;
let distance_cameraPlane = undefined;
let halfWidth = 16;
let halfHeight = 9;
let L_point = undefined;
let A_color = undefined;
let L_color = undefined;
let D_vector = undefined;
let Rugo_constant = 0;
let Spec_constant = 0;
let Difu_constant = 0;
let ARef_constant = 0;
let basicRGB = {r:0,g:0,b:0,z:Infinity};

let pointsArray = [];
let trianglesArray = [];
let rgbMatrix = undefined;
let verticalCanvas = 640;
let horizontalCanvas = Math.floor((verticalCanvas/(halfHeight*2))*(halfWidth*2));
resizeCanvas(horizontalCanvas,verticalCanvas);