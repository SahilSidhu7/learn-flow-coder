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
import { ArrowLeft, Code2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

const PersonalCourses = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [driveLink, setDriveLink] = useState("");
  const [posting, setPosting] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const queryClient = useQueryClient();
  // Fetch user credits from profiles table
  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["user-profile-credits"],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("User not found.");
      const { data, error } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    setUserCredits(userProfile?.credits ?? null);
  }, [userProfile]);

  const {
    data: userCourses,
    isLoading,
    isError,
    error,
  } = useQuery({
    // We add 'user' to the queryKey to ensure it's unique per user.
    queryKey: ["usercources", "user"],
    queryFn: async () => {
      // 1. Get the current authenticated user's session.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw userError || new Error("User not found.");
      }

      // 2. Fetch courses that match the current user's ID.
      // Supabase's Row Level Security will likely prevent fetching data
      // without filtering for the specific user.
      const { data, error } = await supabase
        .from("usercources")
        .select("id,course") // It's good practice to select only the columns you need.
        .eq("user_id", user.id) // Filter the results for the logged-in user.
        .order("course", { ascending: true }); // FIX: Order by the 'course' column, not 'name'.

      // 3. Handle any errors from the query.
      if (error) {
        console.error("Error fetching user courses:", error);
        throw error;
      }

      // 4. Return the data.
      return data;
    },
    // Optional: Add some configurations for retrying or stale time.
    retry: 1,
  });

  const handlePostToN8N = async () => {
    setPosting(true);
    try {
      // Get the current authenticated user's session for user id
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw userError || new Error("User not found.");
      }

      // Check if user has enough credits
      if (userCredits === null || userCredits < 1) {
        alert("You do not have enough credits to add a CHO link.");
        setPosting(false);
        return;
      }

      await fetch(
        "https://n8n.webappster.store/webhook/cc06a6ef-30f6-460e-bc7a-003d2f56a351",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ link: driveLink, user_id: user.id }),
        }
      );
      console.log("Posting to n8n agent:", driveLink, user.id);

      // Subtract 1 credit from user profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ credits: userCredits - 1 })
        .eq("id", user.id);
      if (updateError) {
        alert("Failed to subtract credit. Please try again.");
        setPosting(false);
        return;
      }

      // Refetch user profile and courses
      await queryClient.refetchQueries({ queryKey: ["user-profile-credits"] });
      await queryClient.refetchQueries({ queryKey: ["usercources", "user"] });
    } catch (error) {
      console.error("Error posting to n8n agent:", error);
    } finally {
      setPosting(false);
      setShowDialog(false);
      setDriveLink("");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
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
          Error Loading Courses
        </h2>
        <p className="text-muted-foreground mb-4">
          Unable to fetch Courses. Please try again later.
        </p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 w-full">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Choose a Course</h1>
            <p className="text-muted-foreground">
              Select a course to start learning
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary text-white rounded px-4 py-2 font-semibold shadow">
            Credits: {userCredits}
          </div>
          <button
            className="bg-primary text-white rounded-full p-2 shadow hover:bg-primary/80"
            onClick={() => setShowDialog(true)}
            title="Add Drive Link"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Dialog for Drive link input */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paste Drive Link of the CHO</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Paste Google Drive link here..."
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            disabled={posting}
          />
          <DialogFooter>
            <Button
              onClick={handlePostToN8N}
              disabled={
                posting ||
                !driveLink.trim() ||
                userCredits === null ||
                userCredits < 1
              }
            >
              {posting
                ? "Posting..."
                : userCredits === 0
                ? "No Credits"
                : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {userCourses && userCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCourses.map((usercourse) => (
            <Card
              key={usercourse.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="text-center">
                <Code2 className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle>{usercourse.course}</CardTitle>
                <CardDescription>
                  Start learning {usercourse.course}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={`/perstopics/${usercourse.id}`}>
                  <Button className="w-full">Start Learning</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Courses Available</h2>
          <p className="text-muted-foreground mb-4">
            There are no Courses available at the moment.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PersonalCourses;
