import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'bootswatch/dist/simplex/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="./favicon.ico" />
        <link rel="apple-touch-icon" sizes="152x152" href="./icon-152.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#24bfa5" />
        <meta name="description" content="Final Exam Schedule for UIC" />
        <link rel="apple-touch-icon" href="./logo192.png" />
        <title>Final Countdown</title>
        <link rel="manifest" href="./manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
