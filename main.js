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
        reader2.readAsText(light_file);
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

function cosinTwoVectors(firstVector,secondVector) {
    let returner = (((firstVector.x * secondVector.x) + (firstVector.y * secondVector.y) + (firstVector.z * secondVector.z))/
        (Math.sqrt(Math.pow(firstVector.x,2) + Math.pow(firstVector.y,2) + Math.pow(firstVector.z,2)) * Math.sqrt(Math.pow(secondVector.x,2) + Math.pow(secondVector.y,2) + Math.pow(secondVector.z,2))));
    return returner;
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
        pointsArray[i].Ys = ((pointsArray[i].y * distance_cameraPlane) / (pointsArray[i].z * halfHeight));
        pointsArray[i].Xs = ((pointsArray[i].x * distance_cameraPlane) / (pointsArray[i].z * halfWidth));
    }
}

function determinatePixels() {
    for (let i = 0; i < pointsArray.length; i++) {
        pointsArray[i].Px = Math.floor(horizontalCanvas * ((1 + pointsArray[i].Xs))/2);
        pointsArray[i].Py = Math.floor(verticalCanvas * ((1 - pointsArray[i].Ys))/2);
    }
}

function getLineGrowth(x,y){//recebe um vetor
    let a = v.x;
    let b = v.y;
    return (b/a);//isso vai retornar o a, mas para usar o 1/a, basta invereter
}

function drawTriangles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    trianglesArray.sort(function(a, b){return a.distance - b.distance});
    for (let i = trianglesArray.length - 1; i > -1; i--) {
        ctx.beginPath();
        ctx.moveTo(pointsArray[trianglesArray[i].first].Px,pointsArray[trianglesArray[i].first].Py);
        ctx.lineTo(pointsArray[trianglesArray[i].second].Px,pointsArray[trianglesArray[i].second].Py);
        ctx.lineTo(pointsArray[trianglesArray[i].third].Px,pointsArray[trianglesArray[i].third].Py);
        ctx.lineTo(pointsArray[trianglesArray[i].first].Px,pointsArray[trianglesArray[i].first].Py);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ff6b00';
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
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
    light = light.split(/[\r\n\s]+/).filter(function(el) {return ((el.length >0))});
    L_point = {x:parseFloat(light[0]),y:parseFloat(light[1]),z:parseFloat(light[2])};
    ARef_constant = parseFloat(light[3]);
    A_color = {x:parseFloat(light[4]),y:parseFloat(light[5]),z:parseFloat(light[6])};
    Difu_constant = parseFloat(light[7]);
    D_vector = {x:parseFloat(light[8]),y:parseFloat(light[9]),z:parseFloat(light[10])};
    Spec_constant = parseFloat(light[11]);
    L_color = {x:parseFloat(light[12]),y:parseFloat(light[13]),z:parseFloat(light[14])};
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
    determinatePixels();
    drawTriangles();
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
let verticalCanvas = 640;
let horizontalCanvas = Math.floor((verticalCanvas/(halfHeight*2))*(halfWidth*2));
resizeCanvas(horizontalCanvas,verticalCanvas);