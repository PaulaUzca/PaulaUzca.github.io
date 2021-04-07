//CODIGO DE COLLAPSIBLE CON BOTON ROTADOR
var collapsibleButton = document.getElementsByClassName("collapsiblebutton");
var collapsibleContent = document.getElementsByClassName("collapsible__content");
for (let index = 0; index < collapsibleButton.length; index++) {
    collapsibleButton[index].addEventListener("click", function(){
        //Para rotar el boton en circulos uso el tag para recordar a en que angulo quedo la ultima vez, y sumarle +180 para que debe media vuelta
        let degree = parseInt(this.getAttribute("tag"));
        degree += 180;
        this.style.transform = "rotate("+degree+"deg)";
        this.setAttribute("tag", degree);

        let contenido = collapsibleContent[index];
        if(contenido.style.maxHeight){
            contenido.style.maxHeight = null;
        }
        else{
            contenido.style.maxHeight = contenido.scrollHeight + "px";
        }

    });
}



if(document.body.clientWidth <= 1000){
    //Si esta desde un celular/tablet que lo haga usando tap/click
var tarjeta = document.querySelectorAll(".project__item");
for(let index = 0; index<tarjeta.length ; index++){
    tarjeta[index].addEventListener("click", function(){
        let clases = this.classList;
        if(this.classList.contains('rotar')){
            this.classList.replace('rotar', 'rotarback');   
        }
        else{
            this.classList.replace('rotarback', 'rotar');   
        }
        this.querySelector(".project__item--cara1").classList.toggle("invisible");
        this.querySelector(".project__item--cara2").classList.toggle("invisible");
    });
}

}


//Si esta en una computadora que s erote cuando haga hover
if(document.body.clientWidth >= 1000){

    var tarjeta = document.querySelectorAll(".project__item");
    for(let index = 0; index<tarjeta.length ; index++){
            tarjeta[index].addEventListener("mouseover", function()
            {
            let clases = this.classList;
            this.classList.add('rotar');
            this.classList.remove('rotarback')   
            this.querySelector(".project__item--cara1").classList.add("invisible");
            this.querySelector(".project__item--cara2").classList.remove("invisible");
            });
            tarjeta[index].addEventListener('mouseout', function(){
            let clases = this.classList;
            this.classList.remove('rotar');
            this.classList.add('rotarback');   
            this.querySelector(".project__item--cara1").classList.remove("invisible");
            this.querySelector(".project__item--cara2").classList.add("invisible");
            });
    }

}