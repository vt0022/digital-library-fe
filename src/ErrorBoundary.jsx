import React, { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Cập nhật state để hiển thị UI dự phòng sau khi lỗi được bắt
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Bạn có thể log lỗi vào một dịch vụ log lỗi ở đây
        this.setState({ error, errorInfo });
        console.error("Error caught by Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Bạn có thể render bất kỳ UI dự phòng nào
            return (
                <div>
                    <h1>Something went wrong.</h1>
                    <details style={{ whiteSpace: "pre-wrap" }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
