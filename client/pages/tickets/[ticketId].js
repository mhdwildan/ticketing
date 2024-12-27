import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  /** Panggil fungsi hooks 
   *  doRequest : transaksi ke service dengan 4 propertynya
   *  error : menangkap error dari service ketika ada kesalahan
   */
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    //teruskan ke route order dengan spesifik id order
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  //patikan ketika memanggil func doRequest() beri tempat props walaupun kosong
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

/**
 * Buat initial props dan masukkan props dari parent compoment _app.js
 * param context (props yang berisi id dari url browser)
 * param client (koneksi browser ke container docker service)
 */
TicketShow.getInitialProps = async (context, client) => {
  //panggil id ticker sesuai dengan nama file ini [ticketId]
  const { ticketId } = context.query; 
  //cari data di service tickets dengan param ticketId
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  //retur hasil load data ke componen TicketShow
  return { ticket: data };
};

export default TicketShow;
