//param ticket (dari getInitialProp dibawah)
const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

/**
 * Buat initial props dan masukkan props dari parent compoment _app.js
 * param client (koneksi browser ke container docker service)
 */
OrderIndex.getInitialProps = async (context, client) => {
  //ambil data dari order service
  const { data } = await client.get('/api/orders');
  //retur data hasil dan rtur ke komponen OrderIndex
  return { orders: data };
};

export default OrderIndex;
