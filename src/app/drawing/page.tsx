'use client'

import React, { useEffect, useRef, useState, KeyboardEvent, MouseEvent, WheelEvent } from 'react'
import Head from 'next/head'

export default function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastX, setLastX] = useState<number | undefined>(undefined)
  const [lastY, setLastY] = useState<number | undefined>(undefined)
  const [currentColor, setCurrentColor] = useState('#000000')
  const [currentLineWidth, setCurrentLineWidth] = useState(2)
  const [isEraser, setIsEraser] = useState(false)
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const [instructions, setInstructions] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(true)
  const [isXModeDrawing, setIsXModeDrawing] = useState(false)

  const colors = useRef([
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF',
    '#8B00FF', '#000000', '#FFFFFF', '#808080', '#FFC0CB'
  ])

  const tips = [
    '按住 C 键或按住鼠标左键进行绘制',
    '按 R 键清除布',
    '按 X 键开始/停止持续绘制',
    '按 1-5 键改变颜色',
    '按 [ 和 ] 键调整线条粗细',
    '按 E 键切换橡皮擦模式',
    '按 S 键保存绘图',
    '按 P 键打开/关闭调色板',
    '按 0-9 键选择快捷颜色',
    '点击快捷颜色按钮可以设置新的颜色',
    '在快捷颜色设置面板中点击数字按钮设置当前颜色为快捷颜色',
  ]

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      if (context) {
        setCtx(context)
        context.lineCap = 'round'
        context.lineJoin = 'round'
      }
    }
    updateInstructions()
    clearCanvas()
    setCurrentColor(colors.current[currentColorIndex])
    updateQuickColorUI()
  }, [])

  const updateInstructions = () => {
    setInstructions('<h3>功能介绍:</h3>' + tips.map(tip => `<p>${tip}</p>`).join(''))
  }

  const getContrastColor = (hexcolor: string) => {
    const r = parseInt(hexcolor.substr(1,2),16)
    const g = parseInt(hexcolor.substr(3,2),16)
    const b = parseInt(hexcolor.substr(5,2),16)
    const yiq = ((r*299)+(g*587)+(b*114))/1000
    return (yiq >= 128) ? 'black' : 'white'
  }

  const openMainColorPicker = () => {
    const tempColorPicker = document.createElement('input')
    tempColorPicker.type = 'color'
    tempColorPicker.value = currentColor

    tempColorPicker.addEventListener('input', function() {
      setCurrentColor(this.value)
      setIsEraser(false)
    })

    tempColorPicker.addEventListener('change', function() {
      document.body.removeChild(this)
      setCurrentColorIndex(-1)
      updateQuickColorUI()
    })

    document.body.appendChild(tempColorPicker)
    tempColorPicker.click()
  }

  const openColorPicker = (index: number) => {
    const tempColorPicker = document.createElement('input')
    tempColorPicker.type = 'color'
    tempColorPicker.value = colors.current[index]

    tempColorPicker.addEventListener('input', function() {
      setQuickColor(index, this.value)
    })

    tempColorPicker.addEventListener('change', function() {
      document.body.removeChild(this)
    })

    document.body.appendChild(tempColorPicker)
    tempColorPicker.click()
  }

  const setQuickColor = (index: number, color: string) => {
    colors.current[index] = color
    if (index === currentColorIndex) {
      setCurrentColor(color)
    }
  }

  const switchColor = (direction: 'next' | 'prev') => {
    let newIndex
    if (direction === 'next') {
      newIndex = (currentColorIndex + 1) % colors.current.length
    } else {
      newIndex = (currentColorIndex - 1 + colors.current.length) % colors.current.length
    }
    setCurrentColorIndex(newIndex)
    setCurrentColor(colors.current[newIndex])
    setIsEraser(false)
    if (isDrawing) {
      ctx?.beginPath()
      setLastX(undefined)
      setLastY(undefined)
    }
    updateQuickColorUI()
  }

  const updateQuickColorUI = () => {
    // This function is not needed in React as we're using state to manage UI
  }

  const toggleEraser = () => {
    setIsEraser(!isEraser)
    if (ctx) {
      ctx.globalCompositeOperation = isEraser ? 'source-over' : 'destination-out'
    }
  }

  const toggleXMode = () => {
    setIsXModeDrawing(!isXModeDrawing)
    setIsDrawing(!isXModeDrawing)
    if (!isXModeDrawing) {
      ctx?.beginPath()
    } else {
      setLastX(undefined)
      setLastY(undefined)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'c') {
      setIsDrawing(true)
      ctx?.beginPath()
    } else if (e.key === 'r') {
      clearCanvas()
    } else if (e.key === 'x') {
      toggleXMode()
    } else if ('12345'.includes(e.key)) {
      changeColor(e.key)
    } else if (e.key === '[' || e.key === ']') {
      adjustLineWidth(e.key)
    } else if (e.key === 'e') {
      toggleEraser()
    } else if (e.key === 's') {
      saveDrawing()
    } else if (e.key === 'p') {
      setShowColorPicker(!showColorPicker)
    } else if ('0123456789'.includes(e.key)) {
      changeColor(e.key)
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'c' && !isXModeDrawing) {
      setIsDrawing(false)
    }
  }

  const getMousePos = (canvas: HTMLCanvasElement, e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isXModeDrawing) {
      setIsDrawing(true)
    }
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setLastX(x)
      setLastY(y)
      ctx?.beginPath()
      ctx?.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if ((!isDrawing && !isXModeDrawing) || !ctx || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    ctx.lineWidth = currentLineWidth
    ctx.lineCap = 'round'
    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor

    ctx.lineTo(x, y)
    ctx.stroke()

    setLastX(x)
    setLastY(y)
  }

  const stopDrawing = () => {
    if (!isXModeDrawing) {
      setIsDrawing(false)
    }
    ctx?.beginPath()
  }

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const changeColor = (key: string) => {
    const index = parseInt(key) % 10
    setCurrentColorIndex(index)
    switchColor('next')
    switchColor('prev')
  }

  const adjustLineWidth = (key: string) => {
    if (key === '[' && currentLineWidth > 1) {
      setCurrentLineWidth(currentLineWidth - 1)
    } else if (key === ']' && currentLineWidth < 20) {
      setCurrentLineWidth(currentLineWidth + 1)
    }
  }

  const handleWheel = (e: WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.deltaY < 0) {
      switchColor('next')
    } else {
      switchColor('prev')
    }
  }

  const saveDrawing = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = 'drawing.png'
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  return (
    <>
      <Head>
        <title>绘图应用</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </Head>
      <div className="container mt-16" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0}>
        <div className="control-panel">
          <h3>绘图工具</h3>
          <div className="color-ui" style={{ display: showColorPicker ? 'flex' : 'none' }}>
            <button 
              className="color-button main-color" 
              onClick={openMainColorPicker} 
              style={{ backgroundColor: currentColor }}
              title="调色板"
            >
              <i className="fas fa-palette"></i>
            </button>
            {colors.current.map((color, index) => (
              <button
                key={index}
                className="color-button"
                style={{ backgroundColor: color }}
                onClick={() => openColorPicker(index)}
                title={`颜色 ${index}`}
              >
                {index}
              </button>
            ))}
          </div>
          <div className="line-width-container">
            <label htmlFor="lineWidthSlider">线条粗细：</label>
            <input
              type="range"
              id="lineWidthSlider"
              min="1"
              max="20"
              value={currentLineWidth}
              onChange={(e) => setCurrentLineWidth(parseInt(e.target.value))}
            />
            <span>{currentLineWidth}</span>
          </div>
          <div className="button-group">
            <button className="tool-button" onClick={clearCanvas} title="清除画布">
              <i className="fas fa-trash-alt"></i> 清除
            </button>
            <button className={`tool-button ${isEraser ? 'active' : ''}`} onClick={toggleEraser} title="橡皮擦">
              <i className="fas fa-eraser"></i> 橡皮擦
            </button>
            <button className="tool-button" onClick={saveDrawing} title="保存绘图">
              <i className="fas fa-save"></i> 保存
            </button>
            <button className={`tool-button ${isXModeDrawing ? 'active' : ''}`} onClick={toggleXMode} title="X模式绘制">
              <i className="fas fa-pencil-alt"></i> X模式
            </button>
          </div>
        </div>
        <div 
          className="canvas-container" 
          onWheel={handleWheel}
          style={{ touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            id="drawingCanvas"
            width="800"
            height="600"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          ></canvas>
        </div>
        <div className="instructions" dangerouslySetInnerHTML={{ __html: instructions }}></div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: calc(100vh - 4rem);
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          background-color: #f0f2f5;
        }
        .control-panel {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          margin-right: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .color-ui {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .color-button {
          width: 30px;
          height: 30px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          text-shadow: 0 0 2px black;
        }
        .main-color {
          width: 40px;
          height: 40px;
        }
        .line-width-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tool-button {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #f0f0f0;
          transition: background-color 0.3s;
        }
        .tool-button:hover {
          background-color: #e0e0e0;
        }
        .tool-button.active {
          background-color: #d0d0d0;
        }
        .canvas-container {
          overflow: hidden;
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          background-color: white;
        }
        canvas {
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          background-color: white;
        }
        .instructions {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          margin-left: 20px;
          width: 250px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  )
}