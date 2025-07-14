"use client"

import { useState, useEffect } from "react"
import { Search, Download, Eye, Calendar, User, FileCode } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ReviewHistoryItem {
  id: string
  filename: string
  timestamp: string
  model: string
  user: string
  issues: {
    bugs: number
    security: number
    refactoring: number
  }
  complexity: number
  status: "completed" | "in-progress" | "failed"
  details: {
    bugs: string[]
    security: string[]
    refactoring: string[]
    docstring: string
  }
}

export default function ReviewHistory() {
  const [history, setHistory] = useState<ReviewHistoryItem[]>([])
  const [filteredHistory, setFilteredHistory] = useState<ReviewHistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modelFilter, setModelFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch review history
    const fetchHistory = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockHistory: ReviewHistoryItem[] = [
        {
          id: "1",
          filename: "auth_service.py",
          timestamp: "2024-01-15 14:30:00",
          model: "GPT-4",
          user: "john.doe@company.com",
          issues: { bugs: 3, security: 2, refactoring: 4 },
          complexity: 7.2,
          status: "completed",
          details: {
            bugs: ["Null pointer exception", "Memory leak", "Race condition"],
            security: ["SQL injection", "XSS vulnerability"],
            refactoring: ["Extract method", "Reduce complexity", "Add error handling", "Improve naming"],
            docstring: "Generated docstring for auth_service.py functions",
          },
        },
        {
          id: "2",
          filename: "data_processor.js",
          timestamp: "2024-01-15 13:45:00",
          model: "CodeLlama",
          user: "jane.smith@company.com",
          issues: { bugs: 1, security: 0, refactoring: 3 },
          complexity: 5.8,
          status: "completed",
          details: {
            bugs: ["Undefined variable"],
            security: [],
            refactoring: ["Use const instead of var", "Add JSDoc comments", "Optimize loop"],
            docstring: "Generated JSDoc for data processing functions",
          },
        },
        {
          id: "3",
          filename: "user_controller.py",
          timestamp: "2024-01-15 12:20:00",
          model: "GPT-4",
          user: "bob.wilson@company.com",
          issues: { bugs: 5, security: 3, refactoring: 6 },
          complexity: 9.1,
          status: "completed",
          details: {
            bugs: ["Index out of bounds", "Type error", "Logic error", "Missing validation", "Resource leak"],
            security: ["Insecure deserialization", "Missing authentication", "Weak encryption"],
            refactoring: [
              "Break down large function",
              "Add type hints",
              "Improve error handling",
              "Use design patterns",
              "Add unit tests",
              "Optimize database queries",
            ],
            docstring: "Comprehensive docstrings for user controller methods",
          },
        },
        {
          id: "4",
          filename: "api_routes.py",
          timestamp: "2024-01-15 11:15:00",
          model: "Claude-3",
          user: "alice.brown@company.com",
          issues: { bugs: 2, security: 1, refactoring: 2 },
          complexity: 4.5,
          status: "in-progress",
          details: {
            bugs: ["Missing error handling", "Incorrect status code"],
            security: ["Missing rate limiting"],
            refactoring: ["Add input validation", "Improve response format"],
            docstring: "API endpoint documentation",
          },
        },
        {
          id: "5",
          filename: "database.py",
          timestamp: "2024-01-15 10:30:00",
          model: "GPT-4",
          user: "charlie.davis@company.com",
          issues: { bugs: 8, security: 4, refactoring: 7 },
          complexity: 8.7,
          status: "failed",
          details: {
            bugs: [],
            security: [],
            refactoring: [],
            docstring: "",
          },
        },
      ]

      setHistory(mockHistory)
      setFilteredHistory(mockHistory)
      setIsLoading(false)
    }

    fetchHistory()
  }, [])

  useEffect(() => {
    let filtered = history

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.user.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Apply model filter
    if (modelFilter !== "all") {
      filtered = filtered.filter((item) => item.model === modelFilter)
    }

    setFilteredHistory(filtered)
  }, [history, searchTerm, statusFilter, modelFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  const getComplexityColor = (score: number) => {
    if (score >= 8) return "text-red-600"
    if (score >= 6) return "text-yellow-600"
    return "text-green-600"
  }

  const exportHistory = () => {
    const csvContent = [
      ["Filename", "Timestamp", "Model", "User", "Bugs", "Security", "Refactoring", "Complexity", "Status"].join(","),
      ...filteredHistory.map((item) =>
        [
          item.filename,
          item.timestamp,
          item.model,
          item.user,
          item.issues.bugs,
          item.issues.security,
          item.issues.refactoring,
          item.complexity,
          item.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "review-history.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Review History
        </CardTitle>
        <CardDescription>Complete history of all code reviews and analysis results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by filename or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="GPT-4">GPT-4</SelectItem>
              <SelectItem value="CodeLlama">CodeLlama</SelectItem>
              <SelectItem value="Claude-3">Claude-3</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportHistory} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* History Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Complexity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4" />
                      {item.filename}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {item.user.split("@")[0]}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.model}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {item.issues.bugs > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {item.issues.bugs}B
                        </Badge>
                      )}
                      {item.issues.security > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {item.issues.security}S
                        </Badge>
                      )}
                      {item.issues.refactoring > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {item.issues.refactoring}R
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getComplexityColor(item.complexity)}`}>{item.complexity}/10</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Review Details: {item.filename}</DialogTitle>
                          <DialogDescription>
                            Analyzed by {item.model} on {new Date(item.timestamp).toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {item.status === "completed" && (
                            <>
                              {item.details.bugs.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Bugs Found:</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {item.details.bugs.map((bug, index) => (
                                      <li key={index} className="text-sm">
                                        {bug}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {item.details.security.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Security Issues:</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {item.details.security.map((issue, index) => (
                                      <li key={index} className="text-sm">
                                        {issue}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {item.details.refactoring.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Refactoring Suggestions:</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {item.details.refactoring.map((suggestion, index) => (
                                      <li key={index} className="text-sm">
                                        {suggestion}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {item.details.docstring && (
                                <div>
                                  <h4 className="font-semibold mb-2">Generated Documentation:</h4>
                                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto">
                                    {item.details.docstring}
                                  </pre>
                                </div>
                              )}
                            </>
                          )}
                          {item.status === "failed" && (
                            <div className="text-red-600">Review failed. Please try again or contact support.</div>
                          )}
                          {item.status === "in-progress" && (
                            <div className="text-blue-600">Review is currently in progress...</div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">No reviews found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
