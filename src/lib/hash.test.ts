import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./hash";

describe("hash", () => {
  it("hashes and verifies", async () => {
    const plain = "secret-123";
    const hash = await hashPassword(plain);
    expect(hash).not.toEqual(plain);
    const ok = await verifyPassword(plain, hash);
    expect(ok).toBe(true);
  });
});
