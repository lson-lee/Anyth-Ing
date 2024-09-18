import SwiftUI

struct ControlPanel: View {
    @ObservedObject var drawingManager: DrawingManager
    
    var body: some View {
        HStack {
            ColorPicker("", selection: $drawingManager.currentColor)
                .frame(width: 30, height: 30)
            
            ForEach(0..<10) { index in
                ColorButton(color: drawingManager.colors[index], action: {
                    drawingManager.selectColor(index: index)
                })
            }
            
            Slider(value: $drawingManager.lineWidth, in: 1...20, step: 1)
                .frame(width: 100)
            
            Button(action: drawingManager.clearCanvas) {
                Image(systemName: "trash")
            }
            
            Button(action: drawingManager.toggleEraser) {
                Image(systemName: "eraser")
            }
            
            Button(action: drawingManager.saveDrawing) {
                Image(systemName: "square.and.arrow.down")
            }
        }
    }
}

struct ColorButton: View {
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Circle()
                .fill(color)
                .frame(width: 30, height: 30)
        }
    }
}
