import React, { Component, ComponentType, PropsWithChildren } from "react";

import { ErrorFallback, ErrorFallbackProps } from "@/components/ErrorFallback";

export type ErrorBoundaryProps = PropsWithChildren<{
  FallbackComponent?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, stackTrace: string) => void;
}>;

type ErrorBoundaryState = { 
  error: Error | null;
  resetAttemptCount: number;
};

/**
 * This is a special case for for using the class components. Error boundaries must be class components because React only provides error boundary functionality through lifecycle methods (componentDidCatch and getDerivedStateFromError) which are not available in functional components.
 * https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null, resetAttemptCount: 0 };

  static defaultProps: {
    FallbackComponent: ComponentType<ErrorFallbackProps>;
  } = {
    FallbackComponent: ErrorFallback,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, resetAttemptCount: 0 };
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    if (typeof this.props.onError === "function") {
      this.props.onError(error, info.componentStack);
    }
  }

  resetError = (): void => {
    // Increment reset attempt count to force re-mount of children
    this.setState((prevState) => ({ 
      error: null, 
      resetAttemptCount: prevState.resetAttemptCount + 1 
    }));
  };

  render() {
    const { FallbackComponent } = this.props;
    const { error, resetAttemptCount } = this.state;

    if (error && FallbackComponent) {
      return (
        <FallbackComponent
          error={error}
          resetError={this.resetError}
        />
      );
    }

    // Wrap children in a key to force re-mount on reset
    return (
      <React.Fragment key={resetAttemptCount}>
        {this.props.children}
      </React.Fragment>
    );
  }
}
