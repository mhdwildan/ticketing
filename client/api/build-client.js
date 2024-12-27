import axios from 'axios';

// Fungsi Koneksi Browser ke container Docker komputer kita
export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server (SSR) di proses oleh server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        headers: {
          ...req.headers, // Spread existing headers from the request
          Host: req.headers.host || '', // Explicitly set Host if present
          Cookie: req.headers.cookie || '', // Explicitly set Cookie if present
        },
    });
  } else {
    // We must be on the browser (CSR) di proses oleh browser
    return axios.create({
      baseUrl: 'https://ticketing.dev/',
      
    });
  }
};
