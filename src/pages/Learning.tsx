import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, HelpCircle, CheckCircle, Code, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Learning = () => {
  const { topicId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState("");

  const { data: topic } = useQuery({
    queryKey: ["topic", topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topics")
        .select(`
          *,
          language:languages(name)
        `)
        .eq("id", parseInt(topicId || "0"))
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
  });

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ["questions", topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("topic_id", parseInt(topicId || "0"))
        .order("id");
      
      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleRunCode = () => {
    if (!userCode.trim()) {
      toast.error("Please write some code first!");
      return;
    }
    
    // Simulate running code - in a real app, this would connect to an actual compiler API
    toast.success("Code executed successfully! (This is a demo - integrate with a real compiler API)");
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowHint(false);
      setShowSolution(false);
      setUserCode("");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowHint(false);
      setShowSolution(false);
      setUserCode("");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Content</h2>
        <p className="text-muted-foreground mb-4">
          Unable to fetch learning content. Please try again later.
        </p>
        <Link to="/languages">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Languages
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to={`/topics/${topic?.language_id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            {topic?.name}
          </h1>
          <p className="text-muted-foreground">
            {topic?.language?.name} • {questions?.length || 0} questions
          </p>
        </div>
      </div>

      <Tabs defaultValue="documentation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="questions" disabled={!questions?.length}>
            Questions ({questions?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Learn the concepts and theory behind this topic
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topic?.documentation ? (
                <div className="prose prose-neutral max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {topic.documentation}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No documentation available for this topic yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          {questions && questions.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Question Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </CardTitle>
                      <Badge variant="outline">
                        {currentQuestion?.id}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      {currentQuestion?.question}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHint(!showHint)}
                        disabled={!currentQuestion?.hint}
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        {showHint ? "Hide Hint" : "Show Hint"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSolution(!showSolution)}
                        disabled={!currentQuestion?.solution}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {showSolution ? "Hide Solution" : "Show Solution"}
                      </Button>
                    </div>

                    {showHint && currentQuestion?.hint && (
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-4">
                          <p className="text-sm text-blue-800">
                            <strong>Hint:</strong> {currentQuestion.hint}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {showSolution && currentQuestion?.solution && (
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-4">
                          <p className="text-sm text-green-800">
                            <strong>Solution:</strong> {currentQuestion.solution}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!questions || currentQuestionIndex >= questions.length - 1}
                      >
                        Next Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compiler Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Online Compiler
                    </CardTitle>
                    <CardDescription>
                      Write and test your solution here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Write your code here..."
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="font-mono text-sm min-h-[300px] resize-none"
                    />
                    <Button onClick={handleRunCode} className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Run Code
                    </Button>
                    
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Output</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground font-mono">
                          Click "Run Code" to see the output here...
                          <br />
                          <em>(Note: This is a demo. Integrate with a real compiler API like Judge0, CodeAPI, or similar services)</em>
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Questions Available</h3>
                <p className="text-muted-foreground">
                  There are no practice questions for this topic yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Learning;