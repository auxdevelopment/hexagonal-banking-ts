import { Balance } from "./balance.value";

test('Balance test', () => {
    const initial = new Balance(0);
    expect(initial.value).toBe(0)

    const debittedFrom = initial.debitFrom(100);
    expect(debittedFrom.value).toBe(-100);
});