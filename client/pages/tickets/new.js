import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  
  /** Panggil fungsi hooks 
   *  doRequest : transaksi ke service dengan 4 propertynya
   *  error : menangkap error dari service ketika ada kesalahan
   */ 
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'), //lanjutkan ke route index.js
  });

  //jalankan fungsi ketika submit
  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  //funsi ketika user sudah selesai input (penyesuaian otomatis)
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) { // jika inputan bukan number
      return;
    }
    //buat hanya (.00) 2 angka di belakang koma
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
