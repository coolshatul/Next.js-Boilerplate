"use client";

type FormulaRequest = {
  spreadsheetApp: string;
  problem: string;
};

type ApiResponse = {
  choices: { delta: { content: string } }[];
};

async function fetchFromApi(
  solution: string,
  userPrompt: string,
  application: string,
  formula?: string
): Promise<string> {
  const url = new URL(`/gpt/request-gpt.php`, window.location.origin);
  url.searchParams.append("application", application);
  url.searchParams.append("solution", solution);
  url.searchParams.append("user_prompt", userPrompt);

  if (formula) {
    url.searchParams.append("formula", formula);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to generate formula");
  }

  return await response.text();
}

export async function generateFormula(
  request: FormulaRequest
): Promise<{ formula: string; explanation: string }> {
  const { spreadsheetApp, problem } = request;

  // Step 1: Get the formula
  const solution = "formula";
  const application =
    spreadsheetApp == "excel" ? "Microsoft Excel" : "Google Sheets";
  const data = await fetchFromApi(solution, problem, application);
  const formula = extractContent(data.split("data:")).join("");

  // Step 2: Get the explanation if a formula was found
  let explanation = "";
  if (formula) {
    const explanationData = await fetchFromApi(
      "formula-explanation",
      problem,
      application,
      formula
    );
    const extractedContent = extractContent(explanationData.split("data:"));
    explanation = removeJokeLines(extractedContent.join(""));
  }

  return { formula, explanation };
}

function extractContent(data: string[]): string[] {
  return data.reduce((contents: string[], item: string) => {
    try {
      const parsedItem: ApiResponse = JSON.parse(item.trim());
      const content = parsedItem.choices?.[0]?.delta?.content || "";
      if (content) {
        contents.push(content);
      }
    } catch {
      // Skip non-JSON strings
    }
    return contents;
  }, []);
}

function removeJokeLines(text: string): string {
  const lines = text.split("\n");
  const jokeIndex = lines.findIndex((line) =>
    line.toLowerCase().includes("joke")
  );
  return jokeIndex !== -1 ? lines.slice(0, jokeIndex).join("\n").trim() : text;
}
