import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";
import { UserProvider } from "./user-context";
import { WalletProviders } from "./wallet-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProviders>
          <UserProvider>
            {children}
          </UserProvider>
        </WalletProviders>
      </AuthProvider>
    </ThemeProvider>
  );
}
