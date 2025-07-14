"use client"

import { useState } from "react"
import { Upload, FileCode, Brain, Database, GitPullRequest, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CodeUploader from "@/components/code-uploader"
import ReviewDashboard from "@/components/review-dashboard"
import ReviewHistory from "@/components/review-history"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GenAI Code Reviewer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered code analysis, refactoring suggestions, and automated reviews with support for multiple AI models
            including GPT-4 and CodeLlama
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <FileCode className="h-8 w-8 mx-auto text-blue-600" />
              <CardTitle className="text-lg">Code Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Detect bugs, code smells, and security vulnerabilities</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Brain className="h-8 w-8 mx-auto text-green-600" />
              <CardTitle className="text-lg">AI Refactoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get intelligent suggestions for code improvements</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <GitPullRequest className="h-8 w-8 mx-auto text-purple-600" />
              <CardTitle className="text-lg">PR Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Automated comments and reviews on pull requests</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 mx-auto text-orange-600" />
              <CardTitle className="text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Track review history and code quality metrics</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Code Review
                </TabsTrigger>
                <TabsTrigger value="dashboard">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Database className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <CodeUploader />
              </TabsContent>

              <TabsContent value="dashboard" className="mt-6">
                <ReviewDashboard />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <ReviewHistory />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
