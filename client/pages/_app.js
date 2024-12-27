import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  //koneksi ke container service lain
  const client = buildClient(appContext.ctx);

  let data = {};  // Initialize var `data` as an empty object
  //beri kondisi ketika Cookie kosong agar tidak error
  try {
    const response = await client.get('/api/users/currentuser');
    data = response.data; // Store the data from the response
  } catch (error) {
    if (error.response && error.response.status === 401) {
      data = {}; // Set `data` to an empty object or any fallback value
    } else {
      throw error; // Re-throw other errors
    }
  }

  let pageProps = {}; //inisiasi var 'page props' kosong
  //jika child component memiliki getInitialProps maka jalankan terlebih dahulu
  if (appContext.Component.getInitialProps) {
    //masukkan data auth, koneksi server dan props kedalam arg
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  //retur semua props diatas agar bisa digunakan di child comp
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
