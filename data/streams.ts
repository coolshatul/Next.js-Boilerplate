export type Course = {
  name: string;
  subjects: string[];
};

export type Stream = {
  name: string;
  boards: string[];
  courses: Course[];
};

export const streams: Stream[] = [
  {
    name: "Arts",
    boards: ["CBSE", "Maharashtra State Board", "CISCE"],
    courses: [
      {
        name: "HSC Arts",
        subjects: [
          "English",
          "Geography",
          "Political Science",
          "History",
          "Psychology",
          "Sociology",
          "Economics",
          "Environmental Studies",
        ],
      },
    ],
  },
  {
    name: "Commerce",
    boards: ["CBSE", "Maharashtra State Board", "CISCE"],
    courses: [
      {
        name: "HSC Commerce",
        subjects: [
          "English",
          "Economics",
          "Book Keeping and Accountancy",
          "Organization of Commerce and Management (OCM)",
          "Secretarial Practice (SP)",
          "Mathematics and Statistics",
          "Information Technology",
        ],
      },
    ],
  },
  {
    name: "Science",
    boards: ["CBSE", "Maharashtra State Board", "CISCE"],
    courses: [
      {
        name: "HSC Science (Computer Science)",
        subjects: [
          "English",
          "Physics",
          "Chemistry",
          "Computer Science",
          "Mathematics",
          "Environmental Studies",
        ],
      },
      {
        name: "HSC Science (IT)",
        subjects: [
          "English",
          "Physics",
          "Chemistry",
          "Information Technology (IT)",
          "Mathematics",
          "Environmental Studies",
        ],
      },
      {
        name: "HSC Science (Electronics)",
        subjects: [
          "English",
          "Physics",
          "Chemistry",
          "Electronics",
          "Mathematics",
          "Environmental Studies",
        ],
      },
      {
        name: "HSC Science (General)",
        subjects: [
          "English",
          "Physics",
          "Chemistry",
          "Biology",
          "Mathematics",
          "Environmental Studies",
        ],
      },
    ],
  },
];
