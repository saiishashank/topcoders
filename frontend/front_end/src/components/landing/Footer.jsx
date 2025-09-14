import { Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t bg-card/50">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Topcoders</span>
            </div>
            <p className="text-muted-foreground mb-8">
              The ultimate platform for competitive programmers to connect, compete, and grow together.
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Topcoders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}