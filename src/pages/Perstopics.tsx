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
import { ArrowLeft, BookOpen, HelpCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Code2 } from "lucide-react";

const Perstopics = () => {
  const { courseId } = useParams();

  const { data: language } = useQuery({
    queryKey: ["language", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usercources")
        .select("*")
        .eq("id", parseInt(courseId || "0"))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const {
    data: course_topics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course_topics", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_topics")
        .select("*")
        .eq("course_id", parseInt(courseId || "0"))
        .order("id");

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: questionCounts } = useQuery({
    queryKey: ["question-counts", courseId],
    queryFn: async () => {
      // First get all topic IDs for this language
      const { data: courseIds } = await supabase
        .from("course_topics")
        .select("id")
        .eq("course_id", parseInt(courseId || "0"));

      if (!courseIds?.length) return {};

      // Then get all questions for these topics
      const { data: questions, error } = await supabase
        .from("questions")
        .select("topic_id")
        .in(
          "topic_id",
          courseIds.map((t) => t.id)
        );

      if (error) throw error;

      // Count questions by topic_id
      const counts: Record<number, number> = {};
      questions?.forEach((q) => {
        counts[q.topic_id] = (counts[q.topic_id] || 0) + 1;
      });
      return counts;
    },
    enabled: !!courseId,
  });

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
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Error Loading Topics
        </h2>
        <p className="text-muted-foreground mb-4">
          Unable to fetch topics for this language. Please try again later.
        </p>
        <Link to="/personal-courses">
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
        <Link to="/personal-courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{language?.course} Topics</h1>
          <p className="text-muted-foreground">
            Learn {language?.course} step by step through these topics
          </p>
        </div>
      </div>

      {course_topics && course_topics.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course_topics.map((usercourse) => (
            <Card
              key={usercourse.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="text-center">
                <Code2 className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle>{usercourse.topic_name}</CardTitle>
                <CardDescription>
                  Start learning {usercourse.topic_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={`/subtopics/${usercourse.id}`}>
                  <Button className="w-full">Start Learning</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Topics Available</h2>
          <p className="text-muted-foreground mb-4">
            There are no topics available for this language yet.
          </p>
          <Link to="/personal-courses">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Perstopics;
