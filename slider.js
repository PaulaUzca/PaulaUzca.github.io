
/*----------Make an atomatic infinite slide show------------------- */

/*I decided to use vanilla Javascript instead of Jquery, with jquery its shorter
The original code is from a guy from Stackoverflow. You can see he original in the link at the end of HTML.
I change some things to make it automatic and to clone as many items as my page has. 
*/
var gallery = document.querySelector("#gallery ul"),
items   = document.querySelectorAll('.gallery-item'),
len     = items.length,
current = 1,  /* the current item we're looking */
size = 320;
first   = items[0],
last    = items[items.length-1];


/* 1. MAKE CLONES
Its important to make copies of all elements at the beginning and end of my slide
This way, it will have elements that make it "infinite" when its actually 3x the elements it already has from the HTML :)
*/

/*First clone: BEFORE the first element, CLONE the items and put them in the right order:
Cloned: 1-2-3-4 - 1-2-3-4 :Orginal
Note: if i dont clone them, they will change positions and thats an issue. What I need is a NEW element
*/
for(let i =0; i < len; i++){
let item = items[i];
gallery.insertBefore(item.cloneNode(true), first);
}
/*Last clone: AFTER the last element, CLONE the items in the right order
Now here I faced a little problem: vanilla JS doesnt have a insertAfter method
But the internet is great and a guy from Stackoverflow did it for me ;)
Heres the link https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib 
*/
function insertAfter(referenceNode, newNode) {
referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
for(let i = len-1; i >= 0; i--){
let item = items[i];
insertAfter(last, item.cloneNode(true));
}


/*Make it  Automatic*/

var margin = size * 6; //because element.style.left returns a string (I know, annoying)
gallery.style.left = "-"+ margin+ 'px' // show frame

setTimeout(autoSlide, 4200);

function autoSlide(){
    moveSlide(1);
    setTimeout(autoSlide, 4200);
}

//My beautiful function that moves 300px to the left
function moveSlide(d){
var cycle = false;
var delta = d;
var left = 0;

/* There is actually a way easier way to make this animated but its with Jquery, and I chose the hard way 
(You can see the Jquery way in the other document)

What I do here is:
set a TimeInterval every 10ms
change the margin
if the amount added (left) is 300 that means it changed the image (image size is 300px)
I stope the interval and a do this trick with variable cycle to see if the "infinite" slide reached its limit
(remember is not trully inifinite, it only appear so)
 */
function frame() {
    left += 10;
    margin += 10;  // update parameters
    gallery.style.left = '-' + margin + 'px' // show frame
    if (left == size){  // check finish condition
         clearInterval(id);
         changeDots();
            gallery.style.left = "-"+margin+"px";
            current += delta;
            /** 
             * we're cycling the slider when the the value of "current" 
             * variable (after increment/decrement) is 0 or when it exceeds
             * the initial gallery length
             */          
            cycle = !!(current === 0 || current > len);
            if (cycle) {
                /* we switched from image 1 to 4-cloned or 
                   from image 4 to 1-cloned */
                current = (current === 0)? len : 1;
                margin = size * (current+1); //adapt the margin to go back or forth so that the slide images no se acaben
                gallery.style.left = "-"+ margin + "px";
            }
    }        
}
var id = setInterval(frame, 10) // draw every 10ms
}

var photosDots = document.getElementsByClassName("dot");
var dotPosition = 1;
function changeDots(){
    if(dotPosition == 4){
        dotPosition = 0;
    }
    for (const element of photosDots) {
        element.classList.remove("selected");
    }

    photosDots[dotPosition].classList.add("selected");
    dotPosition++;
}