// LOAD OBJECTS

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

// FUNCTION TO ARRANGE CANVAS

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

// ATOMIC FUNCTIONS

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
    return (firstVector.x*secondVector.x) + (firstVector.y*secondVector.y);// + (firstVector.z*secondVector.z);
}

function vectorSum(firstVector,secondVector){
    let aux = {x:firstVector.x+secondVector.x, y: firstVector.y+secondVector.y, z: firstVector.z+secondVector.z};
    return aux;
}

function cosineTwoVectorsNormalized(firstVector, secondVector) {
    let returner = ((firstVector.x * secondVector.x) + (firstVector.y * secondVector.y) + (firstVector.z * secondVector.z));
    return returner;
}

function cosineTwoVectorsNotNormalized(firstVector,secondVector) {
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

function screenToPixelsX_axisNotFloored(x_Screen) {
    return horizontalCanvas * ((1 + (x_Screen / halfWidth))/2);
}

function pixelsToScreen(pX, pY) {
    return {xS:(((((pX -0.5) / horizontalCanvas) * 2) - 1) * halfWidth), yS:((((((pY - 0.5) / verticalCanvas) * 2) - 1) * halfHeight) * -1)};
}

function getInverseLineGrowth(firstPoint, secondPoint){
    let lineGrowth = 0;
    if ((secondPoint.Py - firstPoint.Py) != 0) {
        lineGrowth = ((secondPoint.Px - firstPoint.Px) / (secondPoint.Py - firstPoint.Py));
    } else {
        lineGrowth = 0;
    }
    return lineGrowth;
}

// SIMPLE FUNCTIONS

function projectionAonB(vector_A,vector_B) {
    let factor = cosineTwoVectorsNormalized(vector_A,vector_B) / Math.sqrt(cosineTwoVectorsNormalized(vector_B,vector_B));
    return {x: vector_B.x * factor , y: vector_B.y * factor , z: vector_B.z * factor };
}

function reflectNormal(vector_N,vector_V) {
    let verticalVector = scalarVector(vector_V,cosineTwoVectorsNormalized(vector_N,vector_V));
    verticalVector = vectorSum(vector_N,scalarVector(verticalVector,-1));
    let newNormal = getReflectionVector(verticalVector,vector_N);
    return newNormal;
}

function calculateBarycentricFactors(firstX, firstY, secondX, secondY, thirdX, thirdY, aimX, aimY) {
    let v0 = {x: secondX - firstX, y:secondY - firstY};//, z:0};
    let v1 = {x: thirdX - firstX, y:thirdY - firstY};//, z:0};
    let v2 = {x: aimX - firstX, y:aimY - firstY};//, z:0};
    let d00 = multiplicateFactorByFactor(v0,v0);
    let d01 = multiplicateFactorByFactor(v0,v1);
    let d11 = multiplicateFactorByFactor(v1,v1);
    let d20 = multiplicateFactorByFactor(v2,v0);
    let d21 = multiplicateFactorByFactor(v2,v1);
    let denom = (d00 * d11) - (d01 * d01);
    let v = ((d11 * d20) - (d01 * d21)) / denom;
    let w = ((d00 * d21) - (d01 * d20)) / denom;
    let u = 1 - v - w;
    let barFactors = {alpha: u, beta: v, gama: w};
    return barFactors;
}

function calculateBarycentricSum(first, second, third, factors) {
    return {x : (first.x * factors.alpha) + (second.x * factors.beta) + (third.x * factors.gama),
        y : (first.y * factors.alpha) + (second.y * factors.beta) + (third.y * factors.gama),
        z : (first.z * factors.alpha) + (second.z * factors.beta) + (third.z * factors.gama)};
}

function calculateBarycentricNormal(first, second, third, factors) {
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

function getReflectionVector(normalVector,vectorToReflect){
    let aux = scalarVector(normalVector,(2 * (cosineTwoVectorsNormalized(normalVector,vectorToReflect))));
    return {x:aux.x-vectorToReflect.x,y:aux.y-vectorToReflect.y,z:aux.z-vectorToReflect.z};
}

// COMPLEX FUNCTIONS

function calculateColor(vector_N,vector_L,vector_R,vector_V,z_Buffer) {
    let rgb_COLOR = {r:0,g:0,b:0,z:z_Buffer};
    if (cosineTwoVectorsNormalized(vector_N,vector_V) < 0) {
        vector_N = reflectNormal(vector_N,vector_V);
    }
    if (cosineTwoVectorsNormalized(vector_N,vector_L) < 0) {
        rgb_COLOR.r = ARef_constant * A_color.r;
        rgb_COLOR.g = ARef_constant * A_color.g;
        rgb_COLOR.b = ARef_constant * A_color.b;
    } else {
        let difuPart = Difu_constant * cosineTwoVectorsNormalized(vector_N,vector_L);
        if (cosineTwoVectorsNormalized(vector_V,vector_R) < 0) {
            rgb_COLOR.r = (ARef_constant * A_color.r) + (L_color.r * D_vector.r * difuPart);
            rgb_COLOR.g = (ARef_constant * A_color.g) + (L_color.g * D_vector.g * difuPart);
            rgb_COLOR.b = (ARef_constant * A_color.b) + (L_color.b * D_vector.b * difuPart);
        } else {
            let specPart = (Spec_constant * Math.pow(cosineTwoVectorsNormalized(vector_R,vector_V),Rugo_constant));
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

    rgb_COLOR.r = Math.floor(rgb_COLOR.r);
    rgb_COLOR.g = Math.floor(rgb_COLOR.g);
    rgb_COLOR.b = Math.floor(rgb_COLOR.b);

    return rgb_COLOR;
}

function zBuffer(pointToBe,pointsAux,actual,yScan,bariFactors){
    if (pointToBe.z < rgbMatrix[actual][yScan].z) {
        let vector_N = calculateBarycentricNormal(pointsAux[0],pointsAux[1],pointsAux[2],bariFactors);
        let vector_L = calculateLightVector(pointToBe,L_point);
        let vector_R = getReflectionVector(vector_N,vector_L);
        vector_R = normalize(vector_R);
        let vector_V = calculateVisionVector(pointToBe);
        let rgb_COLOR = calculateColor(vector_N,vector_L,vector_R,vector_V,pointToBe.z);
        rgbMatrix[actual][yScan] = rgb_COLOR;
    }
}

// LOOP MAIN FUNCTIONS

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

function flatToScreenPoint() {
    for (let i = 0; i < pointsArray.length; i++) {
        pointsArray[i].Ys = ((pointsArray[i].y * distance_cameraPlane) / (pointsArray[i].z));
        pointsArray[i].Xs = ((pointsArray[i].x * distance_cameraPlane) / (pointsArray[i].z));
    }
}

function screenToPixels() {
    for (let i = 0; i < pointsArray.length; i++) {
        pointsArray[i].Px = Math.floor(horizontalCanvas * ((1 + (pointsArray[i].Xs / halfWidth))/2));
        pointsArray[i].Py = Math.floor(verticalCanvas * ((1 - (pointsArray[i].Ys / halfHeight))/2));
    }
}

function scanLine() {
    let pointsAux = [];
    let xMin = 0;
    let xMax = 0;
    let yMax = 0;
    let firstLineGrowth = 0;
    let secondLineGrowth = 0;
    let thirdLineGrowth = 0;
    let pointScreen = undefined;
    let bariFactors = undefined;
    let pointToBe = {x:0,y:0,z:0};
    let auxiliar = undefined;
    let thirdLiner = 'FALSE';
    let flippedTriangle = 'F';
    for (let i = 0; i < trianglesArray.length; i++) {
        pointsAux = [];
        pointsAux.push(pointsArray[trianglesArray[i].first]);
        pointsAux.push(pointsArray[trianglesArray[i].second]);
        pointsAux.push(pointsArray[trianglesArray[i].third]);
        pointsAux.sort(function(a,b) {return a.Py - b.Py}); // Making sort of the points by Y position on screen crescent order
        yMax = pointsAux[2].Py;
        thirdLiner = 'FALSE';
        flippedTriangle = 'F';
        if (pointsAux[0].Py == pointsAux[1].Py) { // Case of the triangle that has a flat base on the top

            if (pointsAux[0].Px > pointsAux[1].Px) {
                let aux = pointsAux[0];
                pointsAux[0] = pointsAux[1];
                pointsAux[1] = aux;
            }
            xMin = screenToPixelsX_axisNotFloored(pointsAux[0].Xs);
            xMax = screenToPixelsX_axisNotFloored(pointsAux[1].Xs);
            firstLineGrowth = (getInverseLineGrowth(pointsAux[0], pointsAux[2]));
            secondLineGrowth = (getInverseLineGrowth(pointsAux[1], pointsAux[2]));

        } else {
            // Calculating the x coordinate of the pixel without floor operation to grant geometric cohesion
            xMin = screenToPixelsX_axisNotFloored(pointsAux[0].Xs);
            xMax = screenToPixelsX_axisNotFloored(pointsAux[0].Xs);

            if (pointsAux[1].Px > pointsAux[2].Px) {

                firstLineGrowth = (getInverseLineGrowth(pointsAux[0], pointsAux[2]));
                secondLineGrowth = (getInverseLineGrowth(pointsAux[0], pointsAux[1]));
                //Checking if the triangle points up or down, because it changes the use of line growth inverse
                if (firstLineGrowth > secondLineGrowth && pointsAux[1].Px < pointsAux[0].Px) {
                    auxiliar = firstLineGrowth;
                    firstLineGrowth = secondLineGrowth;
                    secondLineGrowth = auxiliar;
                    flippedTriangle = 'T';
                }

            } else {

                firstLineGrowth = (getInverseLineGrowth(pointsAux[0], pointsAux[1]));
                secondLineGrowth = (getInverseLineGrowth(pointsAux[0], pointsAux[2]));
                //Checking if the triangle points up or down, because it changes the use of line growth inverse
                if (firstLineGrowth > secondLineGrowth && pointsAux[1].Px > pointsAux[0].Px) {
                    auxiliar = firstLineGrowth;
                    firstLineGrowth = secondLineGrowth;
                    secondLineGrowth = auxiliar;
                    flippedTriangle = 'T';
                }

            }
            thirdLineGrowth = (getInverseLineGrowth(pointsAux[1], pointsAux[2]));

        }

        // SCANLINE in fact

        for (let yScan = pointsAux[0].Py; yScan <= yMax; yScan++) {
            for (let actual = Math.floor(xMin); actual <= Math.floor(xMax); actual++){
                //Checking if the pixel is inside the screen
                if (actual >= 0 && actual < horizontalCanvas && yScan >=0 && yScan < verticalCanvas) {
                    // Returns the screen coordinates given a position of a pixel, the actual pixel
                    pointScreen = pixelsToScreen(actual,yScan);
                    bariFactors = calculateBarycentricFactors(pointsAux[0].Xs,pointsAux[0].Ys,pointsAux[1].Xs,pointsAux[1].Ys,pointsAux[2].Xs,pointsAux[2].Ys,pointScreen.xS,pointScreen.yS);
                    pointToBe = calculateBarycentricSum(pointsAux[0],pointsAux[1],pointsAux[2],bariFactors);
                    zBuffer(pointToBe,pointsAux,actual,yScan,bariFactors);
                }
            }

            //Treatment of flipped triangles nad treatment for triangles that are not flat on the base or top

            if (pointsAux[0].Py != pointsAux[1].Py) {
                if (pointsAux[1].Px > pointsAux[2].Px) {
                    // If the vertical operator os the scanner get on the middle vertex of the triangle it changes the growth of the line
                    if (yScan == pointsAux[1].Py && thirdLiner == 'FALSE') {
                        // If the triangle points up the growth goes left
                        if (flippedTriangle == 'T') {
                            thirdLiner = 'LEFT';
                        } else {
                            // If the triangle points down the growth goes right
                            thirdLiner = 'RIGHT';
                        }
                    }
                } else {
                    if (yScan == pointsAux[1].Py && thirdLiner == 'FALSE') {
                        // If the triangle points down the growth goes right
                        if (flippedTriangle == 'T') {
                            thirdLiner = 'RIGHT';
                        } else {
                            // If the triangle points up the growth goes left
                            thirdLiner = 'LEFT';
                        }
                    }
                }
            }
            // Adds the right growth to the xMin and xMax
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

function putColorInScreen() {
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

    // Loading light variables

    light = light.split(/[\r\n\s]+/).filter(function(el) {return (el.length > 0)});
    L_point = {x:parseFloat(light[0]),y:parseFloat(light[1]),z:parseFloat(light[2])};
    ARef_constant = parseFloat(light[3]);
    A_color = {r:parseFloat(light[4]),g:parseFloat(light[5]),b:parseFloat(light[6])};
    Difu_constant = parseFloat(light[7]);
    D_vector = {r:parseFloat(light[8]),g:parseFloat(light[9]),b:parseFloat(light[10])};
    Spec_constant = parseFloat(light[11]);
    L_color = {r:parseFloat(light[12]),g:parseFloat(light[13]),b:parseFloat(light[14])};
    Rugo_constant = parseFloat(light[15]);

    // Loading camera variables

    camera = camera.split(/[\r\n\s]+/).filter(function(el) {return ((el.length >0))});
    C_point = {x:parseFloat(camera[0]),y:parseFloat(camera[1]),z:parseFloat(camera[2])};
    N_vector = {x:parseFloat(camera[3]),y:parseFloat(camera[4]),z:parseFloat(camera[5])};
    V_vector = {x:parseFloat(camera[6]),y:parseFloat(camera[7]),z:parseFloat(camera[8])};
    distance_cameraPlane = parseFloat(camera[9]);
    halfWidth = parseFloat(camera[10]);
    halfHeight = parseFloat(camera[11]);
    horizontalCanvas = Math.ceil((verticalCanvas/(halfHeight*2))*(halfWidth*2));
    resizeCanvas(horizontalCanvas,verticalCanvas);
    rgbMatrix = new Array(horizontalCanvas);
    for (let i = 0; i < horizontalCanvas; i++) {
        rgbMatrix[i] = new Array(verticalCanvas);
    }
    for (let i = 0; i < horizontalCanvas; i++) {
        for (let j = 0; j < verticalCanvas; j++) {
            rgbMatrix[i][j] = {r:A_color.r,g:A_color.g,b:A_color.b,z:Infinity};
        }
    }
    V_vector = orthogonalizeVector(V_vector,N_vector);
    U_vector = crossProductVector(N_vector,V_vector);
    N_vector = normalize(N_vector);
    V_vector = normalize(V_vector);
    U_vector = normalize(U_vector);

    // End camera

    pointsArray = [];
    trianglesArray = [];

    // Loading objects variables

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
        trianglesArray.push({first:(parseInt(object[i])-1),second:(parseInt(object[i+1]))-1,third:(parseInt(object[i+2])-1),distance:0,Nx:0,Ny:0,Nz:0});
    }

    // Starting all the calculus

    toCameraCoordinates();
    calculateTrianglesNormal();
    normalizePointNormals();
    distanceTriangleOrigin();
    flatToScreenPoint();
    screenToPixels();
    trianglesArray.sort(function(a, b){return a.distance - b.distance});
    scanLine();
    putColorInScreen();

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

let pointsArray = [];
let trianglesArray = [];
let rgbMatrix = undefined;
let verticalCanvas = 1080;
let horizontalCanvas = Math.floor((verticalCanvas/(halfHeight*2))*(halfWidth*2));
resizeCanvas(horizontalCanvas,verticalCanvas);