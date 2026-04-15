"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ContactFormErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="contact-form-shell">
          <p className="contact-form__status contact-form__status--error">
            Form tạm thời chưa khả dụng. Vui lòng liên hệ qua Zalo hoặc điện thoại.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
