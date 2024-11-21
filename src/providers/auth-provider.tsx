import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
          card: "bg-background",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "bg-card border border-border text-foreground hover:bg-muted",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-background border border-border text-foreground",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
          footer: "hidden",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
