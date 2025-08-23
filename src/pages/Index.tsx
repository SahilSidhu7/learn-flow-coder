import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, BookOpen, Lightbulb, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Master Programming Languages
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Interactive learning platform with comprehensive documentation, practice questions, 
            and a built-in compiler to help you become a better programmer.
          </p>
          <Link to="/languages">
            <Button size="lg" className="px-8 py-3 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Comprehensive Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Learn programming concepts with detailed explanations and examples 
                for each topic.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Practice Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Reinforce your learning with curated questions, hints, and detailed 
                solutions for every topic.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Code className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Online Compiler</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Test your solutions immediately with our integrated online compiler 
                supporting multiple languages.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose from our curated programming languages and start learning with 
            structured topics and hands-on practice.
          </p>
          <Link to="/languages">
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              Explore Languages
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
