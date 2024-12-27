import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  /** Panggil fungsi hooks 
   *  doRequest : transaksi ke service dengan 4 propertynya
   *  error : menangkap error dari service ketika ada kesalahan
   */
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  //untuk kebutuhan countdown Expired order
  useEffect(() => {
    const findTimeLeft = () => {
      //kurangi date expired dengan waktu sekarang
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000)); //convert ke detik
    };

    findTimeLeft(); //jalankan sekali
    const timerId = setInterval(findTimeLeft, 1000); //lalu jalankan setiap 1detik

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) { //jika expired time habis
    //ganti info countdown dengan text info dibawah
    return <div>Order Expired</div>;
  }

  /** panggil library func StripeCheckout dengan property
   *  token : data token yang didapat dari trx ke stripe (id token digabung dg
   *  orderId) di doRequest diatas adalah syarat untuk create payment data
   *  stripeKey : copy dari akun stripe.com publish version
   *  amount : adalah jumlah pembayaran dikonversi cent (x 100)
   *  email : untuk syarat transaksi pembayar ke stripe
   */

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51QZ7umKliHhGkv0uYF0yjRQSiUXqkHuccNyzcgmIloYqHDzSZLq3OhTHkgWH0cA3svyvly1DRkla67fRNYWzN4Oc00dCVlbNyg"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

/**
 * Buat initial props dan masukkan props dari parent compoment _app.js
 * param context (props yang berisi id dari url browser)
 * param client (koneksi browser ke container docker service)
 */
OrderShow.getInitialProps = async (context, client) => {
  //panggil id order sesuai dengan nama file ini [orderId]
  const { orderId } = context.query;
  //cari data di service orders dengan param orderId
  const { data } = await client.get(`/api/orders/${orderId}`);
  //retur hasil load data ke componen OrderShow
  return { order: data };
};

export default OrderShow;
