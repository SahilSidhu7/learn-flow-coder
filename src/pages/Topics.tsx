import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, HelpCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Topics = () => {
  const { languageId } = useParams();

  const { data: language } = useQuery({
    queryKey: ["language", languageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("id", parseInt(languageId || "0"))
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!languageId,
  });

  const { data: topics, isLoading, error } = useQuery({
    queryKey: ["topics", languageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .eq("language_id", parseInt(languageId || "0"))
        .order("id");
      
      if (error) throw error;
      return data;
    },
    enabled: !!languageId,
  });

  const { data: questionCounts } = useQuery({
    queryKey: ["question-counts", languageId],
    queryFn: async () => {
      // First get all topic IDs for this language
      const { data: topicIds } = await supabase
        .from("topics")
        .select("id")
        .eq("language_id", parseInt(languageId || "0"));
      
      if (!topicIds?.length) return {};
      
      // Then get all questions for these topics
      const { data: questions, error } = await supabase
        .from("questions")
        .select("topic_id")
        .in("topic_id", topicIds.map(t => t.id));
      
      if (error) throw error;
      
      // Count questions by topic_id
      const counts: Record<number, number> = {};
      questions?.forEach(q => {
        counts[q.topic_id] = (counts[q.topic_id] || 0) + 1;
      });
      return counts;
    },
    enabled: !!languageId,
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
        <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Topics</h2>
        <p className="text-muted-foreground mb-4">
          Unable to fetch topics for this language. Please try again later.
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
        <Link to="/languages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {language?.name} Topics
          </h1>
          <p className="text-muted-foreground">
            Learn {language?.name} step by step through these topics
          </p>
        </div>
      </div>

      {topics && topics.length > 0 ? (
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm">
                      {index + 1}
                    </Badge>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {topic.name}
                      </CardTitle>
                      {topic.documentation && (
                        <CardDescription className="mt-2 line-clamp-2">
                          {topic.documentation.substring(0, 200)}...
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HelpCircle className="h-4 w-4" />
                    <span>{questionCounts?.[topic.id] || 0} questions</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={`/learn/${topic.id}`}>
                  <Button className="w-full">
                    Start Topic
                  </Button>
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
          <Link to="/languages">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Languages
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Topics;