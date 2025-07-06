import React from 'react';
import { render, screen } from "@testing-library/react";
import TokenBalance from "../TokenBalance";

describe("TokenBalance", () => {
  it("Healing Token 잔액이 정상적으로 표시된다", () => {
    render(<TokenBalance />);
    expect(screen.getByText("내 Healing Token 잔액:")).toBeInTheDocument();
    expect(screen.getByText(/HEAL/)).toBeInTheDocument();
  });
}); 