import React from "react";
import Routes from "./Routes";
import LoginButton from "./components/LoginButton";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('GlobalErrorBoundary caught error:', error);
    console.error('Error info:', info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h1>Application error</h1>
          <p>Something went wrong while rendering the app. Check the console for details.</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: 12 }}>{String(this.state.error)}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <GlobalErrorBoundary>
      <div>
        <header>
          <LoginButton />
        </header>
        <Routes />
      </div>
    </GlobalErrorBoundary>
  );
}

export default App;
