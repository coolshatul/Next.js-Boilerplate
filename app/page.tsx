import { FormulaGeneratorComponent } from "@/components/formula-generator";

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Generator</h1>
      <p>Generate formulas with AI assistance</p>
      <FormulaGeneratorComponent />
    </div>
  );
}
