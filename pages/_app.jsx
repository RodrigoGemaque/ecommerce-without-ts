import { AppProps } from 'next/app';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'

// redux
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../store'

//toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()



const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <title>OneBitGames</title>
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>

  )

}

export default MyApp
