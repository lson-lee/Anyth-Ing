import SwiftUI

struct DrawingView: View {
    @ObservedObject var drawingManager: DrawingManager
    @State private var currentLine: Line?
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Color.white
                
                ForEach(drawingManager.lines) { line in
                    Path { path in
                        path.addLines(line.points)
                    }
                    .stroke(line.color, lineWidth: line.lineWidth)
                }
                
                if let currentLine = currentLine {
                    Path { path in
                        path.addLines(currentLine.points)
                    }
                    .stroke(currentLine.color, lineWidth: currentLine.lineWidth)
                }
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        let point = value.location
                        if currentLine == nil {
                            currentLine = Line(points: [point], color: drawingManager.currentColor, lineWidth: drawingManager.lineWidth)
                        } else {
                            currentLine?.points.append(point)
                        }
                    }
                    .onEnded { _ in
                        if let line = currentLine {
                            drawingManager.addLine(line)
                            currentLine = nil
                        }
                    }
            )
        }
        .border(Color.black, width: 1)
    }
}
