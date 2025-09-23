import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  HelpCircle,
  CheckCircle,
  Code,
  Play,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism.css';
import Editor from "@monaco-editor/react";

function CodeBlock({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  function copyToClipboard() {
    navigator.clipboard.writeText(codeString);
  }

  return !inline && match ? (
    <div style={{ position: "relative" }}>
      <button
        onClick={copyToClipboard}
        style={{
          position: "absolute",
          right: 10,
          top: 10,
          zIndex: 2,
          padding: "4px 12px",
          fontSize: "13px",
          color: "white",
          border: "2px solid white",
          borderRadius: "5px",
        }}
      >
        Copy
      </button>
      <SyntaxHighlighter
        style={atomDark}
        language={match[9]}
        {...props}
        PreTag="div"
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

const PersLearning = () => {
  const { subtopicId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState('print("Hello, World!")');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("Click run to see output");

  const { data: topic } = useQuery({
    queryKey: ["topic", subtopicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topic_subtopics")
        .select(
          `
          *,
          language:course_topics(language)
        `
        )
        .eq("id", parseInt(subtopicId || "0"))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!subtopicId,
  });

  // Fetch all topics for this language to determine previous/next topic navigation
  const { data: siblingTopics } = useQuery({
    queryKey: ["topics-for-language", topic?.topic_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topic_subtopics")
        .select("id,subtopic_name,topic_id")
        .eq("topic_id", topic?.topic_id as number)
        .order("id");
      if (error) throw error;
      return data;
    },
    enabled: !!topic?.topic_id,
  });

  const currentTopicIndex =
    siblingTopics?.findIndex((t) => t.id === topic?.id) ?? -1;
  const previousTopic =
    currentTopicIndex > 0 ? siblingTopics?.[currentTopicIndex - 1] : undefined;
  const nextTopic =
    siblingTopics &&
    currentTopicIndex >= 0 &&
    currentTopicIndex < siblingTopics.length - 1
      ? siblingTopics[currentTopicIndex + 1]
      : undefined;

  const {
    data: questions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["questions", subtopicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subtopic_questions")
        .select("*")
        .eq("subtopic_id", parseInt(subtopicId || "0"))
        .order("id");

      if (error) throw error;
      return data;
    },
    enabled: !!subtopicId,
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  // const handleRunCode = () => {
  //   if (!userCode.trim()) {
  //     toast.error("Please write some code first!");
  //     return;
  //   }

  //   // Simulate running code - in a real app, this would connect to an actual compiler API
  //   toast.success("Code executed successfully! (This is a demo - integrate with a real compiler API)");
  // };

  async function handleRunCode() {
    setLoading(true);
    const response = await fetch(
      "http://comp.webappster.store/submissions?base64_encoded=false&wait=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: userCode,
          language_id: 71,
        }),
      }
    );

    const data = await response.json();
    const token = data.token;

    // Poll for result
    const getResult = async () => {
      const res = await fetch(
        `http://comp.webappster.store/submissions/${token}?base64_encoded=false`
      );
      const result = await res.json();

      if (result.status.id <= 2) {
        // Status 1 or 2 means still processing, poll again
        setTimeout(getResult, 1000);
      } else {
        // Execution is complete
        setOutput(
          result.stdout || result.compile_output || result.stderr || "No output"
        );
        setLoading(false);
      }
    };

    getResult();
    // const payload = {
    //   language,
    //   stdin,
    //   files: [{
    //     name: language === 'python' ? 'main.py' : 'Main.' + language,
    //     content: userCode,
    //   }]
    // };
    // try {
    //   const res = await axios.post(
    //     'https://onecompiler.com/api/v1/run?access_token=YOUR_API_KEY',
    //     payload
    //   );
    //   setOutput(res.data.stdout || res.data.stderr || res.data.exception);
    // } catch (err) {
    //   setOutput('Error executing code');
    // }
    // setLoading(false);
  }

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
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Error Loading Content
        </h2>
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
        <Link to={`/subtopics/${topic?.topic_id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            {topic?.subtopic_name}
          </h1>
          <p className="text-muted-foreground">
            {topic?.language?.language} • {questions?.length || 0} questions
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
                    <Markdown
                      components={{
                        code: CodeBlock,
                      }}
                    >
                      {topic.documentation}
                    </Markdown>
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
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions.length}
                      </CardTitle>
                      <Badge variant="outline">{currentQuestion?.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      <Markdown>{currentQuestion?.question_text}</Markdown>
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
                            <strong>Hint:</strong>
                            <Markdown>{currentQuestion.hint}</Markdown>
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {showSolution && currentQuestion?.solution && (
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-4">
                          <p className="text-sm text-green-800">
                            <strong>Solution:</strong>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                              <Markdown>{currentQuestion.solution}</Markdown>
                            </div>
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
                        disabled={
                          !questions ||
                          currentQuestionIndex >= questions.length - 1
                        }
                      >
                        Next Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compiler Section */}
              <div className="space-y-6">
                <iframe
                  frameBorder="0"
                  height="450px"
                  src={`https://onecompiler.com/embed/${
                    topic?.language?.language.toLowerCase().split(" ")[0] ||
                    "cpp"
                  }?hideNew=true&hideNewFileOption=true&hideTitle=true`}
                  width="100%"
                ></iframe>
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
                    {/* <Textarea
                      placeholder="Write your code here..."
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="font-mono text-sm min-h-[300px] resize-none"
                    /> */}
                    {/* <Editor
      value={userCode}
      onValueChange={userCode => setUserCode(userCode)}
      highlight={userCode => highlight(userCode, languages.js)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 18,
      }}
    /> */}
                    {/* <Editor
      height="40vh"
      defaultLanguage="javascript"
      value={userCode}
      theme="vs-dark"                // Change to "vs-light" for a light theme
      onChange={setUserCode}
      options={{
        selectOnLineNumbers: true,
        fontSize: 14,
        minimap: { enabled: true },
      }}
    /> */}
                    {/* <Button onClick={handleRunCode} className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Run Code
                    </Button>
                    
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Output</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {output}
                      </CardContent>
                    </Card> */}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  No Questions Available
                </h3>
                <p className="text-muted-foreground">
                  There are no practice questions for this topic yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      {/* Floating Next/Previous Topic Controls */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Link to={previousTopic ? `/perslearn/${previousTopic.id}` : `#`}>
          <Button variant="outline" disabled={!previousTopic}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous Topic
          </Button>
        </Link>
        <Link to={nextTopic ? `/perslearn/${nextTopic.id}` : `#`}>
          <Button disabled={!nextTopic}>
            Next Topic <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PersLearning;
