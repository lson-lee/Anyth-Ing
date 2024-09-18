import SwiftUI

class DrawingManager: ObservableObject {
    @Published var lines: [Line] = []
    @Published var currentColor: Color = .black
    @Published var lineWidth: CGFloat = 2
    @Published var isEraser: Bool = false
    
    let colors: [Color] = [
        .red, .orange, .yellow, .green, .blue,
        .purple, .black, .white, .gray, .pink
    ]
    
    func addLine(_ line: Line) {
        lines.append(line)
    }
    
    func clearCanvas() {
        lines.removeAll()
    }
    
    func toggleEraser() {
        isEraser.toggle()
        currentColor = isEraser ? .white : .black
    }
    
    func selectColor(index: Int) {
        currentColor = colors[index]
        isEraser = false
    }
    
    func saveDrawing() {
        // 实现保存功能
        print("保存绘图")
    }
}

struct Line: Identifiable {
    let id = UUID()
    var points: [CGPoint]
    var color: Color
    var lineWidth: CGFloat
}
