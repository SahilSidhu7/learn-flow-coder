import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Globe } from "lucide-react";

const DEVELOPER = {
  name: "Sahil Sidhu",
  avatar: "https://avatars.githubusercontent.com/u/10534357?v=4", // Replace with your avatar URL
  linkedin: "https://www.linkedin.com/in/sahilsidhu7/", // Replace with your LinkedIn
  portfolio: "https://sahilsidhu.dev/", // Replace with your portfolio
  email: "mailto:sahilsidhu3127@gmail.com", // Replace with your email
};

const AboutMe = () => (
  <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[80vh]">
    <Card className="max-w-xl w-full text-center p-6">
      <CardHeader>
        <div className="flex flex-col items-center gap-2">
          <img
            src={DEVELOPER.avatar}
            alt={DEVELOPER.name}
            className="w-24 h-24 rounded-full border-4 border-primary shadow mb-2"
          />
          <CardTitle className="text-2xl mb-1">{DEVELOPER.name}</CardTitle>
          <CardDescription className="mb-2 text-base">
            Full Stack Developer & Creator of Learn Flow Coder
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6">
          Hi! I'm {DEVELOPER.name}, passionate about building tools that make
          learning to code fun and accessible. I love working with modern web
          technologies and sharing knowledge with the community. Thank you for
          being a part of this journey!
        </p>
        <div className="flex justify-center gap-6 mb-6">
          <a
            href={DEVELOPER.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="flex items-center gap-2">
              <Linkedin className="h-5 w-5" /> LinkedIn
            </Button>
          </a>
          <a
            href={DEVELOPER.portfolio}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="flex items-center gap-2">
              <Globe className="h-5 w-5" /> Portfolio
            </Button>
          </a>
        </div>
        <div className="mb-4 text-base text-center">
          <Mail className="inline-block h-5 w-5 mr-2 align-text-bottom text-primary" />
          <span className="font-medium select-all">
            sahilsidhu3127@gmail.com
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Feel free to connect for feedback, suggestions, or collaboration!
        </p>
      </CardContent>
    </Card>
  </div>
);

export default AboutMe;
