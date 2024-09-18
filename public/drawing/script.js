(function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX, lastY;
    let currentColor = '#000000';
    let currentLineWidth = 2;
    let isEraser = false;
    let isXModeDrawing = false;
    let currentColorIndex = 0;

    const instructions = document.getElementById('instructions');
    const tips = [
        '按住 C 键或按住鼠标左键进行绘制',
        '按 R 键清除画布',
        '按 X 键开始/停止持续绘制',
        '按 1-5 键改变颜色',
        '按 [ 和 ] 键调整线条粗细',
        '按 E 键切换橡皮擦模式',
        '按 S 键保存绘图',
        '按 P 键打开/关闭调色板',
        '按 0-9 键选择快捷颜色',
        '点击快捷颜色按钮可以设置新的颜色',
        '在快捷颜色设置面板中点击数字按钮设置当前颜色为快捷颜色',
    ];

    const colors = [
        '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF',
        '#8B00FF', '#000000', '#FFFFFF', '#808080', '#FFC0CB'
    ];

    function updateInstructions() {
        instructions.innerHTML = '<h3>功能介绍:</h3>' + tips.map(tip => `<p>${tip}</p>`).join('');
    }

    function createColorUI() {
        const container = document.getElementById('colorUI');

        // 创建调色板按钮
        const colorPickerButton = createColorButton('P', currentColor);
        colorPickerButton.addEventListener('click', openMainColorPicker);
        container.appendChild(colorPickerButton);

        // 创建快捷颜色按钮
        for (let i = 0; i < 10; i++) {
            const colorButton = createColorButton(i.toString(), colors[i]);
            colorButton.addEventListener('click', () => openColorPicker(i));
            container.appendChild(colorButton);
        }
    }

    function createColorButton(text, color) {
        const button = document.createElement('button');
        button.className = 'color-button';
        button.style.backgroundColor = color;
        button.title = text === 'P' ? '调色板' : `颜色 ${text}`;
        return button;
    }

    function getContrastColor(hexcolor) {
        const r = parseInt(hexcolor.substr(1,2),16);
        const g = parseInt(hexcolor.substr(3,2),16);
        const b = parseInt(hexcolor.substr(5,2),16);
        const yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    function openMainColorPicker() {
        const tempColorPicker = document.createElement('input');
        tempColorPicker.type = 'color';
        tempColorPicker.value = currentColor;

        tempColorPicker.addEventListener('input', function() {
            currentColor = this.value;
            colorUI.children[0].style.backgroundColor = currentColor;
            colorUI.children[0].style.color = getContrastColor(currentColor);
            isEraser = false;
        });

        tempColorPicker.addEventListener('change', function() {
            document.body.removeChild(this);
            currentColorIndex = -1;
            updateQuickColorUI();
        });

        document.body.appendChild(tempColorPicker);
        tempColorPicker.click();
    }

    function openColorPicker(index) {
        const tempColorPicker = document.createElement('input');
        tempColorPicker.type = 'color';
        tempColorPicker.value = colors[index];

        tempColorPicker.addEventListener('input', function() {
            setQuickColor(index, this.value);
        });

        tempColorPicker.addEventListener('change', function() {
            document.body.removeChild(this);
        });

        document.body.appendChild(tempColorPicker);
        tempColorPicker.click();
    }

    function setQuickColor(index, color) {
        colors[index] = color;
        colorUI.children[index + 1].style.backgroundColor = color;
        colorUI.children[index + 1].style.color = getContrastColor(color);
        if (index === currentColorIndex) {
            currentColor = color;
            colorUI.children[0].style.backgroundColor = color;
            colorUI.children[0].style.color = getContrastColor(color);
        }
    }

    function switchColor(direction) {
        if (direction === 'next') {
            currentColorIndex = (currentColorIndex + 1) % colors.length;
        } else {
            currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length;
        }
        currentColor = colors[currentColorIndex];
        colorUI.children[0].style.backgroundColor = currentColor;
        colorUI.children[0].style.color = getContrastColor(currentColor);
        isEraser = false;
        if (isDrawing) {
            ctx.beginPath();
            lastX = lastY = undefined;
        }
        updateQuickColorUI();
    }

    function updateQuickColorUI() {
        for (let i = 0; i < 11; i++) {
            if (i === 0) {
                colorUI.children[i].style.border = currentColorIndex === -1 ? '2px solid #000' : 'none';
            } else {
                colorUI.children[i].style.border = i - 1 === currentColorIndex ? '2px solid #000' : 'none';
            }
        }
    }

    function initControlPanel() {
        const clearButton = document.getElementById('clearButton');
        clearButton.addEventListener('click', clearCanvas);

        const lineWidthSlider = document.getElementById('lineWidthSlider');
        lineWidthSlider.addEventListener('input', (e) => {
            currentLineWidth = parseInt(e.target.value);
        });

        const eraserButton = document.getElementById('eraserButton');
        eraserButton.addEventListener('click', toggleEraser);

        const saveButton = document.getElementById('saveButton');
        saveButton.addEventListener('click', saveDrawing);
    }

    function toggleEraser() {
        isEraser = !isEraser;
        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'c') {
            isDrawing = true;
            ctx.beginPath();
        } else if (e.key === 'r') {
            clearCanvas();
        } else if (e.key === 'x') {
            toggleXMode();
        } else if ('12345'.includes(e.key)) {
            changeColor(e.key);
        } else if (e.key === '[' || e.key === ']') {
            adjustLineWidth(e.key);
        } else if (e.key === 'e') {
            toggleEraser();
        } else if (e.key === 's') {
            saveDrawing();
        } else if (e.key === 'p') {
            toggleColorPicker();
        } else if ('0123456789'.includes(e.key)) {
            changeColor(e.key);
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'c' && !isXModeDrawing) {
            isDrawing = false;
        }
    });

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', () => {
        if (!isXModeDrawing) {
            isDrawing = false;
        }
    });

    canvas.addEventListener('mouseenter', (e) => {
        if (isXModeDrawing || (e.buttons & 1) || e.key === 'c') {
            isDrawing = true;
            const pos = getMousePos(canvas, e);
            [lastX, lastY] = [pos.x, pos.y];
            ctx.beginPath();
        }
    });

    function getMousePos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function startDrawing(e) {
        if (!isXModeDrawing) {
            isDrawing = true;
        }
        const pos = getMousePos(canvas, e);
        [lastX, lastY] = [pos.x, pos.y];
        ctx.beginPath();
    }

    function stopDrawing() {
        if (!isXModeDrawing) {
            isDrawing = false;
        }
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const pos = getMousePos(canvas, e);
        const x = pos.x;
        const y = pos.y;
        
        ctx.lineWidth = currentLineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;

        ctx.beginPath();
        if (lastX && lastY) {
            ctx.moveTo(lastX, lastY);
        } else {
            ctx.moveTo(x, y);
        }
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
    }

    function clearCanvas() {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function changeColor(key) {
        console.log('changeColor called with key:', key);
        const index = parseInt(key) % 10;
        currentColorIndex = index;
        switchColor('next');
        switchColor('prev');
    }

    function adjustLineWidth(key) {
        if (key === '[' && currentLineWidth > 1) {
            currentLineWidth--;
        } else if (key === ']' && currentLineWidth < 20) {
            currentLineWidth++;
        }
    }

    function toggleColorPicker() {
        colorUI.style.display = colorUI.style.display === 'none' ? 'block' : 'none';
    }

    function toggleXMode() {
        isXModeDrawing = !isXModeDrawing;
        isDrawing = isXModeDrawing;
        if (isDrawing) {
            ctx.beginPath();
        } else {
            lastX = lastY = undefined;
        }
    }

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        console.log('Wheel event triggered');
        if (e.deltaY < 0) {
            switchColor('next');
        } else {
            switchColor('prev');
        }
    });

    function saveDrawing() {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    // 初始化
    createColorUI();
    initControlPanel();
    updateInstructions();
    clearCanvas();
    currentColor = colors[currentColorIndex];
    updateQuickColorUI();

    console.log('Script loaded. Initial color:', currentColor);
})();