import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';


interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-white">Đã xảy ra lỗi giao diện</h2>
          <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
            Ứng dụng gặp lỗi không mong muốn khi hiển thị. Vui lòng nhấn nút bên dưới để tải lại phần mềm.
          </p>

          {this.state.error && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 max-w-lg w-full text-left overflow-auto text-xs text-red-300 font-mono">
              {this.state.error.toString()}
            </div>
          )}

          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 px-6 py-3 bg-[#005B52] hover:bg-[#00473F] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#005B52]/20 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Tải lại ứng dụng
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

