import SwiftUI

struct ContentView: View {
    @StateObject private var drawingManager = DrawingManager()
    
    var body: some View {
        VStack {
            ControlPanel(drawingManager: drawingManager)
            DrawingView(drawingManager: drawingManager)
            InstructionsView()
        }
        .padding()
    }
}

struct InstructionsView: View {
    let instructions = [
        "按住鼠标左键进行绘制",
        "按 Command+R 键清除画布",
        "按 Command+X 键开始/停止持续绘制",
        "按 1-5 键改变颜色",
        "按 [ 和 ] 键调整线条粗细",
        "按 Command+E 键切换橡皮擦模式",
        "按 Command+S 键保存绘图",
        "按 P 键打开/关闭调色板",
        "按 0-9 键选择快捷颜色",
        "点击快捷颜色按钮可以设置新的颜色"
    ]
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("功能介绍:")
                .font(.headline)
            ForEach(instructions, id: \.self) { instruction in
                Text("• \(instruction)")
                    .font(.caption)
            }
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(10)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
