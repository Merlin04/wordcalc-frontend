import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, BaseStyles } from "theme-ui";
import { theme } from "../ui/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ThemeProvider theme={theme}>
        <BaseStyles>
          <Component {...pageProps} />
        </BaseStyles>
      </ThemeProvider>
  );
}

export default MyApp
