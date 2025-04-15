
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Built for educational purposes. Not for real trading.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
