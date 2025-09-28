import React from "react";
export default function ReactMarkdownMock({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-testid="react-markdown">{children}</div>;
}
