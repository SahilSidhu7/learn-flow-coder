import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, BookOpen, Lightbulb, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState(null);

  // Check for logged in user on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignUp() {
    setAuthLoading(true);
    setAuthError("");
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
      setAuthLoading(false);
      return;
    }
    // Insert into profiles table with user id
    const userId = data?.user?.id;
    if (userId) {
      await supabase.from("profiles").insert({ id: userId });
    }
    setAuthLoading(false);
  }
  async function handleLogin() {
    setAuthLoading(true);
    setAuthError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
      setAuthLoading(false);
      return;
    }
    // After login, check if user id exists in profiles. If not, insert it.
    const userId = data?.user?.id;
    if (userId) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();
      if (profileError || !profile) {
        await supabase.from("profiles").insert({ id: userId });
      }
    }
    setAuthLoading(false);
    setShowAuthModal(false);
  }
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setShowAuthModal(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 text-center">
        <Link to="/personal-courses">
          <Button
            size="lg"
            variant="secondary"
            disabled={!user}
            style={{ marginBottom: 16 }}
          >
            Access Personal Courses
          </Button>
        </Link>
      </div>
      {/* Auth Button and Modal */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
        {user ? (
          <div>
            <span style={{ marginRight: 10 }}>
              Signed in as <b>{user.email.substring(0, 10)}</b>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowAuthModal(true)}
          >
            Sign In / Sign Up
          </Button>
        )}
      </div>
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 32,
              borderRadius: 12,
              minWidth: 320,
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
              Sign In / Sign Up
            </h2>
            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 8,
                fontSize: 16,
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 8,
                fontSize: 16,
              }}
            />
            {authError && (
              <div style={{ color: "red", marginBottom: 8 }}>{authError}</div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={handleLogin}
                disabled={authLoading}
                style={{ flex: 1 }}
              >
                Login
              </Button>
              <Button
                onClick={handleSignUp}
                disabled={authLoading}
                style={{ flex: 1 }}
                variant="outline"
              >
                Sign Up
              </Button>
            </div>
            <Button
              variant="ghost"
              style={{ marginTop: 16, width: "100%" }}
              onClick={() => setShowAuthModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Master Programming Languages
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Interactive learning platform with comprehensive documentation,
            practice questions, and a built-in compiler to help you become a
            better programmer.
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
                Learn programming concepts with detailed explanations and
                examples for each topic.
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
                Reinforce your learning with curated questions, hints, and
                detailed solutions for every topic.
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
                Test your solutions immediately with our integrated online
                compiler supporting multiple languages.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose from our curated programming languages and start learning
            with structured topics and hands-on practice.
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
