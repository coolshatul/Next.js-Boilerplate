export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

export const mockQuestions: Question[] = [
  {
    id: 1,
    text: "The outer layer of the pollen grain is thick and made up of a complex, non-biodegradable substance called _______.",
    options: ["pectin", "sporopollenin", "lignin", "cellulose"],
    correctAnswer: 1,
  },
  {
    id: 2,
    text: "Which of the following is not a function of the cell membrane?",
    options: [
      "Selective permeability",
      "Cell division",
      "Cell recognition",
      "Protection",
    ],
    correctAnswer: 1,
  },
];
