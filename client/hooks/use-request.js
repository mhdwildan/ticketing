import axios from 'axios';
import { useState } from 'react';

/**
 * Buat export func untuk component
 * param url : untuk alamat api service yg akan dituju
 * param method : method transaksi ke service (post/get/put/delete)
 * param body : inputan/data yang dikirim ke url 
 * param onSuccess : response dari transaksi
 */

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null); //wadah untuk error
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      //eksekudi transaksi ke service dengan props yang dibutuhkan
      const response = await axios[method](url, { ...body, ...props });
      //jika berhasil masukkan data ke props onSuccess
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      //buat info tampilan interface jika Error, masukkan ke state errors
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
