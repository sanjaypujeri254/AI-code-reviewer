"use client"

import { useState } from "react"
import { FileText, Settings, Zap, BookOpen, Calculator } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface ReviewResult {
  bugs: string[]
  security: string[]
  refactoring: string[]
  complexity: number
  docstring?: string
  autocomplete?: string
}

export default function CodeUploader() {
  const [code, setCode] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleAnalyze = async () => {
    if (!code.trim()) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulate API call to backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock analysis results
      const mockResult: ReviewResult = {
        bugs: [
          "Potential null pointer exception on line 15",
          "Unclosed file handle in function processData()",
          "Race condition in concurrent access to shared variable",
        ],
        security: [
          "SQL injection vulnerability in database query",
          "Unvalidated user input in authentication function",
          "Hardcoded API key detected",
        ],
        refactoring: [
          "Extract method: Lines 20-35 can be refactored into a separate function",
          "Replace magic numbers with named constants",
          "Consider using dependency injection for better testability",
          "Reduce cyclomatic complexity by breaking down large functions",
        ],
        complexity: 8.5,
        docstring: `"""
Process user data and perform validation.

Args:
    user_data (dict): Dictionary containing user information
    validation_rules (list): List of validation rules to apply

Returns:
    dict: Processed and validated user data

Raises:
    ValidationError: If user data fails validation
    DatabaseError: If database operation fails
"""`,
        autocomplete: `def process_user_data(user_data, validation_rules):
    # Validate input parameters
    if not isinstance(user_data, dict):
        raise TypeError("user_data must be a dictionary")
    
    # Apply validation rules
    for rule in validation_rules:
        if not rule.validate(user_data):
            raise ValidationError(f"Validation failed: {rule.message}")
    
    return user_data`,
      }

      setReviewResult(mockResult)
      setAnalysisProgress(100)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
      clearInterval(progressInterval)
    }
  }

  const getSeverityColor = (type: string) => {
    switch (type) {
      case "bugs":
        return "destructive"
      case "security":
        return "destructive"
      case "refactoring":
        return "secondary"
      default:
        return "default"
    }
  }

  const getComplexityColor = (score: number) => {
    if (score >= 8) return "text-red-600"
    if (score >= 6) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      {/* Code Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Code Input
          </CardTitle>
          <CardDescription>Upload your code for AI-powered analysis and review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">AI Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="codellama">CodeLlama</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAnalyze} disabled={!code.trim() || isAnalyzing} className="mt-6">
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Source Code</label>
            <Textarea
              placeholder="Paste your code here for analysis..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analysis Progress</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {reviewResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>AI-powered code review results using {selectedModel}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="issues" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="refactoring">Refactoring</TabsTrigger>
                <TabsTrigger value="docstring">Docstring</TabsTrigger>
                <TabsTrigger value="autocomplete">Autocomplete</TabsTrigger>
              </TabsList>

              <TabsContent value="issues" className="space-y-4">
                {/* Complexity Score */}
                <Alert>
                  <Calculator className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>Computational Complexity Score:</span>
                      <span className={`font-bold ${getComplexityColor(reviewResult.complexity)}`}>
                        {reviewResult.complexity}/10
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Bugs */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="destructive">Bugs ({reviewResult.bugs.length})</Badge>
                  </h4>
                  <div className="space-y-2">
                    {reviewResult.bugs.map((bug, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertDescription>{bug}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>

                {/* Security Issues */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="destructive">Security ({reviewResult.security.length})</Badge>
                  </h4>
                  <div className="space-y-2">
                    {reviewResult.security.map((issue, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertDescription>{issue}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="refactoring" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="secondary">Suggestions ({reviewResult.refactoring.length})</Badge>
                  </h4>
                  <div className="space-y-2">
                    {reviewResult.refactoring.map((suggestion, index) => (
                      <Alert key={index}>
                        <AlertDescription>{suggestion}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="docstring" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Generated Docstring
                  </h4>
                  <Card>
                    <CardContent className="p-4">
                      <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto">{reviewResult.docstring}</pre>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="autocomplete" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Code Completion Suggestion
                  </h4>
                  <Card>
                    <CardContent className="p-4">
                      <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto">{reviewResult.autocomplete}</pre>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
