export type Test = {
  id: string;
  name: string;
  questions: number;
  duration: string;
};

export const mockTests: Test[] = [
  { id: "1", name: "2024 Test 01", questions: 2, duration: "10:00" },
  { id: "2", name: "2024 Test 02", questions: 10, duration: "20:00" },
  { id: "3", name: "2024 Test 03", questions: 20, duration: "40:00" },
];
