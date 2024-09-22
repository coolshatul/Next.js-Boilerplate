"use client";

import { useState, useEffect } from "react";
import { ClipboardIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateFormula } from "./api/formula-service";

export function FormulaGeneratorComponent() {
  const [spreadsheetApp, setSpreadsheetApp] = useState("excel");
  const [problem, setProblem] = useState("");
  const [formula, setFormula] = useState("");
  const [explanation, setExplanation] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verror, setVError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVError(null);
    setFormula("");
    setExplanation("");

    try {
      if (!problem) {
        setVError(
          "Please provide the details of the formula need assistance with."
        );
      } else {
        const data = await generateFormula({ spreadsheetApp, problem });
        setFormula(data.formula);
        setExplanation(data.explanation);
      }
    } catch (err) {
      setError(
        "An error occurred while generating the formula. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyFormula = () => {
    navigator.clipboard.writeText(formula);
  };

  if (!mounted) return null;

  return (
    <div className="pt-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="spreadsheet-app" className="text-sm font-medium">
                Choose spreadsheet application
              </label>
              <Select value={spreadsheetApp} onValueChange={setSpreadsheetApp}>
                <SelectTrigger id="spreadsheet-app">
                  <SelectValue placeholder="Select spreadsheet application" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="google-sheets">Google Sheets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="problem" className="text-sm font-medium">
                Describe the problem you are trying to solve or formula you want
                explained
              </label>
              <Textarea
                id="problem"
                placeholder="E.g., I want to sum up a column of numbers"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="h-32"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <SparklesIcon className="w-4 h-4 mr-2" />
              {loading ? "Generating..." : "Generate Formula"}
            </Button>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {verror && (
            <Alert variant="default" className="mt-4">
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>{verror}</AlertDescription>
            </Alert>
          )}
          {formula && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="formula" className="text-sm font-medium">
                  Generated Formula
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="formula"
                    value={formula}
                    readOnly
                    className="flex-grow"
                  />
                  <Button
                    onClick={copyFormula}
                    variant="outline"
                    className="sm:ml-2"
                  >
                    <ClipboardIcon className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="explanation" className="text-sm font-medium">
                  Formula Explanation
                </label>
                <Textarea
                  id="explanation"
                  value={explanation}
                  readOnly
                  className="h-32"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
