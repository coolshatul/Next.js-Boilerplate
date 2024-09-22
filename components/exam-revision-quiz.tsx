"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Loader,
  CheckCircle,
  XCircle,
  Badge,
} from "lucide-react";
import Dropdown from "@/components/Dropdown";

// Importing data arrays
import { streams, Course } from "@/data/streams";
import { mockQuestions } from "@/data/mockQuestions";
import { mockTests, Test } from "@/data/mockTests";

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

export default function ExamRevisionQuiz() {
  // Selection states
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  // Derived states for dependent dropdowns
  const [availableBoards, setAvailableBoards] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(mockQuestions.length).fill(null)
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handlers for dropdown changes
  const handleStreamChange = (value: string) => {
    setSelectedStream(value);
    setSelectedBoard("");
    setSelectedCourse("");
    setSelectedSubject("");
    setAvailableBoards(getBoardsByStream(value));
    setAvailableCourses(getCoursesByStream(value));
    setAvailableSubjects([]);
  };

  const handleBoardChange = (value: string) => {
    setSelectedBoard(value);
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedSubject("");
    setAvailableSubjects(getSubjectsByCourse(selectedStream, value));
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
  };

  // Utility functions to get dependent data
  const getBoardsByStream = (streamName: string): string[] => {
    const stream = streams.find((s) => s.name === streamName);
    return stream ? stream.boards : [];
  };

  const getCoursesByStream = (streamName: string): Course[] => {
    const stream = streams.find((s) => s.name === streamName);
    return stream ? stream.courses : [];
  };

  const getSubjectsByCourse = (
    streamName: string,
    courseName: string
  ): string[] => {
    const stream = streams.find((s) => s.name === streamName);
    if (!stream) return [];
    const course = stream.courses.find((c) => c.name === courseName);
    return course ? course.subjects : [];
  };

  // // Test selection handler
  // const handleTestSelection = (test: Test) => setSelectedTest(test);

  // Test selection handler with API call
  const handleTestSelection = async (test: Test) => {
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers([]);

    try {
      const response = await fetch("/api/getQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stream: selectedStream,
          board: selectedBoard,
          course: selectedCourse,
          subject: selectedSubject,
          test,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch questions.");
      }

      const fetchedQuestions: Question[] = await response.json();

      if (fetchedQuestions.length === 0) {
        throw new Error("No questions available for the selected criteria.");
      }

      setQuestions(fetchedQuestions);
      setAnswers(new Array(fetchedQuestions.length).fill(null));
    } catch (err: any) {
      console.error("Error fetching questions:", err);
      setError(err.message || "An unexpected error occurred.");
      setSelectedTest(null);
    } finally {
      setLoading(false);
      setSelectedTest(test);
    }
  };

  // Quiz answer handlers
  const handleAnswerSelection = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleClearAnswer = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = null;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const calculateScore = () => {
    return answers.reduce((score: number, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  // Rendering functions
  const renderSelectionStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Exam Revision Quiz</CardTitle>
        <CardDescription>
          Select your educational details to find study resources.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dropdown
          placeholder="Select Stream"
          options={streams.map((stream) => stream.name)}
          value={selectedStream}
          onChange={handleStreamChange}
        />

        <Dropdown
          placeholder="Select Board"
          options={availableBoards}
          value={selectedBoard}
          onChange={handleBoardChange}
          disabled={!selectedStream}
        />

        <Dropdown
          placeholder="Select Course"
          options={availableCourses.map((course) => course.name)}
          value={selectedCourse}
          onChange={handleCourseChange}
          disabled={!selectedStream}
        />

        <Dropdown
          placeholder="Select Subject"
          options={availableSubjects}
          value={selectedSubject}
          onChange={handleSubjectChange}
          disabled={!selectedCourse}
        />
      </CardContent>
      <div className="flex justify-end mt-4">
        {selectedStream &&
          selectedBoard &&
          selectedCourse &&
          selectedSubject && <Button onClick={() => {}}>Proceed</Button>}
      </div>
    </Card>
  );

  const renderTestSelection = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Available Tests</CardTitle>
        <CardDescription>Select a test to begin your revision.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        ) : (
          mockTests.map((test) => (
            <Button
              key={test.id}
              onClick={() => handleTestSelection(test)}
              className="w-full justify-start text-left py-6"
              variant="outline"
            >
              <div>
                <div className="font-semibold">{test.name}</div>
                <div className="text-sm text-muted-foreground">
                  Questions: {test.questions} | Duration: {test.duration}
                </div>
              </div>
            </Button>
          ))
        )}
        <Button
          onClick={() => {
            setSelectedStream("");
            setSelectedBoard("");
            setSelectedCourse("");
            setSelectedSubject("");
          }}
          className="w-full"
        >
          Back to Educational Details
        </Button>
      </CardContent>
    </Card>
  );

  const renderQuiz = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{selectedTest?.name}</CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="w-full"
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-medium">{questions[currentQuestion].text}</p>
        <RadioGroup
          value={answers[currentQuestion]?.toString() || ""}
          onValueChange={(value: string) =>
            handleAnswerSelection(parseInt(value))
          }
        >
          {questions[currentQuestion].options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="flex-grow cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleClearAnswer} variant="secondary">
            Clear Answer
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Quiz Results</CardTitle>
        <CardDescription>
          You've completed the {selectedTest?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-4xl font-bold mb-2">
            {calculateScore()} / {questions.length}
          </p>
          <p className="text-lg text-muted-foreground">
            {((calculateScore() / questions.length) * 100).toFixed(2)}% Correct
          </p>
        </div>
        <Progress
          value={(calculateScore() / questions.length) * 100}
          className="w-full h-4"
        />
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Correct Answer</span>
          </div>
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <XCircle className="h-4 w-4" />
            <span>Wrong Answer</span>
          </div>
        </div>

        {/* Mapping through the questions to show result per question */}
        {questions.map((question, index) => (
          <Card
            key={question.id}
            className="border border-gray-200 shadow-sm p-4"
          >
            <CardHeader>
              <CardTitle>Question {index + 1}</CardTitle>
              <CardDescription>{question.text}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Options */}
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-center space-x-2 rounded-md"
                >
                  <span className="flex-grow text-sm">{option}</span>

                  {/* Display badge for correct answer */}
                  {optionIndex === question.correctAnswer && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}

                  {/* Show if the user's answer was wrong */}
                  {answers[index] !== null &&
                    answers[index] === optionIndex &&
                    optionIndex !== question.correctAnswer && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                      </div>
                    )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={() => {
            setSelectedTest(null);
            setCurrentQuestion(0);
            setAnswers(new Array(questions.length).fill(null));
            setQuizSubmitted(false);
          }}
          className="w-full"
        >
          Back to Test Selection
        </Button>
      </CardContent>
    </Card>
  );

  // Main render logic
  if (
    !selectedStream ||
    !selectedBoard ||
    !selectedCourse ||
    !selectedSubject
  ) {
    return renderSelectionStep();
  }

  if (!selectedTest) {
    return renderTestSelection();
  }

  if (quizSubmitted) {
    return renderResults();
  }
  if (questions.length) {
    return renderQuiz();
  }
}
