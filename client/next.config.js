module.exports = {
  webpack: (config) => {
    //cek perubahan yang ada di halaman client
    config.watchOptions.poll = 300; //setiap 300 Mili second 
    return config;
  },
};
