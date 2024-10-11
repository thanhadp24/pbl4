
let drawIcon = document.querySelector('.draw-icon');
drawIcon.addEventListener('click', ()=> {
    var areaDraw = document.querySelector('.block-draw');
    if(areaDraw.classList.toggle('block')) {
        canvasDraw(areaDraw)
    };
})

function canvasDraw(areaDraw){
    const canvas = document.querySelector('.canvas');

    var ctx = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = areaDraw.offsetWidth;
    canvas.height = areaDraw.offsetHeight;

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);


    /* Drawing on Paint App */
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4f4f4f';

    canvas.addEventListener('mousedown', function(e) {
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        step++;
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    var onPaint = function() {
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();
    };

    let btnClear = document.querySelector('.clear');
    let btnUndo = document.querySelector('.undo');

    let array = [];
    let step = -1;

    btnClear.addEventListener('click', clear);

    function clear(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        array = [];
        step = -1;
    }

    btnUndo.addEventListener('click', ()=> {
        if(step <= 0){
            clear();
        }else {
            step -= 1;
            array.pop();
            ctx.putImageData(array[step], 0, 0);
        }
    })

}