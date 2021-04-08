import Head from 'next/head';
import { GlobalStyles } from '../styles/GlobalStyles';

const App = ({ Component, pageProps, router }) => {
  const { SITE_URL: siteURL = '' } = process.env;
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, viewport-fit=contain" />
        <link rel="canonical" href={siteURL + router.asPath} />
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
};

export default App;
