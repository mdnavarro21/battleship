import AIFactory from "../modules/AI";

test('randomAttack returns two valid coordinates', () => {
    let AI = AIFactory();
    expect(AI.randomAttack().length).toBe(2);
    expect(typeof AI.randomAttack()[0]).toBe('number');
    expect(AI.randomAttack()[0] <= 9).toBeTruthy();
    expect(AI.randomAttack()[0] >=0).toBeTruthy();

    expect(typeof AI.randomAttack()[1]).toBe('number');
    expect(AI.randomAttack()[1] <= 9).toBeTruthy();
    expect(AI.randomAttack()[1] >=0).toBeTruthy();
})