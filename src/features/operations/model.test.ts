import { describe, expect, it } from "vitest";
import {
  gross,
  reconcile,
  seedOperations,
  subtotal,
  tax,
  total,
} from "./model";

describe("demo accounting amounts", () => {
  it("rounds invoice lines and GST to cents", () => {
    const invoice = {
      ...seedOperations().invoices[0],
      quantity: 1.25,
      rate: 12345,
      gst: true,
    };
    expect(subtotal(invoice)).toBe(15431);
    expect(tax(invoice)).toBe(1543);
    expect(total(invoice)).toBe(16974);
  });
  it("does not add tax to GST-free invoices", () => {
    const invoice = seedOperations().invoices[0];
    expect(tax(invoice)).toBe(0);
    expect(total(invoice)).toBe(56000);
  });
  it("includes allowances in sample gross pay", () => {
    expect(gross(seedOperations().workers[0])).toBe(247400);
  });
});
describe("bank matching", () => {
  it("records the receipt atomically and prevents duplicate matching", () => {
    const original = seedOperations();
    const result = reconcile(original, "BNK-001", "INV-2041");
    expect(result.matches["BNK-001"]).toBe("INV-2041");
    expect(result.invoices[0].status).toBe("Paid");
    expect(result.invoices[0].paid).toBe(56000);
    expect(original.invoices[0].paid).toBe(0);
    expect(() => reconcile(result, "BNK-001", "INV-2041")).toThrow();
  });
  it("rejects missing, mismatched and unapproved invoices", () => {
    const state = seedOperations();
    expect(() => reconcile(state, "BNK-001", "missing")).toThrow();
    expect(() => reconcile(state, "BNK-001", "INV-2042")).toThrow();
    state.invoices[0].status = "Draft";
    expect(() => reconcile(state, "BNK-001", "INV-2041")).toThrow();
  });
});
