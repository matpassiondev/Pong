// Dimensions de la scène
let wST = window.innerWidth - 1;
let hST = window.innerHeight - 4;

// Mise en place de l'application
const app = new PIXI.Application({
    width: wST,
    height: hST
});
document.body.appendChild(app.view);

//Déclare les références
let raquetteG, raquetteD, balle;
//Dimensions raquette balle
let wRaquette = 6, hRaquette = 50, sizeBall = 10;
//Sens de déplacement des raquettes (0: pas de déplacement, -1 : vers le haut, 1 : vers le bas)
let sensRG = 0, sensRD = 0;
//Vitesse de déplacement de la raquette
let vR = 5;
//vecteur déplacement de la balle
let vBalle = {x:Math.random()*10-5, y:Math.random()*10-5};



// Création des raquettes
function createRaquettes() {
    raquetteG = new PIXI.Graphics();
    raquetteG.beginFill(0xFFFFFF);
    raquetteG.drawRect(0, 0, wRaquette, hRaquette);
    raquetteG.x = 40;
    raquetteG.y = (hST - hRaquette) * 0.5;
    app.stage.addChild(raquetteG);

    raquetteD = new PIXI.Graphics();
    raquetteD.beginFill(0xFFFFFF);
    raquetteD.drawRect(0, 0, wRaquette, hRaquette);
    raquetteD.x = wST - 40 - wRaquette;
    raquetteD.y = (hST - hRaquette) * 0.5;
    app.stage.addChild(raquetteD);
}

// Création de la balle
function createBalle() {
    balle = new PIXI.Graphics();
    balle.beginFill(0xFFFFFF);
    balle.drawRect(0, 0, sizeBall, sizeBall);
    balle.x = (wST - sizeBall) * 0.5;
    balle.y = (hST - sizeBall) * 0.5;
    app.stage.addChild(balle);

}

//Appel des fonctions d'initialisation
createRaquettes();
createBalle();

// Evénements clavier
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

function onKeyDown(e) {
    console.log(e);


    //Déplacement raquette gauche
    if (e.keyCode === 65) { //touche A
        sensRG = -1;
    } else if (e.keyCode === 81) { // touche Q
        sensRG = 1;
    }


    //Déplacement raquette droite
    if (e.keyCode === 38) { // touche Flèceh Haut
        sensRD = -1;

    } else if (e.keyCode === 40) { // touche Flèche Bas
        sensRD = 1;
    }

}

function onKeyUp(e) {

    if(e.keyCode === 65 && sensRG === -1) sensRG = 0;
    if(e.keyCode === 81 && sensRG === 1) sensRG = 0;

    if(e.keyCode === 38 && sensRD === -1) sensRD = 0;
    if(e.keyCode === 40 && sensRD === 1) sensRD = 0;

}


// Gameloop

function gameloop() {
    // Déplacement raquettes/balles

    raquetteG.y = Math.min(hST - hRaquette, Math.max(0, raquetteG.y + sensRG *vR));
    raquetteD.y = Math.min(hST - hRaquette, Math.max(0, raquetteD.y + sensRD *vR));

    balle.x += vBalle.x;
    balle.y += vBalle.y;
    
    //Test rebons sur les bords horizontaux
    if(balle.y <= 0 || balle.y >= hST - sizeBall) {
        vBalle.y *= -1;
    }

    //Vérifier si la balle sort de la scène
    if(balle.x <= -sizeBall || balle.x >= wST) {
        balle.x = (wST - sizeBall) *0.5;
        balle.y = (hST - sizeBall) *0.5;
       // vballe = {x:Math.random()*10-5, y:Math.random()*10-5};
       defineVector();
    }

    // Vérification collisions:
    if(collide(balle, raquetteG) || collide(balle,raquetteD)) vBalle.x *= -2;

    // balle > raquettes
    // balle > haut/bas
    // Vérification balle sort par les côtés

    //Rappel de la fonction
    requestAnimationFrame(gameloop);

}

//lance la gameloop
gameloop();



// Collisions
function collide(elt1, elt2) {
    let b1 = elt1.getBounds();
    let b2 = elt2.getBounds();

    if(b1.x > b2.x + b2.width ||
        b1.x + b1.width < b2.x ||
        b1.y > b2.y + b2.height ||
        b1.y + b1.height < b2.y) {
        return false;
    }

    return true;
}


//fonction pour définir le vecteur de la balle
function defineVector() {
    // entre 8° et 50°
    let angle = Math.random() * 42 + 8;
    if(Math.random()> 0.5) angle *= -1;

    if(Math.random()>0.5) angle += 180;


    let v = Math.random() * 3 + 4;
    vBalle.x = Math.cos(angle/180.0 * Math.PI) *v;
    vBalle.y = Math.sin(angle/180.0 * Math.PI) *v;
}