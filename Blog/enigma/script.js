
//Ingles no esta disponible
function alertaIdioma(){
    alert('Sorry! There is no English vesion of this post :( ');
}


//hamburguesa
document.getElementById("menu__button").addEventListener("click", function(){
    document.getElementById("side__menu").classList.toggle("hide-bar");
    this.classList.toggle("push__button");
});

//ENIGMA MACHINE CODE

var output = document.getElementById("result"); 
var textInput= document.getElementById("textbox")
var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

var allRotors = [];
var allReflectors = [];

class Rotor {
    constructor(wiring, name, notch){
        this.name = name;
        this.wiring = wiring.split('');
        this.originalWiring = [...this.wiring];
        this.abc = [...abc];
        this.notchs = notch.split("-");
        this.notch = this.notchs[0];
        this.notchNext = this.notchs[1];

        allRotors.push(this);
    }

    rotate(){
        this.wiring.push(this.wiring.shift());
        this.abc.push(this.abc.shift());
    }
    ringSettings(ring) {
        let ringNumber = abc.indexOf(ring) +1;
        this.wiring = [...this.originalWiring];
        if(ringNumber != 1){
            for (let i = 0; i < 26; i++) {
                let index = abc.indexOf(this.wiring[i]); //Obtengo la posicion de la letra en el abc
                for (let a = 1; a < ringNumber; a++) { //Esa letra la tengo que "subir" n posiciones en el abc
                    if (index < 25) { //Tengo que asegurarme que sea menor a 25 pues si llega a un index de 26 eso no existe en el array
                        index++;
                    }
                    else {
                        index = 0; //Lo dejo en cero y de igual forma se seguiran sumando las posiciones que falten...
                    }
                }
                this.wiring[i] = abc[index]; //El nuevo setting sera la letra en el abc a n letras de la mia
            }
            for (let e = 1; e < ringNumber; e++) {
                let last = this.wiring.pop();
                this.wiring.unshift(last);
            }
        }
    }
    setInitialKey(key) {
        while (this.abc[0] != key) {
            this.rotate();
        }
    }
    
}
var rotorI = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "I", "Q-R"); 
var rotorII = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "II", "E-F");
var rotorIII = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "III", "V-W");
var rotorIV = new Rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB", "IV", "J-K");
var rotorV = new Rotor("VZBRGITYUPSDNHLXAWMJQOFECK", "V", "Z-A"); 

class Reflector{
    constructor(wiring, name){
        this.wiring = wiring.split('');
        this.name = name;
        allReflectors.push(this);
    }
}
var reflectorB = new Reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT", "UKW-B");
var reflectorC = new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL", "UKW-C")

//La primera ronda de encripcion (desde el teclado pasa por los 3 rotores hasta llegar al reflector) *ejemplo al final
function round1(rotor, letter){
    let result;

    index = abc.indexOf(letter);
    result = rotor.wiring[index];

    index = rotor.abc.indexOf(result);
    result = abc[index];
    return result;
}

//Segunda ronda de encripcion (desde el reflector pasa por los 3 rotores de forma inversa hasta llegar a el teclado) *ejemplo al final
function round2(rotor, letter){
    let result;

    index = abc.indexOf(letter);
    result = rotor.abc[index];
    
    index = rotor.wiring.indexOf(result);
    result = abc[index];
    //console.log(rotor.name + ": "+ letter +"-->"+result);
    
    return result;
}

//El reflector solo convierte la letra de acuerdo a su posicion en el abc a posicion en el reflector
function reflection (reflector, letter){
    let index = abc.indexOf(letter);
    return reflector.wiring[index];
}

function encrypt(letter){
    if(abc.includes(letter)){
        let rotorFast = fastRotorElement.actualRotor;
        let rotorSlow = slowRotorElement.actualRotor;
        let rotorMedium = middleRotorElement.actualRotor;
        let reflector = reflectorElement.actualReflector;
        let encripted_letter;

        //Primero pasamos la letra por el plugboard
        encripted_letter = plugboard.settings[abc.indexOf(letter)];
        
        //Antes de pasar la letra por los rotores. Hay que hacer las rotaciones correspondientes
        rotorFast.rotate();
        if(rotorFast.abc[0] == rotorFast.notchNext){ //Si el rotor ya paso la posicion del notch quiere decir que es hora de rotar el siguiente
            rotorMedium.rotate();

            if(rotorMedium.abc[0] == rotorMedium.notch){ //Si el rotor esta en la posicion del notch es hora de rotar el siguiente rotor
                rotorSlow.rotate();
                rotorMedium.rotate();    //double stepping
            }
        }

        //Ponemos el nuevo order los elementos para que el usuario los vea
        fastRotorElement.refreshOrder();
        middleRotorElement.refreshOrder();
        slowRotorElement.refreshOrder();

        
        //Una vez todos los rotores estan en posición... A encriptar!
        // Dirección de encripción en Enigma <------
        encripted_letter = round1(rotorFast, encripted_letter);
        encripted_letter = round1(rotorMedium, encripted_letter);
        encripted_letter = round1(rotorSlow, encripted_letter);

        encripted_letter = reflection(reflector, encripted_letter);

        //Direccion de encripción en Enigma ------>
        encripted_letter = round2(rotorSlow, encripted_letter);
        encripted_letter = round2(rotorMedium, encripted_letter);
        encripted_letter = round2(rotorFast, encripted_letter,);


        //Al final tambien pasamos por el plugboard
        encripted_letter = plugboard.settings[abc.indexOf(encripted_letter)];

        return encripted_letter;
    }
}

    

//TECLADO
var qwertz = "QWERTZUIOPASDFGHJKLYXCVBNM".split('');

//Aqui primero inserte las letras en el DOM, se me hizo mas sencillo por js porque son muchas letras
var boardLights = document.getElementById("board-lights");
for(let i = 0; i<26; i++ ){
boardLights.innerHTML += '<div class="light-letra letra"><p>'+qwertz[i]+'</p></div>';
}
var boardWrite = document.getElementById("board-write");
for (let i = 0; i < 26; i++) {
    boardWrite.innerHTML += '<div class="normal-letra letra"><p>'+qwertz[i]+'</p></div>'
}


//ANIMACIONES Y EVENTOS DEL TECLADO

//En el input box (funcion se llama desde el HTML)
function lettersValidate(event){ //Para que me deje escribir solor letras en la caja de texto
    if(abc.includes(event.key.toUpperCase())){
        return true;
    }
    else{
        return false;
    }
}


//Para encriptar todo el contenido si es que el usuario hizo copy and paste
function enter(){

    let message = textInput.value.replace(/\s+/g, '').split('');
    let isjustText = true;

    for (let index = 0; index < message.length; index++) {
       if(!abc.includes(message[index].toUpperCase())){
           index = message.length;
           console.log("I can not encript this message")
           isjustText = false;
       }
    }

    if(output.value == "" && isjustText){
        for (let letra = 0; letra < message.length; letra++) {
            let letraPressed = message[letra].toUpperCase();
            let keyElement = teclas[qwertz.indexOf(letraPressed)];
            presionarKey(keyElement);
        }
    }
}

var teclasLight = document.getElementsByClassName("light-letra");
var teclas = document.getElementsByClassName("normal-letra");

//Evento cuando el usuario escribe por su teclado
textInput.addEventListener("keydown", function(event){

    if(event.keyCode == 13){ //Cuando presiona enter
        enter();
    }
    if(event.key == "Backspace"){
        //Hacer funcion de eliminar letra del output y de rotar al reverso los rotores

    }
    else{
        if( event.ctrlKey === false){ //para que no encripte la v de ctrl+v o la c de ctrl+c
        let letraPressed = event.key.toUpperCase();
        let keyElement = teclas[qwertz.indexOf(letraPressed)];
        presionarKey(keyElement);
        }
    }
});

//Asignacion de eventos cuando el usuario usa el teclado de la maquina (con click)
for(let i = 0; i< teclas.length; i++){

    teclas[i].addEventListener("click", function(){
        textInput.innerHTML +=  teclas[i].querySelectorAll("p")[0].textContent;
        presionarKey(this);
    });
    teclas[i].addEventListener("animationend", function(){
        this.classList.remove("tecla-active");
    })

    teclasLight[i].addEventListener("animationend", function(){
        this.classList.remove("iluminaTecla");
    });
}


var startedEncription = false;
var userSettings;

function writeUserSettings(){
    

    userSettings = {
        slowrotor : slowRotorElement.name.textContent,
        slowrotorInitial : slowRotorElement.initialOrder.textContent,
        slowrotorRing : slowRotorElement.ring.textContent,

        middlerotor : middleRotorElement.name.textContent,
        middlerotorInitial : middleRotorElement.initialOrder.textContent,
        middlerotorRing : middleRotorElement.ring.textContent,

        fastrotor : fastRotorElement.name.textContent,
        fastrotorInitial : fastRotorElement.initialOrder.textContent,
        fastrotorRing : fastRotorElement.ring.textContent,

        plugboardparejas : plugboard.pairs.join(" | ").replace(/,/g,"-"),

    };

    document.getElementById("user-settings").innerHTML = 
    `Tus Enigma Settings son:
    Rotor ${userSettings["slowrotor"]} Posicion ${userSettings["slowrotorInitial"]} Ring ${userSettings["slowrotorRing"]}
    Rotor ${userSettings["middlerotor"]} Posicion ${userSettings["middlerotorInitial"]} Ring ${userSettings["middlerotorRing"]}
    Rotor ${userSettings["fastrotor"]} Posicion ${userSettings["fastrotorInitial"]} Ring ${userSettings["fastrotorRing"]}
    Plugboard Parejas ${userSettings.plugboardparejas}`;

}

//Efectos de presionar letra y encriptar
var contador = 0; //Contador para separar las letras en pedazos de a 5
function presionarKey(tecla){

    if(!startedEncription){
        startedEncription = true;
       writeUserSettings();
    }

    tecla.classList.add("tecla-active");
    letra = tecla.querySelectorAll("p")[0].textContent; //Obtenemos la letra a encriptar
    let letraEncriptada = encrypt(letra);
    iluminarLetra(letraEncriptada); //Llamamos funcion para mostrar el resultado en el lightboard
    output.innerHTML += letraEncriptada; //Escribimos resultado en hoja de output
    contador ++;
    if(contador == 5){
        output.innerHTML += " ";
        contador=0;
    }
}
function iluminarLetra(letraEncriptada){
    let index = qwertz.indexOf(letraEncriptada);
    teclasLight[index].classList.add("iluminaTecla");
}

//Boton clear input box
document.getElementById("clearInputBox").addEventListener("click", function(){
    textInput.textContent = "";
    output.innerText = "";
});

document.getElementById("encriptInput").addEventListener("click", function(){
    enter();
});

document.getElementById("copyCypher").addEventListener("click", function(){
    output.select();
    document.execCommand('copy');
});

document.getElementById("reset-settings").addEventListener("click", function(){

     allRotors.forEach(rotor =>{
        rotor.wiring = [...rotor.originalWiring]; //clonando array con ES6
        rotor.abc = [...abc];
     });

    allRotorElements.forEach(rotorElement => {
        rotorElement.refreshOrder();
        rotorElement.ring.textContent = "A";
    });
    
    plugboardLetter.forEach(plug =>{
        plug.style.backgroundColor = "white";
        plugboard.settings = [...abc];
        plugboard.pairs = [];
        colors = ["blue", "palegreen" , "yellow", "deeppink" , "lightcoral", "magenta", "mediumorchid", "greenyellow", "aqua", "gold", "paleturquoise", "lime", "pink"];

    });

    userSettings = null;
    startedEncription = false;
    document.getElementById("user-settings").textContent = "Tus Enigma Settings son:"

    textInput.textContent = "";
    output.innerText = "";
    contador = 0;  //Resetear espacio que se deja entre letras

});

/*Modificacion de settings
Recordemos el orden en que entra la letra 
refelctor I II III <---TecladoInput      TecladoOutput
|___________>________________________________|
*/


//Con la clase para tener mejor organizado los elementos que muestran el rotor al usuario
class RotorElement{
    constructor(element, rotor){
        this.element = document.getElementById(element);
        this.name = this.element.getElementsByClassName("rotor-number")[0];
        this.wiring = this.element.getElementsByClassName("rotor-wiring")[0].querySelectorAll("p")[0];
        this.initialOrder = this.element.getElementsByClassName("rotor-initial")[0].querySelectorAll("p")[0];
        this.ring = this.element.getElementsByClassName("ring-setting")[0];
        this.actualRotor =  rotor;

        allRotorElements.push(this);
    }
    changeRotor(){
        let actualRotor = allRotors.filter(obj => { return obj.name === this.name.textContent})[0];
        let index = allRotors.indexOf(actualRotor)+1;
        this.actualRotor = (index < allRotors.length)? allRotors[index]: allRotors[0];
        this.name.textContent = this.actualRotor.name;
        this.wiring.textContent = this.actualRotor.wiring[0];

    }
    refreshOrder(){
        this.wiring.textContent = this.actualRotor.wiring[0];
        this.initialOrder.textContent = this.actualRotor.abc[0];
    }
    changeRingSetting(){
        let nextLetter = (this.ring.textContent == "Z")? "A" : abc[abc.indexOf(this.ring.textContent) +1];
        this.actualRotor.ringSettings( nextLetter );
        this.ring.textContent = nextLetter;
        this.refreshOrder();
    }
}
var allRotorElements = [];
var fastRotorElement = new RotorElement("fastRotor", rotorIII);
var middleRotorElement = new RotorElement("middleRotor", rotorII);
var slowRotorElement = new RotorElement("slowRotor", rotorI);


//Para mostrar los settings que vienen por default (tambien se podian poner por HTML pero yo soy mas cool)
allRotorElements.forEach(element => {
    element.refreshOrder();

    element.ring.addEventListener("click", function() {
        element.changeRingSetting();
    })
    element.name.addEventListener("click", function(){
        element.changeRotor();
    })
    element.initialOrder.addEventListener("click", function(){
        element.actualRotor.rotate();
        element.refreshOrder();
    })
});


var reflectorElement = {
element: document.getElementById("reflector"),
name : document.getElementById("reflector").getElementsByClassName("reflector-number")[0],
actualReflector: allReflectors[0],
}

reflectorElement.name.addEventListener("click", function(){
    let index = allReflectors.indexOf(reflectorElement.actualReflector)+1;
    reflectorElement.actualReflector = (index < allReflectors.length)? allReflectors[index]: allReflectors[0];
    this.textContent = reflectorElement.actualReflector.name;
});


//Plugboard

//Agregamos las letras al DOM via javascript porque es más rápido
var plugboardElement = document.getElementsByClassName("plugboard__container")[0];
for(let i = 0; i<26; i++ ){
    plugboardElement.innerHTML += '<div class="plugboard__letter" tag='+abc[i]+'><p>'+abc[i]+'</p></div>';
}

//El objeto plugboard
var plugboard = { 
    settings: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
    pairs: [],
};

function makePlugboard() {
  abcCopy = [...abc];
  plugboard.pairs.forEach((pair) => {
    abcCopy[abc.indexOf(pair[0])] = pair[1];
    abcCopy[abc.indexOf(pair[1])] = pair[0];
  });
  plugboard.settings = [...abcCopy];
}


var plugboardLetter = plugboardElement.querySelectorAll(".plugboard__letter");
var colors = ["blue", "palegreen" , "yellow", "deeppink" , "lightcoral", "magenta", "mediumorchid", "greenyellow", "aqua", "gold", "paleturquoise", "lime", "pink"];
var onePair = [];

plugboardLetter.forEach(element => {
    element.style.backgroundColor = "white"; //por defecto los plugs son todos blancos

    //Funcion para armar parejas cuando se hace click en los plugs
    element.addEventListener("click", function(){
        let letter = this.getAttribute("tag"); //El tag tiene la letra del elemento plug

         if(this.style.backgroundColor == "white"){ //Si el boton esta en blanco le puedo poner color
            this.style.backgroundColor = colors[0];
            if(onePair[0] != letter) onePair.push(letter);  //Siempre y cuando no este esa misma letra en el array del par. Lo agrego
         } 

         else{ // si el plug tiene color hay que pasarlo a blanco
            this.style.backgroundColor = "white";
            plugboard.pairs.forEach(pairArray =>{ //tambien hay que comprobar si habian pares con ese plug que quiero poner blanco
                if(pairArray.includes(letter)){  //Si ese par tiene la letra hay que poner blanco a su pareja y sacarlos del array de los pares
                    //Obtengo el plug de la pareja
                    let index = (pairArray.indexOf(letter) == 0)? 1 : 0;
                    let pareja = plugboardLetter[abc.indexOf( pairArray[index]) ];
                    //Tambien agrego al color a la lista para que pueda seguir siendo utilizado
                    colors.push(pareja.style.backgroundColor);
                    pareja.style.backgroundColor = "white";
                    plugboard.pairs.splice(plugboard.pairs.indexOf(pairArray), 1);
                }
            });
         }

        if(onePair.length == 2){ //si la pareja ya esta completa, cambio el color y agrego a los pares del plugboard
        colors.shift();
        plugboard.pairs.push(onePair);
        makePlugboard();
        onePair = [];
        }
    })
});

document.getElementsByClassName("window__X")[0].addEventListener("click", function() {
   this.parentNode.style.display = "none"; 
});

document.getElementById("question").addEventListener("click", function(){
   document.getElementsByClassName("window__machine-info")[0].style.display = "flex";
});

